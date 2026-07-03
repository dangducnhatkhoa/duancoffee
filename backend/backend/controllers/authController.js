const { User } = require('../models');
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Đăng ký thành viên
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, address } = req.body;
    // Validate
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,  message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email:email } });
    if (existingUser) {
      return res.status(400).json({
        success: false, message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

  
    // Tạo mã kích hoạt tài khoản (hết hạn sau 24 giờ)
    const crypto = require('crypto');
    const activation_token = crypto.randomBytes(32).toString('hex');
    const activation_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Tạo user
    const user = await User.create({
      username: email,
      email,
      password_hash,
      full_name,
      phone,
      address,
      user_type: 'buyer',
      status: 'inactive', // Mặc định là inactive, cần kích hoạt qua email để đăng nhập
      activation_token,
      activation_expires
    });
    //Gửi mail kích hoạt tài khoản
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: false  }
    });
    const noidungthu = `
        <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto;">
        <h2 style="color:#C8572C;">Kích hoạt tài khoản</h2>
        <p>Xin chào <strong>${full_name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký! Vui lòng click vào nút dưới đây để kích hoạt tài khoản:</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/users/activate/${activation_token}" 
           style="display:inline-block; padding:14px 28px; background:#C8572C; color:#fff; font-weight:700; border-radius:8px; text-decoration:none; font-size:0.95rem; margin:16px 0;">
          Kích Hoạt Tài Khoản
        </a>
        <p style="color:#7A6A5A; font-size:0.85rem;">Link này sẽ hết hạn sau 24 giờ.</p>
        </div>
    `;
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Kích hoạt tài khoản',
        html: noidungthu,
    } ;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error); 
        else console.log('Đã gửi mail: ' + info.response);
    });

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type
        },
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi đăng ký', error: error.message
    });
  }
};

exports.activate = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Kiểm tra token có tồn tại không
    const user = await User.findOne({
      where: { activation_token: token }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Mã kích hoạt không hợp lệ.' });
    }

    // 2. Kiểm tra đã kích hoạt chưa
    if (user.status === 'active') {
      return res.json({ success: false, message: 'Tài khoản đã được kích hoạt trước đó.' });
    }

    // 3. Kiểm tra hết hạn chưa
    if (!user.activation_expires || user.activation_expires < new Date()) {
      return res.status(400).json({ success: false, message: 'Mã kích hoạt đã hết hạn.' });
    }

    // 4. Kích hoạt tài khoản
    user.email_verified = new Date();
    user.status = 'active'; 
    await user.save();

    // Tạo token tự động đăng nhập
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Kích hoạt tài khoản thành công!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          user_type: user.user_type,
          avatar_url: user.avatar_url
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Error activating user:', error);
    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình kích hoạt.' });
  }
};
// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false, message: 'Vui lòng điền email và mật khẩu'
      });
    }

    // Tìm user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({
        success: false, message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra trạng thái
    if (user.status === 'inactive') {
      return res.json({
        success: false, message: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực đăng nhập.'
      });
    }
    if (user.status !== 'active') {
      return res.json({
        success: false, message: 'Tài khoản đã bị khóa hoặc không hoạt động'
      });
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false, message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    );

    res.json({
      success: true, message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          user_type: user.user_type,
          avatar_url: user.avatar_url
        },
        token
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi đăng nhập', error: error.message
    });
  }
};

// Lấy thông tin user hiện tại
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false, message: 'Không tìm thấy người dùng'
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,  message: 'Lỗi khi lấy thông tin',  error: error.message
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    // Kiểm tra mật khẩu cũ
    const isValidPassword = await bcrypt.compare(old_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }

    // Mã hóa mật khẩu mới
    const new_password_hash = await bcrypt.hash(new_password, 10);

    // Cập nhật
    await user.update({ password_hash: new_password_hash });

    res.json({
      success: true, message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi đổi mật khẩu', error: error.message
    });
  }
};

// Quên mật khẩu - Gửi mã reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; //destructoring email từ req.body
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Không tiết lộ email có tồn tại hay không (bảo mật)
      return res.json({
        success: true,
        message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'
      });
    }

    // Tạo token reset (hết hạn sau 1 giờ)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'password_reset' }, process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Gửi email với link reset
    const nodemailer = require('nodemailer');
    const resetLink = `${process.env.FRONTEND_URL}/users/resetpassword?token=${resetToken}`;

     // Tạo transporter (SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      tls: { rejectUnauthorized: false  }, 
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS}
    });

    // Cấu hình email
    const mailOptions = {
      from: `"Hỗ trợ hệ thống" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Đặt lại mật khẩu của bạn',
      html: `
        <h3>Xin chào ${user.name || ''},</h3>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào liên kết bên dưới để tạo mật khẩu mới:</p>
        <p><a href="${resetLink}" style="color: #1a73e8;">Đặt lại mật khẩu</a></p>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email này.</p><br/>
        <p>Trân trọng,<br/>Đội ngũ hỗ trợ hệ thống</p>
      `
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi email reset đến ${email}`);

    res.json({
      success: true,
      message: 'Đã gửi hướng dẫn đặt lại mật khẩu qua email'
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xử lý quên mật khẩu',
      error: error.message
    });
  }
};


// Reset mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Tìm user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Mã hóa mật khẩu mới
    const password_hash = await bcrypt.hash(new_password, 10);

    // Cập nhật
    await user.update({ password_hash });

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt lại mật khẩu',
      error: error.message
    });
  }
};

// Cập nhật thông tin user
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, address, bio } = req.body;

    const user = await User.findByPk(userId);

    await user.update({
      full_name: full_name || user.full_name,
      phone: phone || user.phone,
      address: address || user.address,
      bio: bio || user.bio
    });

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin',
      error: error.message
    });
  }
};

// Đăng xuất (client xóa token)
exports.logout = async (req, res) => {
  try {
    // Với JWT, logout thường được xử lý ở client bằng cách xóa token
    // Server có thể thêm token vào blacklist nếu cần
    
    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng xuất',
      error: error.message
    });
  }
};

// admin Đăng nhập
exports.adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate
    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Vui lòng điền email và mật khẩu'
      });
    }

    // Tìm user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({
        success: false,
        message: 'Email không đúng'
      });
    }

    // Kiểm tra trạng thái
    if (user.status !== 'active') {
      return res.json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    //kiểm tra user type (admin/buyer)
    if (user.user_type !== 'admin') {
      return res.json({
        success: false,
        message: 'Tài khoản không có quyền truy cập'
      })
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          user_type: user.user_type,
          avatar_url: user.avatar_url
        },
        token
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng nhập',
      error: error.message
    });
  }
};
