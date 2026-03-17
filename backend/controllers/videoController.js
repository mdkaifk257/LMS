const { pool } = require('../config/db');

exports.getVideosBySection = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videos WHERE section_id = ? ORDER BY order_index ASC', [req.params.sectionId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Video not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  const { section_id, title, youtube_url, duration, order_index } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES (?, ?, ?, ?, ?)',
      [section_id, title, youtube_url, duration, order_index]
    );
    res.status(201).json({ id: result.insertId, section_id, title, youtube_url, duration, order_index });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  const { title, youtube_url, duration, order_index } = req.body;
  try {
    await pool.query(
      'UPDATE videos SET title = ?, youtube_url = ?, duration = ?, order_index = ? WHERE id = ?',
      [title, youtube_url, duration, order_index, req.params.id]
    );
    res.json({ message: 'Video updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    await pool.query('DELETE FROM videos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reorderVideos = async (req, res) => {
  const { videos } = req.body; // { id, order_index }
  try {
    for (let video of videos) {
      await pool.query('UPDATE videos SET order_index = ? WHERE id = ?', [video.order_index, video.id]);
    }
    res.json({ message: 'Videos reordered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
