// Import lớp Sequelize từ thư viện 'sequelize'
const { Sequelize } = require('sequelize');

// Giúp đọc các biến môi trường từ file .env (VD: DB_NAME, DB_USER, DB_PASS,...)
require('dotenv').config();

// Khởi tạo đối tượng Sequelize (tạo kết nối tới database)
const db = new Sequelize(
  process.env.DB_NAME,        // 🔹 Tên cơ sở dữ liệu (VD: watch_store_db)
  process.env.DB_USER,        // 🔹 Tên người dùng MySQL (VD: root)
  process.env.DB_PASSWORD || process.env.DB_PASS,    // 🔹 Mật khẩu của người dùng MySQL
  {
    host: process.env.DB_HOST, // 🔹 Địa chỉ máy chủ (VD: localhost hoặc 127.0.0.1)
    port: process.env.DB_PORT, // 🔹 Cổng kết nối MySQL (mặc định là 3306)
    dialect: 'mysql',          // 🔹 Loại CSDL dùng (MySQL, PostgreSQL, SQLite, MSSQL)
    logging: false,            // 🔹 Tắt log câu lệnh SQL (để console sạch hơn)
    timezone: '+07:00',        // 🔹 Múi giờ của server (GMT+7 cho Việt Nam)
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Xuất đối tượng kết nối để dùng ở nơi khác (controller, model, ...)
module.exports = db;
