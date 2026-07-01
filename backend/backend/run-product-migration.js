/**
 * Chạy migration cột sản phẩm admin
 * node run-product-migration.js
 */
require('dotenv').config();
const db = require('./config/database');

const alters = [
  "ALTER TABLE san_pham ADD COLUMN ma_san_pham VARCHAR(50) NULL",
  "ALTER TABLE san_pham ADD COLUMN mo_ta_ngan VARCHAR(500) NULL",
  "ALTER TABLE san_pham ADD COLUMN gia_khuyen_mai DECIMAL(12,2) NULL",
  "ALTER TABLE san_pham ADD COLUMN km_bat_dau DATETIME NULL",
  "ALTER TABLE san_pham ADD COLUMN km_ket_thuc DATETIME NULL",
  "ALTER TABLE san_pham ADD COLUMN ngay_xoa DATETIME NULL",
];

async function run() {
  await db.authenticate();
  for (const sql of alters) {
    try {
      await db.query(sql);
      console.log('OK:', sql.slice(0, 60));
    } catch (e) {
      if (e.message.includes('Duplicate column')) console.log('Skip (exists):', sql.slice(13, 40));
      else console.warn('Warn:', e.message);
    }
  }
  await db.query(
    "UPDATE san_pham SET ma_san_pham = CONCAT('SP', LPAD(id, 4, '0')) WHERE ma_san_pham IS NULL OR ma_san_pham = ''"
  );
  console.log('Migration hoàn tất.');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
