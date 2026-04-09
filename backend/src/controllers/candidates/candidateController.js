const supabase = require("../../config/db_connect");

// Lấy tất cả candidates
const getAllCandidates = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from("candidates")
      .select("*, users(email, avatar_url)", { count: "exact" })
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
    console.error("GetAllCandidates error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy candidate theo ID
const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("candidates")
      .select("*, users(email, avatar_url)")
      .eq("user_id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ứng viên",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetCandidateById error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật thông tin candidate
const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, location, job_title, summary, experience } = req.body;

    const { data, error } = await supabase
      .from("candidates")
      .update({
        full_name,
        phone,
        location,
        job_title,
        summary,
        experience,
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
    console.error("UpdateCandidate error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCandidates,
  getCandidateById,
  updateCandidate,
};
