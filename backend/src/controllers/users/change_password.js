const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const supabase = require("../../config/db_connect");

// Đổi mật khẩu
router.post("/", async (req, res) => {
  try {
    const { user_id, current_password, new_password } = req.body;

    if (!user_id) {
      return res.json({
        success: false,
        message: "Thiếu user_id",
      });
    } else if (!current_password) {
      return res.json({
        success: false,
        message: "Thiếu current_password",
      });
    } else if (!new_password) {
      return res.json({
        success: false,
        message: "Thiếu new_password",
      });
    }

    if (new_password.length < 6) {
      return res.json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    // Lấy user
    const { data: user, error } = await supabase
      .from("users")
      .select("password")
      .eq("id", user_id)
      .single();

    if (error || !user) {
      return res.json({
        success: false,
        message: "Không tìm thấy user",
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Cập nhật
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user_id);

    if (updateError) {
      return res.json({ success: false, message: "Lỗi cập nhật mật khẩu" });
    }

    return res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.json({
      success: false,
      message: "Lỗi server",
    });
  }
});

module.exports = router;
