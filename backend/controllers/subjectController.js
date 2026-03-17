const { pool } = require('../config/db');

exports.getAllSubjects = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Subject not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubject = async (req, res) => {
  const { title, description, thumbnail, price } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO subjects (title, description, thumbnail, price) VALUES (?, ?, ?, ?)', [title, description, thumbnail, price || 0]);
    res.status(201).json({ id: result.insertId, title, description, thumbnail, price: price || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  const { title, description, thumbnail, price } = req.body;
  try {
    await pool.query('UPDATE subjects SET title = ?, description = ?, thumbnail = ?, price = ? WHERE id = ?', [title, description, thumbnail, price || 0, req.params.id]);
    res.json({ message: 'Subject updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await pool.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
