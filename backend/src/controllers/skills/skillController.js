const supabase = require("../../config/db_connect");

// Lấy tất cả skills
const getAllSkills = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from("skills")
      .select("id, name, category", { count: "exact" })
      .order("category", { ascending: true })
      .order("name", { ascending: true })
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
    console.error("GetAllSkills error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy skills của user
const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("user_skills")
      .select("*, skills(name)")
      .eq("user_id", userId);

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetUserSkills error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm skill cho user
const addUserSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill_id } = req.body;

    const { data, error } = await supabase
      .from("user_skills")
      .insert({
        user_id: userId,
        skill_id,
      })
      .select("*, skills(name)")
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Bạn đã có kỹ năng này rồi",
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Thêm kỹ năng thành công",
      data,
    });
  } catch (error) {
    console.error("AddUserSkill error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa skill của user
const removeUserSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillId } = req.params;

    const { error } = await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", userId)
      .eq("skill_id", skillId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Xóa kỹ năng thành công",
    });
  } catch (error) {
    console.error("RemoveUserSkill error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSkills,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
};
