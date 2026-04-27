const supabase = require("../../config/db_connect");

// Lưu công việc
const saveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { job_id } = req.body;

    const { data, error } = await supabase
      .from("job_saved")
      .insert({
        user_id: userId,
        job_id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Bạn đã lưu công việc này rồi",
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Lưu công việc thành công",
      data,
    });
  } catch (error) {
    console.error("SaveJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách công việc đã lưu
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("job_saved")
      .select("*, jobs(*, recruiters(company_name, logo_url))", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
    });
  } catch (error) {
    console.error("GetSavedJobs error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Bỏ lưu công việc
const unsaveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const { error } = await supabase
      .from("job_saved")
      .delete()
      .eq("user_id", userId)
      .eq("job_id", jobId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Bỏ lưu công việc thành công",
    });
  } catch (error) {
    console.error("UnsaveJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Kiểm tra đã lưu công việc chưa
const checkSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const { data, error } = await supabase
      .from("job_saved")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json({
      success: true,
      data: {
        is_saved: !!data,
      },
    });
  } catch (error) {
    console.error("CheckSavedJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  unsaveJob,
  checkSavedJob,
};
