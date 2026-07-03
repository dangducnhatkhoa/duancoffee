const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS duan2026');
    await connection.query('USE duan2026');
    
    const sqlScript = fs.readFileSync(path.join(__dirname, 'duan2026.sql'), 'utf8');
    const statements = sqlScript.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for (let statement of statements) {
      if (statement) {
        await connection.query(statement);
      }
    }
    
    console.log('Database created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

createDatabase();
