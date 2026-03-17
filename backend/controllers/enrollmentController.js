const { pool } = require('../config/db');

exports.enrollSubject = async (req, res) => {
  const { subject_id } = req.body;
  const user_id = req.user.id;
  try {
    const [result] = await pool.query(
      'INSERT INTO enrollments (user_id, subject_id) VALUES (?, ?)',
      [user_id, subject_id]
    );
    res.status(201).json({ id: result.insertId, user_id, subject_id });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Already enrolled in this subject' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(401).json({ message: 'Invalid session. Please logout and login again.' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getUserEnrollments = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id as enrollment_id, 
        s.*,
        (SELECT COUNT(*) FROM videos v JOIN sections sec ON v.section_id = sec.id WHERE sec.subject_id = s.id) as total_videos,
        (SELECT COUNT(*) FROM video_progress vp JOIN videos v ON vp.video_id = v.id JOIN sections sec ON v.section_id = sec.id WHERE sec.subject_id = s.id AND vp.user_id = ? AND vp.completed = 1) as completed_videos
      FROM enrollments e
      JOIN subjects s ON e.subject_id = s.id
      WHERE e.user_id = ?
    `, [user_id, user_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEnrollments = async (req, res) => {
  // Admin only
  try {
    const [rows] = await pool.query(`
      SELECT e.id as enrollment_id, u.name as user_name, u.email as user_email, s.title as subject_title, e.enrolled_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN subjects s ON e.subject_id = s.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
