-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th6 26, 2026 lúc 11:32 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `duan2026`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `auctions`
--

CREATE TABLE `auctions` (
  `id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `start_price` decimal(12,2) DEFAULT NULL,
  `min_increment` decimal(12,2) DEFAULT NULL,
  `buy_now_price` decimal(12,2) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `winner_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bai_viet`
--

CREATE TABLE `bai_viet` (
  `id` int NOT NULL,
  `id_loai_bai_viet` int DEFAULT NULL,
  `tieu_de` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci,
  `hinh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `luot_xem` int DEFAULT '0',
  `ngay_dang` datetime DEFAULT CURRENT_TIMESTAMP,
  `an_hien` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banner`
--

CREATE TABLE `banner` (
  `id` int NOT NULL,
  `ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hinh` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thu_tu` int DEFAULT '0',
  `an_hien` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bids`
--

CREATE TABLE `bids` (
  `id` int NOT NULL,
  `auction_id` int DEFAULT NULL,
  `bidder_id` int DEFAULT NULL,
  `bid_amount` decimal(12,2) DEFAULT NULL,
  `bid_time` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bien_the`
--

CREATE TABLE `bien_the` (
  `id` int NOT NULL,
  `id_san_pham` int NOT NULL,
  `ten_mau` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gia` decimal(12,2) NOT NULL,
  `so_luong_ton` int DEFAULT '0',
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'con_hang'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bien_the`
--

INSERT INTO `bien_the` (`id`, `id_san_pham`, `ten_mau`, `gia`, `so_luong_ton`, `trang_thai`) VALUES
(64, 1, '250g', 210000.00, 0, 'con_hang'),
(65, 1, '500g', 315000.00, 0, 'con_hang'),
(66, 1, '750g', 420000.00, 0, 'con_hang'),
(67, 2, '250g', 200000.00, 0, 'con_hang'),
(68, 2, '500g', 300000.00, 0, 'con_hang'),
(69, 2, '750g', 400000.00, 0, 'con_hang'),
(70, 3, '250g', 320000.00, 0, 'con_hang'),
(71, 3, '500g', 480000.00, 0, 'con_hang'),
(72, 3, '750g', 640000.00, 0, 'con_hang'),
(73, 4, '250g', 300000.00, 0, 'con_hang'),
(74, 4, '500g', 450000.00, 0, 'con_hang'),
(75, 4, '750g', 600000.00, 0, 'con_hang'),
(76, 5, '250g', 280000.00, 0, 'con_hang'),
(77, 5, '500g', 420000.00, 0, 'con_hang'),
(78, 5, '750g', 560000.00, 0, 'con_hang'),
(79, 6, '250g', 300000.00, 0, 'con_hang'),
(80, 6, '500g', 450000.00, 0, 'con_hang'),
(81, 6, '750g', 600000.00, 0, 'con_hang'),
(82, 7, '250g', 460000.00, 0, 'con_hang'),
(83, 7, '500g', 690000.00, 0, 'con_hang'),
(84, 7, '750g', 920000.00, 0, 'con_hang'),
(85, 8, '250g', 150000.00, 0, 'con_hang'),
(86, 8, '500g', 225000.00, 0, 'con_hang'),
(87, 8, '750g', 300000.00, 0, 'con_hang'),
(88, 9, '250g', 90000.00, 0, 'con_hang'),
(89, 9, '500g', 135000.00, 0, 'con_hang'),
(90, 9, '750g', 180000.00, 0, 'con_hang'),
(91, 10, '250g', 450000.00, 0, 'con_hang'),
(92, 10, '500g', 675000.00, 0, 'con_hang'),
(93, 10, '750g', 900000.00, 0, 'con_hang'),
(94, 11, '250g', 390000.00, 0, 'con_hang'),
(95, 11, '500g', 585000.00, 0, 'con_hang'),
(96, 11, '750g', 780000.00, 0, 'con_hang'),
(97, 12, '250g', 450000.00, 0, 'con_hang'),
(98, 12, '500g', 675000.00, 0, 'con_hang'),
(99, 12, '750g', 900000.00, 0, 'con_hang'),
(100, 13, '250g', 240000.00, 0, 'con_hang'),
(101, 13, '500g', 360000.00, 0, 'con_hang'),
(102, 13, '750g', 480000.00, 0, 'con_hang'),
(103, 14, '250g', 130000.00, 0, 'con_hang'),
(104, 14, '500g', 195000.00, 0, 'con_hang'),
(105, 14, '750g', 260000.00, 0, 'con_hang'),
(106, 15, '250g', 370000.00, 0, 'con_hang'),
(107, 15, '500g', 555000.00, 0, 'con_hang'),
(108, 15, '750g', 740000.00, 0, 'con_hang'),
(109, 16, '250g', 60000.00, 0, 'con_hang'),
(110, 16, '500g', 90000.00, 0, 'con_hang'),
(111, 16, '750g', 120000.00, 0, 'con_hang'),
(112, 17, '250g', 210000.00, 0, 'con_hang'),
(113, 17, '500g', 315000.00, 0, 'con_hang'),
(114, 17, '750g', 420000.00, 0, 'con_hang'),
(115, 18, '250g', 180000.00, 0, 'con_hang'),
(116, 18, '500g', 270000.00, 0, 'con_hang'),
(117, 18, '750g', 360000.00, 0, 'con_hang'),
(118, 19, '250g', 360000.00, 0, 'con_hang'),
(119, 19, '500g', 540000.00, 0, 'con_hang'),
(120, 19, '750g', 720000.00, 0, 'con_hang'),
(121, 20, '250g', 300000.00, 0, 'con_hang'),
(122, 20, '500g', 450000.00, 0, 'con_hang'),
(123, 20, '750g', 600000.00, 0, 'con_hang'),
(124, 21, '250g', 170000.00, 0, 'con_hang'),
(125, 21, '500g', 255000.00, 0, 'con_hang'),
(126, 21, '750g', 340000.00, 0, 'con_hang'),
(127, 22, '250g', 50000.00, 0, 'con_hang'),
(128, 22, '500g', 75000.00, 0, 'con_hang'),
(129, 22, '750g', 100000.00, 0, 'con_hang'),
(130, 23, '250g', 430000.00, 0, 'con_hang'),
(131, 23, '500g', 645000.00, 0, 'con_hang'),
(132, 23, '750g', 860000.00, 0, 'con_hang'),
(133, 24, '250g', 440000.00, 0, 'con_hang'),
(134, 24, '500g', 660000.00, 0, 'con_hang'),
(135, 24, '750g', 880000.00, 0, 'con_hang'),
(136, 25, '250g', 130000.00, 0, 'con_hang'),
(137, 25, '500g', 195000.00, 0, 'con_hang'),
(138, 25, '750g', 260000.00, 0, 'con_hang'),
(139, 26, '250g', 420000.00, 0, 'con_hang'),
(140, 26, '500g', 630000.00, 0, 'con_hang'),
(141, 26, '750g', 840000.00, 0, 'con_hang'),
(142, 27, '250g', 370000.00, 0, 'con_hang'),
(143, 27, '500g', 555000.00, 0, 'con_hang'),
(144, 27, '750g', 740000.00, 0, 'con_hang'),
(145, 28, '250g', 290000.00, 0, 'con_hang'),
(146, 28, '500g', 435000.00, 0, 'con_hang'),
(147, 28, '750g', 580000.00, 0, 'con_hang'),
(148, 29, '250g', 290000.00, 0, 'con_hang'),
(149, 29, '500g', 435000.00, 0, 'con_hang'),
(150, 29, '750g', 580000.00, 0, 'con_hang'),
(151, 30, '250g', 220000.00, 0, 'con_hang'),
(152, 30, '500g', 330000.00, 0, 'con_hang'),
(153, 30, '750g', 440000.00, 0, 'con_hang'),
(154, 31, '250g', 310000.00, 0, 'con_hang'),
(155, 31, '500g', 465000.00, 0, 'con_hang'),
(156, 31, '750g', 620000.00, 0, 'con_hang'),
(157, 32, '250g', 450000.00, 0, 'con_hang'),
(158, 32, '500g', 675000.00, 0, 'con_hang'),
(159, 32, '750g', 900000.00, 0, 'con_hang'),
(160, 33, '250g', 330000.00, 0, 'con_hang'),
(161, 33, '500g', 495000.00, 0, 'con_hang'),
(162, 33, '750g', 660000.00, 0, 'con_hang'),
(163, 34, '250g', 190000.00, 0, 'con_hang'),
(164, 34, '500g', 285000.00, 0, 'con_hang'),
(165, 34, '750g', 380000.00, 0, 'con_hang'),
(166, 35, '250g', 210000.00, 0, 'con_hang'),
(167, 35, '500g', 315000.00, 0, 'con_hang'),
(168, 35, '750g', 420000.00, 0, 'con_hang'),
(169, 36, '250g', 350000.00, 0, 'con_hang'),
(170, 36, '500g', 525000.00, 0, 'con_hang'),
(171, 36, '750g', 700000.00, 0, 'con_hang'),
(172, 37, '250g', 140000.00, 0, 'con_hang'),
(173, 37, '500g', 210000.00, 0, 'con_hang'),
(174, 37, '750g', 280000.00, 0, 'con_hang'),
(175, 38, '250g', 220000.00, 0, 'con_hang'),
(176, 38, '500g', 330000.00, 0, 'con_hang'),
(177, 38, '750g', 440000.00, 0, 'con_hang'),
(178, 39, '250g', 110000.00, 0, 'con_hang'),
(179, 39, '500g', 165000.00, 0, 'con_hang'),
(180, 39, '750g', 220000.00, 0, 'con_hang'),
(181, 40, '250g', 310000.00, 0, 'con_hang'),
(182, 40, '500g', 465000.00, 0, 'con_hang'),
(183, 40, '750g', 620000.00, 0, 'con_hang'),
(184, 41, '250g', 370000.00, 0, 'con_hang'),
(185, 41, '500g', 555000.00, 0, 'con_hang'),
(186, 41, '750g', 740000.00, 0, 'con_hang'),
(187, 42, '250g', 460000.00, 0, 'con_hang'),
(188, 42, '500g', 690000.00, 0, 'con_hang'),
(189, 42, '750g', 920000.00, 0, 'con_hang'),
(190, 43, '250g', 300000.00, 0, 'con_hang'),
(191, 43, '500g', 450000.00, 0, 'con_hang'),
(192, 43, '750g', 600000.00, 0, 'con_hang'),
(193, 44, '250g', 260000.00, 0, 'con_hang'),
(194, 44, '500g', 390000.00, 0, 'con_hang'),
(195, 44, '750g', 520000.00, 0, 'con_hang'),
(196, 45, '250g', 220000.00, 0, 'con_hang'),
(197, 45, '500g', 330000.00, 0, 'con_hang'),
(198, 45, '750g', 440000.00, 0, 'con_hang'),
(199, 46, '250g', 360000.00, 0, 'con_hang'),
(200, 46, '500g', 540000.00, 0, 'con_hang'),
(201, 46, '750g', 720000.00, 0, 'con_hang'),
(202, 47, '250g', 220000.00, 0, 'con_hang'),
(203, 47, '500g', 330000.00, 0, 'con_hang'),
(204, 47, '750g', 440000.00, 0, 'con_hang'),
(205, 48, '250g', 400000.00, 0, 'con_hang'),
(206, 48, '500g', 600000.00, 0, 'con_hang'),
(207, 48, '750g', 800000.00, 0, 'con_hang'),
(208, 49, '250g', 390000.00, 0, 'con_hang'),
(209, 49, '500g', 585000.00, 0, 'con_hang'),
(210, 49, '750g', 780000.00, 0, 'con_hang'),
(211, 50, '250g', 450000.00, 0, 'con_hang'),
(212, 50, '500g', 675000.00, 0, 'con_hang'),
(213, 50, '750g', 900000.00, 0, 'con_hang'),
(214, 51, '250g', 210000.00, 0, 'con_hang'),
(215, 51, '500g', 315000.00, 0, 'con_hang'),
(216, 51, '750g', 420000.00, 0, 'con_hang'),
(217, 52, '250g', 130000.00, 0, 'con_hang'),
(218, 52, '500g', 195000.00, 0, 'con_hang'),
(219, 52, '750g', 260000.00, 0, 'con_hang'),
(220, 53, '250g', 470000.00, 0, 'con_hang'),
(221, 53, '500g', 705000.00, 0, 'con_hang'),
(222, 53, '750g', 940000.00, 0, 'con_hang'),
(223, 54, '250g', 430000.00, 0, 'con_hang'),
(224, 54, '500g', 645000.00, 0, 'con_hang'),
(225, 54, '750g', 860000.00, 0, 'con_hang'),
(226, 55, '250g', 300000.00, 0, 'con_hang'),
(227, 55, '500g', 450000.00, 0, 'con_hang'),
(228, 55, '750g', 600000.00, 0, 'con_hang'),
(229, 56, '250g', 80000.00, 0, 'con_hang'),
(230, 56, '500g', 120000.00, 0, 'con_hang'),
(231, 56, '750g', 160000.00, 0, 'con_hang'),
(232, 57, '250g', 200000.00, 0, 'con_hang'),
(233, 57, '500g', 300000.00, 0, 'con_hang'),
(234, 57, '750g', 400000.00, 0, 'con_hang'),
(235, 58, '250g', 150000.00, 0, 'con_hang'),
(236, 58, '500g', 225000.00, 0, 'con_hang'),
(237, 58, '750g', 300000.00, 0, 'con_hang'),
(238, 59, '250g', 330000.00, 0, 'con_hang'),
(239, 59, '500g', 495000.00, 0, 'con_hang'),
(240, 59, '750g', 660000.00, 0, 'con_hang'),
(241, 60, '250g', 260000.00, 0, 'con_hang'),
(242, 60, '500g', 390000.00, 0, 'con_hang'),
(243, 60, '750g', 520000.00, 0, 'con_hang');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_don_hang`
--

CREATE TABLE `chi_tiet_don_hang` (
  `id` int NOT NULL,
  `id_don_hang` int NOT NULL,
  `id_bien_the` int NOT NULL,
  `don_gia` decimal(12,2) NOT NULL,
  `so_luong` int NOT NULL,
  `thanh_tien` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`id`, `id_don_hang`, `id_bien_the`, `don_gia`, `so_luong`, `thanh_tien`) VALUES
(1, 1, 97, 450000.00, 1, 450000.00),
(2, 2, 97, 450000.00, 1, 450000.00),
(3, 3, 97, 450000.00, 1, 450000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_gia`
--

CREATE TABLE `danh_gia` (
  `id` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_chi_tiet_don_hang` int NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci,
  `sao` int DEFAULT NULL,
  `hinh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thoi_gian` datetime DEFAULT CURRENT_TIMESTAMP,
  `an_hien` tinyint(1) DEFAULT '1',
  `tra_loi` text COLLATE utf8mb4_unicode_ci
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc`
--

CREATE TABLE `danh_muc` (
  `id` int NOT NULL,
  `ten_danh_muc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `an_hien` tinyint(1) DEFAULT '1',
  `thu_tu` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc`
--

INSERT INTO `danh_muc` (`id`, `ten_danh_muc`, `slug`, `hinh_anh`, `mo_ta`, `an_hien`, `thu_tu`) VALUES
(1, 'Cà phê hòa tan', 'ca-phe-hoa-tan', 'cat_placeholder.jpg', 'Danh mục Cà phê hòa tan', 1, 0),
(2, 'Cà phê rang xay', 'ca-phe-rang-xay', 'cat_placeholder.jpg', 'Danh mục Cà phê rang xay', 1, 0),
(3, 'Cà phê hạt', 'ca-phe-hat', 'cat_placeholder.jpg', 'Danh mục Cà phê hạt', 1, 0),
(4, 'Cà phê túi lọc', 'ca-phe-tui-loc', 'cat_placeholder.jpg', 'Danh mục Cà phê túi lọc', 1, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dia_chi`
--

CREATE TABLE `dia_chi` (
  `id` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phuong` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tinh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loai_dia_chi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mac_dinh` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `don_hang`
--

CREATE TABLE `don_hang` (
  `id` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_ma_giam_gia` int DEFAULT NULL,
  `ma_don` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten_nguoi_nhan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi_nguoi_nhan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdt_nguoi_nhan` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` text COLLATE utf8mb4_unicode_ci,
  `phuong_thuc_thanh_toan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'COD',
  `so_tien_thanh_toan` decimal(12,2) NOT NULL,
  `thoi_diem_thanh_toan` datetime DEFAULT NULL,
  `trang_thai_don_hang` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'cho_xac_nhan',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `don_hang`
--

INSERT INTO `don_hang` (`id`, `id_nguoi_dung`, `id_ma_giam_gia`, `ma_don`, `ho_ten_nguoi_nhan`, `dia_chi_nguoi_nhan`, `sdt_nguoi_nhan`, `ghi_chu`, `phuong_thuc_thanh_toan`, `so_tien_thanh_toan`, `thoi_diem_thanh_toan`, `trang_thai_don_hang`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 4, NULL, 'ORD-1781890382140-db68f7', 'Test User', '123 Nguyen Hue, Q1, TP.HCM', '0123456789', '', 'cod', 450000.00, NULL, 'pending', '2026-06-20 00:33:02', '2026-06-20 00:33:02'),
(2, 4, NULL, 'ORD-1781890539390-6733c3', 'Test User', '123 Test Address', '0123456789', '', 'cod', 450000.00, NULL, 'pending', '2026-06-20 00:35:39', '2026-06-20 00:35:39'),
(3, 4, NULL, 'ORD-1781890693533-f8a6fe', 'Test User', '123 Test Address', '0123456789', '', 'cod', 450000.00, NULL, 'da_huy', '2026-06-20 00:38:13', '2026-06-20 12:44:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `gio_hang`
--

CREATE TABLE `gio_hang` (
  `id` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_bien_the` int NOT NULL,
  `so_luong` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_anh`
--

CREATE TABLE `hinh_anh` (
  `id` int NOT NULL,
  `id_san_pham` int NOT NULL,
  `hinh` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thu_tu` int DEFAULT '0',
  `ngay_dang` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hinh_anh`
--

INSERT INTO `hinh_anh` (`id`, `id_san_pham`, `hinh`, `thu_tu`, `ngay_dang`) VALUES
(1, 1, 'coffee_1.jpg', 0, '2026-06-06 21:25:17'),
(2, 2, 'coffee_2.jpg', 0, '2026-06-06 21:25:17'),
(3, 3, 'coffee_3.jpg', 0, '2026-06-06 21:25:17'),
(4, 4, 'coffee_4.jpg', 0, '2026-06-06 21:25:17'),
(5, 5, 'coffee_5.jpg', 0, '2026-06-06 21:25:17'),
(6, 6, 'coffee_6.jpg', 0, '2026-06-06 21:25:17'),
(7, 7, 'coffee_7.jpg', 0, '2026-06-06 21:25:17'),
(8, 8, 'coffee_8.jpg', 0, '2026-06-06 21:25:17'),
(9, 9, 'coffee_9.jpg', 0, '2026-06-06 21:25:17'),
(10, 10, 'coffee_10.jpg', 0, '2026-06-06 21:25:17'),
(11, 11, 'coffee_11.jpg', 0, '2026-06-06 21:25:17'),
(12, 12, 'coffee_12.jpg', 0, '2026-06-06 21:25:17'),
(13, 13, 'coffee_13.jpg', 0, '2026-06-06 21:25:17'),
(14, 14, 'coffee_14.jpg', 0, '2026-06-06 21:25:17'),
(15, 15, 'coffee_15.jpg', 0, '2026-06-06 21:25:17'),
(16, 16, 'coffee_16.jpg', 0, '2026-06-06 21:25:17'),
(17, 17, 'coffee_17.jpg', 0, '2026-06-06 21:25:17'),
(18, 18, 'coffee_18.jpg', 0, '2026-06-06 21:25:17'),
(19, 19, 'coffee_19.jpg', 0, '2026-06-06 21:25:17'),
(20, 20, 'coffee_20.jpg', 0, '2026-06-06 21:25:17'),
(21, 21, 'coffee_21.jpg', 0, '2026-06-06 21:25:17'),
(22, 22, 'coffee_22.jpg', 0, '2026-06-06 21:25:17'),
(23, 23, 'coffee_23.jpg', 0, '2026-06-06 21:25:17'),
(24, 24, 'coffee_24.jpg', 0, '2026-06-06 21:25:17'),
(25, 25, 'coffee_25.jpg', 0, '2026-06-06 21:25:17'),
(26, 26, 'coffee_26.jpg', 0, '2026-06-06 21:25:17'),
(27, 27, 'coffee_27.jpg', 0, '2026-06-06 21:25:17'),
(28, 28, 'coffee_28.jpg', 0, '2026-06-06 21:25:17'),
(29, 29, 'coffee_29.jpg', 0, '2026-06-06 21:25:17'),
(30, 30, 'coffee_30.jpg', 0, '2026-06-06 21:25:17'),
(31, 31, 'coffee_31.jpg', 0, '2026-06-06 21:25:17'),
(32, 32, 'coffee_32.jpg', 0, '2026-06-06 21:25:17'),
(33, 33, 'coffee_33.jpg', 0, '2026-06-06 21:25:17'),
(34, 34, 'coffee_34.jpg', 0, '2026-06-06 21:25:17'),
(35, 35, 'coffee_35.jpg', 0, '2026-06-06 21:25:17'),
(36, 36, 'coffee_36.jpg', 0, '2026-06-06 21:25:17'),
(37, 37, 'coffee_37.jpg', 0, '2026-06-06 21:25:17'),
(38, 38, 'coffee_38.jpg', 0, '2026-06-06 21:25:17'),
(39, 39, 'coffee_39.jpg', 0, '2026-06-06 21:25:17'),
(40, 40, 'coffee_40.jpg', 0, '2026-06-06 21:25:17'),
(41, 41, 'coffee_41.jpg', 0, '2026-06-06 21:25:17'),
(42, 42, 'coffee_42.jpg', 0, '2026-06-06 21:25:17'),
(43, 43, 'coffee_43.jpg', 0, '2026-06-06 21:25:17'),
(44, 44, 'coffee_44.jpg', 0, '2026-06-06 21:25:17'),
(45, 45, 'coffee_45.jpg', 0, '2026-06-06 21:25:17'),
(46, 46, 'coffee_46.jpg', 0, '2026-06-06 21:25:17'),
(47, 47, 'coffee_47.jpg', 0, '2026-06-06 21:25:17'),
(48, 48, 'coffee_48.jpg', 0, '2026-06-06 21:25:17'),
(49, 49, 'coffee_49.jpg', 0, '2026-06-06 21:25:17'),
(50, 50, 'coffee_50.jpg', 0, '2026-06-06 21:25:17'),
(51, 51, 'coffee_51.jpg', 0, '2026-06-06 21:25:17'),
(52, 52, 'coffee_52.jpg', 0, '2026-06-06 21:25:17'),
(53, 53, 'coffee_53.jpg', 0, '2026-06-06 21:25:17'),
(54, 54, 'coffee_54.jpg', 0, '2026-06-06 21:25:17'),
(55, 55, 'coffee_55.jpg', 0, '2026-06-06 21:25:17'),
(56, 56, 'coffee_56.jpg', 0, '2026-06-06 21:25:17'),
(57, 57, 'coffee_57.jpg', 0, '2026-06-06 21:25:17'),
(58, 58, 'coffee_58.jpg', 0, '2026-06-06 21:25:17'),
(59, 59, 'coffee_59.jpg', 0, '2026-06-06 21:25:17'),
(60, 60, 'coffee_60.jpg', 0, '2026-06-06 21:25:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loai_bai_viet`
--

CREATE TABLE `loai_bai_viet` (
  `id` int NOT NULL,
  `ten_loai` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thu_tu` int DEFAULT '0',
  `an_hien` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ma_giam_gia`
--

CREATE TABLE `ma_giam_gia` (
  `id` int NOT NULL,
  `ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_ap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gia_tri_giam` decimal(12,2) NOT NULL,
  `kieu_giam_gia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'phan_tram',
  `gia_tri_don_toi_thieu` decimal(12,2) DEFAULT '0.00',
  `gia_tri_giam_toi_da` decimal(12,2) DEFAULT NULL,
  `so_luong` int DEFAULT '1',
  `ket_thuc` datetime NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `an_hien` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int NOT NULL,
  `vai_tro` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_dang_nhap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `anh_dai_dien` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `ma_kich_hoat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_quen_mat_khau` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `han_token` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `vai_tro`, `ho_ten`, `so_dien_thoai`, `email`, `ten_dang_nhap`, `mat_khau`, `ngay_sinh`, `anh_dai_dien`, `trang_thai`, `ma_kich_hoat`, `token_quen_mat_khau`, `han_token`, `ngay_tao`) VALUES
(1, 'buyer', 'hhaanh', '+849899202', 'hoanganhyy9@gmail.com', '', '$2b$10$dm3bMRSHXKAnilRtrJeWP.em7oUOwj4LM.zIBaDu3FYPFaWDUV/NC', NULL, NULL, 'active', '8b544dbe49209ad372da13f8d1cf161dd32757c74f959c3548a08a9b96ac7a2b', NULL, '2026-06-10 21:08:32', '2026-06-09 21:08:32'),
(2, 'admin', 'Quản Trị Viên', '0901234567', 'admin@gmail.com', 'admin', '$2b$10$XMavB13JkIIbNBuxzQ4w4O/0b6Vd1DqMFIeiC4mPEHmnzkc/3ChJm', NULL, NULL, 'active', NULL, NULL, NULL, '2026-06-19 23:02:58'),
(3, 'buyer', 'lê trọng tùng', '0396925132', 'ltungtrong@gmail.com', 'ltungtrong@gmail.com', '$2b$10$4nQlNzsc3kEuxQXsCePcceeCQmwkzcmEiOJc1oarWx/e9fZYrejBe', NULL, NULL, 'active', '89e08d3da46ae8e425724ca1ce9fe3cbff738ea458b5aa15e0b5bcf060a0fbe5', NULL, '2026-06-20 23:27:17', '2026-06-19 23:27:17'),
(4, 'buyer', 'Test User', '0123456789', 'testuser@gmail.com', 'testuser@gmail.com', '$2b$10$4lz09g6ooh03PrjBjfxHMuskEdRS0PRUneUbAaXDTVU2ZDJewc1Pq', NULL, NULL, 'active', 'e43f1cfb680732e3485844b0f5525cecdb81214780a92f2a11fc7520ad2c5a32', NULL, '2026-06-21 00:28:34', '2026-06-20 00:28:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

CREATE TABLE `san_pham` (
  `id` int NOT NULL,
  `id_danh_muc` int NOT NULL,
  `id_thuong_hieu` int DEFAULT NULL,
  `ten_san_pham` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gia_goc` decimal(12,2) NOT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `luot_xem` int DEFAULT '0',
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'con_hang',
  `an_hien` tinyint(1) DEFAULT '1',
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ma_san_pham` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mo_ta_ngan` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gia_khuyen_mai` decimal(12,2) DEFAULT NULL,
  `km_bat_dau` datetime DEFAULT NULL,
  `km_ket_thuc` datetime DEFAULT NULL,
  `ngay_xoa` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `san_pham`
--

INSERT INTO `san_pham` (`id`, `id_danh_muc`, `id_thuong_hieu`, `ten_san_pham`, `gia_goc`, `hinh_anh`, `mo_ta`, `slug`, `luot_xem`, `trang_thai`, `an_hien`, `deleted_at`, `created_at`, `updated_at`, `ma_san_pham`, `mo_ta_ngan`, `gia_khuyen_mai`, `km_bat_dau`, `km_ket_thuc`, `ngay_xoa`) VALUES
(1, 1, 5, 'Cà phê hòa tan Highlands Đặc Biệt Số 1', 210000.00, 'coffee_1.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-highlands-dac-biet-so-1', 946, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0001', NULL, NULL, NULL, NULL, NULL),
(2, 1, 2, 'Cà phê hòa tan King Coffee Đặc Biệt Số 2', 200000.00, 'coffee_2.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-king-coffee-dac-biet-so-2', 669, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0002', NULL, NULL, NULL, NULL, NULL),
(3, 4, 1, 'Cà phê túi lọc Trung Nguyên Đặc Biệt Số 3', 320000.00, 'coffee_3.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-trung-nguyen-dac-biet-so-3', 405, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0003', NULL, NULL, NULL, NULL, NULL),
(4, 1, 6, 'Cà phê hòa tan Phúc Long Đặc Biệt Số 4', 300000.00, 'coffee_4.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-phuc-long-dac-biet-so-4', 918, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0004', NULL, NULL, NULL, NULL, NULL),
(5, 2, 5, 'Cà phê rang xay Highlands Đặc Biệt Số 5', 280000.00, 'coffee_5.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-highlands-dac-biet-so-5', 376, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0005', NULL, NULL, NULL, NULL, NULL),
(6, 1, 5, 'Cà phê hòa tan Highlands Đặc Biệt Số 6', 300000.00, 'coffee_6.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-highlands-dac-biet-so-6', 795, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0006', NULL, NULL, NULL, NULL, NULL),
(7, 3, 5, 'Cà phê hạt Highlands Đặc Biệt Số 7', 460000.00, 'coffee_7.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-highlands-dac-biet-so-7', 247, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0007', NULL, NULL, NULL, NULL, NULL),
(8, 2, 1, 'Cà phê rang xay Trung Nguyên Đặc Biệt Số 8', 150000.00, 'coffee_8.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-trung-nguyen-dac-biet-so-8', 689, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0008', NULL, NULL, NULL, NULL, NULL),
(9, 1, 4, 'Cà phê hòa tan Vinacafe Đặc Biệt Số 9', 90000.00, 'coffee_9.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-vinacafe-dac-biet-so-9', 804, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0009', NULL, NULL, NULL, NULL, NULL),
(10, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 10', 450000.00, 'coffee_10.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-10', 552, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-20 12:49:58', 'SP0010', NULL, NULL, NULL, NULL, NULL),
(11, 3, 4, 'Cà phê hạt Vinacafe Đặc Biệt Số 11', 390000.00, 'coffee_11.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-vinacafe-dac-biet-so-11', 916, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-20 12:49:59', 'SP0011', NULL, NULL, NULL, NULL, NULL),
(12, 4, 4, 'Cà phê túi lọc Vinacafe Đặc Biệt Số 12', 450000.00, 'coffee_12.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-vinacafe-dac-biet-so-12', 957, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-20 13:18:23', 'SP0012', NULL, NULL, NULL, NULL, NULL),
(13, 4, 3, 'Cà phê túi lọc Nescafe Đặc Biệt Số 13', 240000.00, 'coffee_13.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-nescafe-dac-biet-so-13', 303, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0013', NULL, NULL, NULL, NULL, NULL),
(14, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 14', 130000.00, 'coffee_14.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-14', 163, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0014', NULL, NULL, NULL, NULL, NULL),
(15, 3, 4, 'Cà phê hạt Vinacafe Đặc Biệt Số 15', 370000.00, 'coffee_15.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-vinacafe-dac-biet-so-15', 111, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0015', NULL, NULL, NULL, NULL, NULL),
(16, 1, 5, 'Cà phê hòa tan Highlands Đặc Biệt Số 16', 60000.00, 'coffee_16.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-highlands-dac-biet-so-16', 411, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0016', NULL, NULL, NULL, NULL, NULL),
(17, 1, 1, 'Cà phê hòa tan Trung Nguyên Đặc Biệt Số 17', 210000.00, 'coffee_17.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-trung-nguyen-dac-biet-so-17', 558, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0017', NULL, NULL, NULL, NULL, NULL),
(18, 2, 6, 'Cà phê rang xay Phúc Long Đặc Biệt Số 18', 180000.00, 'coffee_18.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-phuc-long-dac-biet-so-18', 903, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0018', NULL, NULL, NULL, NULL, NULL),
(19, 4, 6, 'Cà phê túi lọc Phúc Long Đặc Biệt Số 19', 360000.00, 'coffee_19.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-phuc-long-dac-biet-so-19', 9, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0019', NULL, NULL, NULL, NULL, NULL),
(20, 3, 2, 'Cà phê hạt King Coffee Đặc Biệt Số 20', 300000.00, 'coffee_20.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-king-coffee-dac-biet-so-20', 244, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0020', NULL, NULL, NULL, NULL, NULL),
(21, 1, 2, 'Cà phê hòa tan King Coffee Đặc Biệt Số 21', 170000.00, 'coffee_21.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-king-coffee-dac-biet-so-21', 840, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0021', NULL, NULL, NULL, NULL, NULL),
(22, 2, 4, 'Cà phê rang xay Vinacafe Đặc Biệt Số 22', 50000.00, 'coffee_22.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-vinacafe-dac-biet-so-22', 808, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0022', NULL, NULL, NULL, NULL, NULL),
(23, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 23', 430000.00, 'coffee_23.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-23', 264, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0023', NULL, NULL, NULL, NULL, NULL),
(24, 1, 6, 'Cà phê hòa tan Phúc Long Đặc Biệt Số 24', 440000.00, 'coffee_24.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-phuc-long-dac-biet-so-24', 261, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0024', NULL, NULL, NULL, NULL, NULL),
(25, 1, 6, 'Cà phê hòa tan Phúc Long Đặc Biệt Số 25', 130000.00, 'coffee_25.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-phuc-long-dac-biet-so-25', 185, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0025', NULL, NULL, NULL, NULL, NULL),
(26, 2, 6, 'Cà phê rang xay Phúc Long Đặc Biệt Số 26', 420000.00, 'coffee_26.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-phuc-long-dac-biet-so-26', 652, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0026', NULL, NULL, NULL, NULL, NULL),
(27, 3, 5, 'Cà phê hạt Highlands Đặc Biệt Số 27', 370000.00, 'coffee_27.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-highlands-dac-biet-so-27', 145, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0027', NULL, NULL, NULL, NULL, NULL),
(28, 1, 5, 'Cà phê hòa tan Highlands Đặc Biệt Số 28', 290000.00, 'coffee_28.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-highlands-dac-biet-so-28', 933, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0028', NULL, NULL, NULL, NULL, NULL),
(29, 2, 1, 'Cà phê rang xay Trung Nguyên Đặc Biệt Số 29', 290000.00, 'coffee_29.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-trung-nguyen-dac-biet-so-29', 199, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0029', NULL, NULL, NULL, NULL, NULL),
(30, 3, 2, 'Cà phê hạt King Coffee Đặc Biệt Số 30', 220000.00, 'coffee_30.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-king-coffee-dac-biet-so-30', 448, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0030', NULL, NULL, NULL, NULL, NULL),
(31, 4, 2, 'Cà phê túi lọc King Coffee Đặc Biệt Số 31', 310000.00, 'coffee_31.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-king-coffee-dac-biet-so-31', 773, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0031', NULL, NULL, NULL, NULL, NULL),
(32, 2, 6, 'Cà phê rang xay Phúc Long Đặc Biệt Số 32', 450000.00, 'coffee_32.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-phuc-long-dac-biet-so-32', 429, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0032', NULL, NULL, NULL, NULL, NULL),
(33, 1, 2, 'Cà phê hòa tan King Coffee Đặc Biệt Số 33', 330000.00, 'coffee_33.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-king-coffee-dac-biet-so-33', 706, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0033', NULL, NULL, NULL, NULL, NULL),
(34, 3, 3, 'Cà phê hạt Nescafe Đặc Biệt Số 34', 190000.00, 'coffee_34.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-nescafe-dac-biet-so-34', 504, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0034', NULL, NULL, NULL, NULL, NULL),
(35, 4, 2, 'Cà phê túi lọc King Coffee Đặc Biệt Số 35', 210000.00, 'coffee_35.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-king-coffee-dac-biet-so-35', 940, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0035', NULL, NULL, NULL, NULL, NULL),
(36, 1, 4, 'Cà phê hòa tan Vinacafe Đặc Biệt Số 36', 350000.00, 'coffee_36.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-vinacafe-dac-biet-so-36', 210, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0036', NULL, NULL, NULL, NULL, NULL),
(37, 4, 4, 'Cà phê túi lọc Vinacafe Đặc Biệt Số 37', 140000.00, 'coffee_37.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-vinacafe-dac-biet-so-37', 443, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0037', NULL, NULL, NULL, NULL, NULL),
(38, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 38', 220000.00, 'coffee_38.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-38', 562, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0038', NULL, NULL, NULL, NULL, NULL),
(39, 2, 3, 'Cà phê rang xay Nescafe Đặc Biệt Số 39', 110000.00, 'coffee_39.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-nescafe-dac-biet-so-39', 796, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0039', NULL, NULL, NULL, NULL, NULL),
(40, 1, 4, 'Cà phê hòa tan Vinacafe Đặc Biệt Số 40', 310000.00, 'coffee_40.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-vinacafe-dac-biet-so-40', 44, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0040', NULL, NULL, NULL, NULL, NULL),
(41, 4, 4, 'Cà phê túi lọc Vinacafe Đặc Biệt Số 41', 370000.00, 'coffee_41.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-vinacafe-dac-biet-so-41', 416, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0041', NULL, NULL, NULL, NULL, NULL),
(42, 4, 6, 'Cà phê túi lọc Phúc Long Đặc Biệt Số 42', 460000.00, 'coffee_42.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-phuc-long-dac-biet-so-42', 809, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0042', NULL, NULL, NULL, NULL, NULL),
(43, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 43', 300000.00, 'coffee_43.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-43', 480, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0043', NULL, NULL, NULL, NULL, NULL),
(44, 4, 1, 'Cà phê túi lọc Trung Nguyên Đặc Biệt Số 44', 260000.00, 'coffee_44.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-trung-nguyen-dac-biet-so-44', 718, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0044', NULL, NULL, NULL, NULL, NULL),
(45, 4, 4, 'Cà phê túi lọc Vinacafe Đặc Biệt Số 45', 220000.00, 'coffee_45.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-vinacafe-dac-biet-so-45', 449, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0045', NULL, NULL, NULL, NULL, NULL),
(46, 3, 3, 'Cà phê hạt Nescafe Đặc Biệt Số 46', 360000.00, 'coffee_46.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-nescafe-dac-biet-so-46', 654, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0046', NULL, NULL, NULL, NULL, NULL),
(47, 3, 2, 'Cà phê hạt King Coffee Đặc Biệt Số 47', 220000.00, 'coffee_47.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-king-coffee-dac-biet-so-47', 192, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0047', NULL, NULL, NULL, NULL, NULL),
(48, 1, 3, 'Cà phê hòa tan Nescafe Đặc Biệt Số 48', 400000.00, 'coffee_48.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-nescafe-dac-biet-so-48', 299, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0048', NULL, NULL, NULL, NULL, NULL),
(49, 3, 6, 'Cà phê hạt Phúc Long Đặc Biệt Số 49', 390000.00, 'coffee_49.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Phúc Long. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-phuc-long-dac-biet-so-49', 293, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0049', NULL, NULL, NULL, NULL, NULL),
(50, 2, 2, 'Cà phê rang xay King Coffee Đặc Biệt Số 50', 450000.00, 'coffee_50.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê rang xay của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-rang-xay-king-coffee-dac-biet-so-50', 869, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0050', NULL, NULL, NULL, NULL, NULL),
(51, 1, 1, 'Cà phê hòa tan Trung Nguyên Đặc Biệt Số 51', 210000.00, 'coffee_51.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-trung-nguyen-dac-biet-so-51', 495, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0051', NULL, NULL, NULL, NULL, NULL),
(52, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 52', 130000.00, 'coffee_52.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-52', 293, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0052', NULL, NULL, NULL, NULL, NULL),
(53, 4, 3, 'Cà phê túi lọc Nescafe Đặc Biệt Số 53', 470000.00, 'coffee_53.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-nescafe-dac-biet-so-53', 12, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0053', NULL, NULL, NULL, NULL, NULL),
(54, 4, 3, 'Cà phê túi lọc Nescafe Đặc Biệt Số 54', 430000.00, 'coffee_54.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu Nescafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-nescafe-dac-biet-so-54', 369, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0054', NULL, NULL, NULL, NULL, NULL),
(55, 1, 5, 'Cà phê hòa tan Highlands Đặc Biệt Số 55', 300000.00, 'coffee_55.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Highlands. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-highlands-dac-biet-so-55', 140, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0055', NULL, NULL, NULL, NULL, NULL),
(56, 1, 4, 'Cà phê hòa tan Vinacafe Đặc Biệt Số 56', 80000.00, 'coffee_56.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Vinacafe. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-vinacafe-dac-biet-so-56', 757, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0056', NULL, NULL, NULL, NULL, NULL),
(57, 3, 1, 'Cà phê hạt Trung Nguyên Đặc Biệt Số 57', 200000.00, 'coffee_57.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hạt của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hat-trung-nguyen-dac-biet-so-57', 487, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0057', NULL, NULL, NULL, NULL, NULL),
(58, 4, 2, 'Cà phê túi lọc King Coffee Đặc Biệt Số 58', 150000.00, 'coffee_58.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê túi lọc của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-tui-loc-king-coffee-dac-biet-so-58', 113, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0058', NULL, NULL, NULL, NULL, NULL),
(59, 1, 1, 'Cà phê hòa tan Trung Nguyên Đặc Biệt Số 59', 330000.00, 'coffee_59.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu Trung Nguyên. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-trung-nguyen-dac-biet-so-59', 475, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0059', NULL, NULL, NULL, NULL, NULL),
(60, 1, 2, 'Cà phê hòa tan King Coffee Đặc Biệt Số 60', 260000.00, 'coffee_60.jpg', 'Khám phá hương vị đậm đà, khó quên từ cà phê hòa tan của thương hiệu King Coffee. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.', 'ca-phe-hoa-tan-king-coffee-dac-biet-so-60', 291, 'con_hang', 1, NULL, '2026-06-06 21:35:22', '2026-06-19 23:48:04', 'SP0060', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuong_hieu`
--

CREATE TABLE `thuong_hieu` (
  `id` int NOT NULL,
  `ten_thuong_hieu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `quoc_gia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `an_hien` tinyint(1) DEFAULT '1',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`id`, `ten_thuong_hieu`, `slug`, `logo`, `mo_ta`, `quoc_gia`, `an_hien`, `ngay_tao`) VALUES
(1, 'Trung Nguyên', 'trung-nguyen', 'trung_nguyen.jpg', NULL, 'Việt Nam', 1, '2026-06-06 21:25:17'),
(2, 'King Coffee', 'king-coffee', 'king_coffee.jpg', NULL, 'Việt Nam', 1, '2026-06-06 21:25:17'),
(3, 'Nescafe', 'nescafe', 'nescafe.jpg', NULL, 'Việt Nam', 1, '2026-06-06 21:25:17'),
(4, 'Vinacafe', 'vinacafe', 'vinacafe.jpg', NULL, 'Việt Nam', 1, '2026-06-06 21:25:17'),
(5, 'Highlands', 'highlands', 'highlands.jpg', NULL, 'Việt Nam', 1, '2026-06-06 21:25:17'),
(6, 'Phúc Long', 'phuc-long', 'phuc_long.jpg', NULL, 'Việt Nam', 1, '2026-06-06 21:25:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `yeu_thich`
--

CREATE TABLE `yeu_thich` (
  `id` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_bien_the` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `auctions`
--
ALTER TABLE `auctions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_loai_bai_viet` (`id_loai_bai_viet`);

--
-- Chỉ mục cho bảng `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `bien_the`
--
ALTER TABLE `bien_the`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_san_pham` (`id_san_pham`);

--
-- Chỉ mục cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_don_hang` (`id_don_hang`),
  ADD KEY `id_bien_the` (`id_bien_the`);

--
-- Chỉ mục cho bảng `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`),
  ADD KEY `id_chi_tiet_don_hang` (`id_chi_tiet_don_hang`);

--
-- Chỉ mục cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `dia_chi`
--
ALTER TABLE `dia_chi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`);

--
-- Chỉ mục cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_don` (`ma_don`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`),
  ADD KEY `id_ma_giam_gia` (`id_ma_giam_gia`);

--
-- Chỉ mục cho bảng `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`),
  ADD KEY `id_bien_the` (`id_bien_the`);

--
-- Chỉ mục cho bảng `hinh_anh`
--
ALTER TABLE `hinh_anh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_san_pham` (`id_san_pham`);

--
-- Chỉ mục cho bảng `loai_bai_viet`
--
ALTER TABLE `loai_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `ma_giam_gia`
--
ALTER TABLE `ma_giam_gia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_ap` (`ma_ap`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_danh_muc` (`id_danh_muc`),
  ADD KEY `id_thuong_hieu` (`id_thuong_hieu`);

--
-- Chỉ mục cho bảng `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `yeu_thich`
--
ALTER TABLE `yeu_thich`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`),
  ADD KEY `id_bien_the` (`id_bien_the`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `auctions`
--
ALTER TABLE `auctions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `bids`
--
ALTER TABLE `bids`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `bien_the`
--
ALTER TABLE `bien_the`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `dia_chi`
--
ALTER TABLE `dia_chi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `gio_hang`
--
ALTER TABLE `gio_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hinh_anh`
--
ALTER TABLE `hinh_anh`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT cho bảng `loai_bai_viet`
--
ALTER TABLE `loai_bai_viet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ma_giam_gia`
--
ALTER TABLE `ma_giam_gia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT cho bảng `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `yeu_thich`
--
ALTER TABLE `yeu_thich`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`id_loai_bai_viet`) REFERENCES `loai_bai_viet` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `bien_the`
--
ALTER TABLE `bien_the`
  ADD CONSTRAINT `bien_the_ibfk_1` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`id_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_2` FOREIGN KEY (`id_bien_the`) REFERENCES `bien_the` (`id`);

--
-- Ràng buộc cho bảng `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`id_chi_tiet_don_hang`) REFERENCES `chi_tiet_don_hang` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `dia_chi`
--
ALTER TABLE `dia_chi`
  ADD CONSTRAINT `dia_chi_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`id_ma_giam_gia`) REFERENCES `ma_giam_gia` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD CONSTRAINT `gio_hang_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gio_hang_ibfk_2` FOREIGN KEY (`id_bien_the`) REFERENCES `bien_the` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `hinh_anh`
--
ALTER TABLE `hinh_anh`
  ADD CONSTRAINT `hinh_anh_ibfk_1` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `san_pham_ibfk_2` FOREIGN KEY (`id_thuong_hieu`) REFERENCES `thuong_hieu` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `yeu_thich`
--
ALTER TABLE `yeu_thich`
  ADD CONSTRAINT `yeu_thich_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `yeu_thich_ibfk_2` FOREIGN KEY (`id_bien_the`) REFERENCES `bien_the` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE IF NOT EXISTS lien_he (
  id INT(11) NOT NULL AUTO_INCREMENT,
  ho_ten VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  so_dien_thoai VARCHAR(20) DEFAULT NULL,
  noi_dung TEXT NOT NULL,
  ngay_gui DATETIME DEFAULT CURRENT_TIMESTAMP,
  trang_thai VARCHAR(50) DEFAULT 'pending',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

