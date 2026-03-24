const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateAccessToken, generateRefreshToken } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role === 'Admin' ? 'Admin' : 'Student';
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, assignedRole]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('--- REGISTRATION ERROR ---');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('---------------------------');
    res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Clean up old tokens for this user to avoid table bloat and session conflicts
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [user.id]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt]
    );

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const [tokens] = await pool.query('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
    if (tokens.length === 0) return res.status(403).json({ message: 'Invalid refresh token' });

    const dbToken = tokens[0];
    if (new Date(dbToken.expires_at) < new Date()) {
       await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [dbToken.id]);
       return res.status(403).json({ message: 'Refresh token expired' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });
      
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (users.length === 0) return res.status(403).json({ message: 'User not found' });
      
      const newAccessToken = generateAccessToken(users[0]);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
   const { refreshToken } = req.body;
   if(refreshToken){
      await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
   }
   res.json({ message: 'Logged out successfully' });
}

module.exports = { register, login, refreshToken, logout };
