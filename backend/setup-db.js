const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  console.log('Connected to MySQL.');

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  console.log('Creating database and tables...');
  await connection.query(sql);
  
  console.log('Seeding data...');
  await connection.query(seed);

  console.log('Database setup complete!');
  await connection.end();
}

setup().catch(err => {
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('\n❌ Setup failed: Access denied to MySQL.');
    console.error('Please make sure you have entered the correct MySQL password in backend/.env');
  } else {
    console.error('\n❌ Setup failed:', err.message);
  }
  process.exit(1);
});
