/** Tự động cập nhật schema bảng đánh giá khi khởi động server */
async function ensureReviewSchema(db) {
  const alters = [
    'ALTER TABLE danh_gia MODIFY id_chi_tiet_don_hang INT NULL',
    'ALTER TABLE danh_gia ADD COLUMN id_san_pham INT NULL AFTER id_chi_tiet_don_hang',
    'ALTER TABLE danh_gia ADD KEY idx_danh_gia_san_pham (id_san_pham)',
  ];

  for (const sql of alters) {
    try {
      await db.query(sql);
    } catch (e) {
      const msg = e.message || '';
      if (!msg.includes('Duplicate column') && !msg.includes('Duplicate key name')) {
        console.warn('Review schema warn:', msg.slice(0, 120));
      }
    }
  }
}

async function findUserProductReview(db, userId, productId) {
  const rows = await db.query(`
    SELECT dg.id
    FROM danh_gia dg
    LEFT JOIN chi_tiet_don_hang ct ON dg.id_chi_tiet_don_hang = ct.id
    LEFT JOIN bien_the bt ON ct.id_bien_the = bt.id
    WHERE dg.id_nguoi_dung = :userId
      AND (dg.id_san_pham = :productId OR bt.id_san_pham = :productId)
    LIMIT 1
  `, {
    replacements: { userId, productId },
    type: db.QueryTypes.SELECT
  });

  return rows[0] || null;
}

module.exports = { ensureReviewSchema, findUserProductReview };
