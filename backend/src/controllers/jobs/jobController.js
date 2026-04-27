const supabase = require("../../config/db_connect");

// Lấy tất cả jobs (có filter)
const getAllJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      field_id, 
      job_type, 
      workplace_type, 
      experience,
      search 
    } = req.query;

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("jobs")
      .select("*, recruiters(company_name, logo_url, location), job_fields(name)", { count: "exact" })
      .eq("job_status", "Open")
      .order("created_at", { ascending: false });

    // Áp dụng filters
    if (field_id) query = query.eq("field_id", field_id);
    if (job_type) query = query.eq("job_type", job_type);
    if (workplace_type) query = query.eq("workplace_type", workplace_type);
    if (experience) query = query.eq("experience", experience);
    if (search) query = query.ilike("title", `%${search}%`);

    // Pagination
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
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("GetAllJobs error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy job theo ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("jobs")
      .select("*, recruiters(company_name, logo_url, location, website, description), job_fields(name)")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy công việc",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetJobById error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Tạo job mới (recruiter)
const createJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const {
      title,
      salary,
      job_type,
      workplace_type,
      experience,
      vacancy_count,
      field_id,
      job_description,
      interest,
      work_location,
      working_time,
      deadline,
    } = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        recruiter_id: recruiterId,
        title,
        salary,
        job_type,
        workplace_type,
        experience,
        vacancy_count,
        field_id,
        job_description,
        interest,
        work_location,
        working_time,
        deadline,
        job_status: "Open",
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Tạo công việc thành công",
      data,
    });
  } catch (error) {
    console.error("CreateJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Cập nhật công việc thành công",
      data,
    });
  } catch (error) {
    console.error("UpdateJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Xóa công việc thành công",
    });
  } catch (error) {
    console.error("DeleteJob error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy jobs của recruiter
const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { page = 1, limit = 10, job_status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("jobs")
      .select("*, job_fields(name)", { count: "exact" })
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });

    if (job_status) query = query.eq("job_status", job_status);

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
    console.error("GetMyJobs error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
};
