const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require('mysql2'); // Force Vercel to bundle mysql2 dialect
const db = require("./config/database");// kết nối Sequelize
const routes = require("./routes/index.js") ; // import router tổng
const { ensureReviewSchema } = require('./utils/reviewSchema');
const session = require('express-session');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'huhu',
    resave: false, saveUninitialized: true,
    cookie: { secure: false } // để true nếu chạy HTTPS
  })
);

const path = require("path");
app.use(express.static("public"));
app.use('/image_cts', express.static(path.join(__dirname, 'public/images/products')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Gắn router chính
app.use("/api", routes);



// Kiểm tra kết nối DB + chuẩn bị bảng đánh giá
db.authenticate()
  .then(async () => {
    console.log("Database connected.");
    await ensureReviewSchema(db);
  })
  .catch(err => console.error("Database connection error:", err));

// Chạy server nếu không chạy ở môi trường serverless (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
