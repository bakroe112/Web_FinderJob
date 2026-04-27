const express = require("express");
const router = express.Router();
const supabase = require("../../config/db_connect");

// Lấy tất cả applications
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true });

    if (error) {
      return res.json({
        success: false,
        message: "Lỗi database",
      });
    }

    res.json({
      success: true,
      total: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

module.exports = router;
