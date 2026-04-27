const express = require("express");
const router = express.Router();
const supabase = require("../../config/db_connect");

// Lấy tất cả users
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, avatar_url, created_at, is_blocked");

    if (error) {
      return res.json({
        success: false,
        message: "Lỗi database",
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

module.exports = router;
