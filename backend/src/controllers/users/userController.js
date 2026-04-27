const supabase = require("../../config/db_connect");

// Lấy user theo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, avatar_url, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetUserById error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({ avatar_url })
      .eq("id", id)
      .select("id, email, role, avatar_url")
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data,
    });
  } catch (error) {
    console.error("UpdateUser error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
};
