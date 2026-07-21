const express = require('express');
const router = express.Router();

// Các route (products, ...)
router.use('/products', require('./productRoutes'));

router.use('/cart', require('./cartRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/brands', require('./brandRoutes'));
router.use('/articles', require('./articleRoutes'));
router.use('/admin', require('./adminRoutes'));
router.use('/sepay', require('./sepayRoutes'));
router.post( "/contact", async (req, res) => {
    let {fullName, email, phone, message} = req.body;
    
    try {
        // 1. Lưu vào Database
        const { Contact } = require('../models');
        await Contact.create({
            ho_ten: fullName,
            email: email,
            so_dien_thoai: phone,
            noi_dung: message
        });

        // 2. Gửi email
        message = String(message || '').replace(/\r\n|\n|\r/g, '<br>'); 
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            tls: { rejectUnauthorized: false }
        });

        // Email gửi cho Admin
        const mailToAdmin = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: 'Liên hệ từ khách hàng mới',
            html: `
                <h3>Liên hệ từ khách hàng</h3>
                <p>Họ tên: ${fullName}</p> 
                <p>Email: ${email}</p>
                <p>Điện thoại: ${phone}</p>  
                <p>Nội dung: <br>${message}</p> 
            `
        };

        // Email gửi tự động cho Khách hàng
        const mailToCustomer = {
            from: process.env.SMTP_USER,
            to: email, // Gửi tới email khách hàng
            subject: 'Xác nhận: Chúng tôi đã nhận được liên hệ của bạn',
            html: `
                <h3>Xin chào ${fullName},</h3>
                <p>Cảm ơn bạn đã liên hệ với King Coffee.</p>
                <p>Chúng tôi đã nhận được thông điệp của bạn với nội dung như sau:</p>
                <div style="padding: 10px; background-color: #f9f9f9; border-left: 4px solid #C8572C; margin: 10px 0;">
                    ${message}
                </div>
                <p>Đội ngũ hỗ trợ của chúng tôi sẽ xem xét và phản hồi lại cho bạn trong thời gian sớm nhất.</p>
                <p>Trân trọng,<br>Đội ngũ King Coffee</p>
            `
        };

        await transporter.sendMail(mailToAdmin);
        await transporter.sendMail(mailToCustomer);

        res.json({ success: true, message: "Đã gửi liên hệ và email phản hồi thành công" });
    } catch (error) {
        console.error('Lỗi khi xử lý liên hệ:', error); 
        return res.status(500).json({ success: false, message: "Gửi liên hệ thất bại" });
    }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

module.exports = router;
