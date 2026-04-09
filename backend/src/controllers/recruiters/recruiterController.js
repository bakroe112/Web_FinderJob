const supabase = require("../../config/db_connect");

// Lấy tất cả recruiters
const getAllRecruiters = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from("recruiters")
      .select("*, users(email)", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count,
      },
    });
  } catch (error) {
    console.error("GetAllRecruiters error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy recruiter theo ID
const getRecruiterById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("recruiters")
      .select("*, users(email)")
      .eq("user_id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhà tuyển dụng",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetRecruiterById error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật thông tin recruiter
const updateRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, description, phone, location, website, size, industry } = req.body;

    const { data, error } = await supabase
      .from("recruiters")
      .update({
        company_name,
        description,
        phone,
        location,
        website,
        size,
        industry,
      })
      .eq("user_id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data,
    });
  } catch (error) {
    console.error("UpdateRecruiter error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
};
