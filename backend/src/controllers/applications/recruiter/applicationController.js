const supabase = require("../../config/db_connect");

// Nộp đơn ứng tuyển
const applyJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { job_id, resume_url, introduction } = req.body;

    // Kiểm tra đã ứng tuyển chưa
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("candidate_id", candidateId)
      .eq("job_id", job_id)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã ứng tuyển công việc này rồi",
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        candidate_id: candidateId,
        job_id,
        resume_url,
        introduction,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Nộp đơn ứng tuyển thành công",
      data,
    });
  } catch (error) {
    console.error("ApplyJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy đơn ứng tuyển của candidate
const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("applications")
      .select("*, jobs(title, salary, job_type, recruiters(company_name, logo_url))", { count: "exact" })
      .eq("candidate_id", candidateId)
      .order("applied_at", { ascending: false });

    if (status) query = query.eq("status", status);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

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
    console.error("GetMyApplications error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy đơn ứng tuyển cho một job (recruiter)
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("applications")
      .select("*, candidates(full_name, phone, location, job_title)", { count: "exact" })
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false });

    if (status) query = query.eq("status", status);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

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
    console.error("GetApplicationsByJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết đơn ứng tuyển
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("applications")
      .select("*, candidates(full_name, phone, location, job_title, summary, experience), jobs(title, salary, recruiters(company_name))")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetApplicationById error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn ứng tuyển (recruiter)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Tạo object update với timestamp tương ứng
    const updateData = { status };
    const now = new Date().toISOString();

    if (status === "viewed") updateData.viewed_at = now;
    if (status === "interviewing") updateData.interviewing_at = now;
    if (status === "accepted") updateData.accepted_at = now;
    if (status === "rejected") updateData.rejected_at = now;

    const { data, error } = await supabase
      .from("applications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data,
    });
  } catch (error) {
    console.error("UpdateApplicationStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa đơn ứng tuyển
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Xóa đơn ứng tuyển thành công",
    });
  } catch (error) {
    console.error("DeleteApplication error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
