const { pool } = require('../config/db');

exports.getSectionsBySubject = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC', [req.params.subjectId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSection = async (req, res) => {
  const { subject_id, title, order_index } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject_id, title, order_index]);
    res.status(201).json({ id: result.insertId, subject_id, title, order_index });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSection = async (req, res) => {
  const { title, order_index } = req.body;
  try {
    await pool.query('UPDATE sections SET title = ?, order_index = ? WHERE id = ?', [title, order_index, req.params.id]);
    res.json({ message: 'Section updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    await pool.query('DELETE FROM sections WHERE id = ?', [req.params.id]);
    res.json({ message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reorderSections = async (req, res) => {
  const { sections } = req.body; // Array of { id, order_index }
  try {
    for (let section of sections) {
      await pool.query('UPDATE sections SET order_index = ? WHERE id = ?', [section.order_index, section.id]);
    }
    res.json({ message: 'Sections reordered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
