const express = require("express");
const router = express.Router();
const supabase = require("../../config/db_connect");

// Block user
router.post('/', async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.json({
        success: false,
        message: "Thiếu user_id"
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ is_blocked: true })
      .eq('id', user_id)
      .select();

    if (error) {
      return res.json({
        success: false,
        message: "Lỗi database"
      });
    }

    res.json({
      success: true,
      message: "Khóa tài khoản thành công",
      data
    });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
});

module.exports = router;
