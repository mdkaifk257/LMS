const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

async function testRegistration() {
  const name = 'Test User';
  const email = 'test' + Date.now() + '@example.com';
  const password = 'password123';
  const role = 'Student';

  console.log('Testing registration for:', email);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    console.log('Registration Success! User ID:', result.insertId);
    
    // Clean up
    await pool.query('DELETE FROM users WHERE id = ?', [result.insertId]);
    console.log('Cleanup successful.');
  } catch (error) {
    console.error('Registration Test Failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
  } finally {
    process.exit();
  }
}

testRegistration();
