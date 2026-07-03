const mysql = require('mysql2/promise');

async function createMissingTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'duan2026'
    });
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        start_price DECIMAL(12,2),
        min_increment DECIMAL(12,2),
        buy_now_price DECIMAL(12,2),
        start_time DATETIME,
        end_time DATETIME,
        status VARCHAR(50),
        winner_id INT,
        created_at DATETIME,
        updated_at DATETIME
      );
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id INT AUTO_INCREMENT PRIMARY KEY,
        auction_id INT,
        bidder_id INT,
        bid_amount DECIMAL(12,2),
        bid_time DATETIME,
        status VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
      );
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        amount DECIMAL(12,2),
        payment_method VARCHAR(50),
        status VARCHAR(50),
        transaction_id VARCHAR(100),
        created_at DATETIME,
        updated_at DATETIME
      );
    `);
    
    console.log('Missing tables created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

createMissingTables();
