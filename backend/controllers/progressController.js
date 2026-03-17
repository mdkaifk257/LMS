const { pool } = require('../config/db');

exports.updateProgress = async (req, res) => {
  const { video_id, watched_seconds, completed } = req.body;
  const user_id = req.user.id;

  try {
    const [existing] = await pool.query(
      'SELECT id, completed FROM video_progress WHERE user_id = ? AND video_id = ?',
      [user_id, video_id]
    );

    let isNowCompleted = completed;
    
    // Auto-complete logic 90% in frontend or verified here if duration sent
    if (existing.length > 0) {
      // Don't un-complete if already completed
      isNowCompleted = existing[0].completed ? true : completed;
      
      await pool.query(
        'UPDATE video_progress SET watched_seconds = ?, completed = ? WHERE user_id = ? AND video_id = ?',
        [watched_seconds, isNowCompleted, user_id, video_id]
      );
    } else {
      await pool.query(
        'INSERT INTO video_progress (user_id, video_id, watched_seconds, completed) VALUES (?, ?, ?, ?)',
        [user_id, video_id, watched_seconds, isNowCompleted]
      );
    }

    res.json({ message: 'Progress updated', watched_seconds, completed: isNowCompleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProgressBySubject = async (req, res) => {
  const user_id = req.user.id;
  const { subjectId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT vp.*, v.section_id 
      FROM video_progress vp
      JOIN videos v ON vp.video_id = v.id
      JOIN sections s ON v.section_id = s.id
      WHERE vp.user_id = ? AND s.subject_id = ?
    `, [user_id, subjectId]);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
