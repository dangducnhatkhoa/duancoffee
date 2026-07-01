-- Bổ sung cột cho quản lý sản phẩm admin
USE duan2026;

ALTER TABLE san_pham
  ADD COLUMN IF NOT EXISTS ma_san_pham VARCHAR(50) NULL AFTER id,
  ADD COLUMN IF NOT EXISTS mo_ta_ngan VARCHAR(500) NULL AFTER mo_ta,
  ADD COLUMN IF NOT EXISTS gia_khuyen_mai DECIMAL(12,2) NULL AFTER gia_goc,
  ADD COLUMN IF NOT EXISTS km_bat_dau DATETIME NULL AFTER gia_khuyen_mai,
  ADD COLUMN IF NOT EXISTS km_ket_thuc DATETIME NULL AFTER km_bat_dau,
  ADD COLUMN IF NOT EXISTS ngay_xoa DATETIME NULL AFTER an_hien;

-- Cập nhật mã sản phẩm cho dữ liệu cũ
UPDATE san_pham SET ma_san_pham = CONCAT('SP', LPAD(id, 4, '0')) WHERE ma_san_pham IS NULL OR ma_san_pham = '';
