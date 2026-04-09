const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../../config/db_connect");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Thiếu email hoặc mật khẩu",
      });
    }

    // Tìm user theo email
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, password, role, avatar_url, is_blocked")
      .eq("email", email)
      .limit(1);

    if (error) {
      return res.json({
        success: false,
        message: "Lỗi database",
      });
    }

    if (!users || users.length === 0) {
      return res.json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    const user = users[0];

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Mật khẩu không đúng",
      });
    }

    // Kiểm tra tài khoản bị khóa
    if (user.is_blocked) {
      return res.json({
        success: false,
        message: "Tài khoản của bạn đã bị khóa",
        is_blocked: true,
      });
    }

    // Tạo JWT token với JWT_SECRET
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        is_blocked: user.is_blocked,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.json({
      success: false,
      message: "Lỗi server",
    });
  }
});

module.exports = router;
