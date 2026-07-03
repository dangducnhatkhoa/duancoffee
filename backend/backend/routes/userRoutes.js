const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Đăng ký thành viên
router.post('/register', authController.register);

// Kích hoạt tài khoản qua token
router.get('/activate/:token', authController.activate);

// Đăng nhập
router.post('/login', authController.login);

// Đổi mật khẩu
router.post('/changepassword', authMiddleware,  authController.changePassword);

// Quên mật khẩu - Gửi mã token
router.post('/forgotpassword', authController.forgotPassword);

// Lấy thông tin user hiện tại
router.get('/getprofile', authMiddleware, authController.getProfile);

// Cập nhật thông tin user
router.post('/updateprofile', authMiddleware, authController.updateProfile);

// Đăng xuất (client xóa token)
router.get('/logout', authController.logout);

// Reset mật khẩu
router.post('/resetpassword', authController.resetPassword);

// Đăng nhập admin
router.post('/adminlogin', authController.adminlogin);

module.exports = router;
