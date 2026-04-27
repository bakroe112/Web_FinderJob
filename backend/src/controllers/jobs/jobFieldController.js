const supabase = require("../../config/db_connect");

// Lấy tất cả job fields
const getAllJobFields = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("job_fields")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetAllJobFields error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy job field theo ID
const getJobFieldById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("job_fields")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetJobFieldById error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllJobFields,
  getJobFieldById,
};
