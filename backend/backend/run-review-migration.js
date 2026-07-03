/**
 * Migration cột id_san_pham cho bảng đánh giá
 * node run-review-migration.js
 */
require('dotenv').config();
const db = require('./config/database');

const alters = [
  'ALTER TABLE danh_gia MODIFY id_chi_tiet_don_hang INT NULL',
  'ALTER TABLE danh_gia ADD COLUMN id_san_pham INT NULL AFTER id_chi_tiet_don_hang',
  'ALTER TABLE danh_gia ADD KEY idx_danh_gia_san_pham (id_san_pham)',
];

async function run() {
  await db.authenticate();
  for (const sql of alters) {
    try {
      await db.query(sql);
      console.log('OK:', sql.slice(0, 70));
    } catch (e) {
      if (e.message.includes('Duplicate column') || e.message.includes('Duplicate key name')) {
        console.log('Skip (exists):', sql.slice(0, 50));
      } else {
        console.warn('Warn:', e.message);
      }
    }
  }
  console.log('Migration đánh giá hoàn tất.');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
