const supabase = require("../../config/db_connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        role: role || "candidate",
      })
      .select()
      .single();

    if (userError) throw userError;

    // Tạo profile theo role
    if (role === "recruiter") {
      const { error: recruiterError } = await supabase
        .from("recruiters")
        .insert({
          user_id: newUser.id,
          company_name: profileData.company_name,
          description: profileData.description,
          phone: profileData.phone,
          location: profileData.location,
          website: profileData.website,
          size: profileData.size,
          industry: profileData.industry,
        });
      if (recruiterError) throw recruiterError;
    } else {
      const { error: candidateError } = await supabase
        .from("candidates")
        .insert({
          user_id: newUser.id,
          full_name: profileData.full_name,
          phone: profileData.phone,
          location: profileData.location,
          job_title: profileData.job_title,
        });
      if (candidateError) throw candidateError;
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        user_id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user_id: user.id,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy thông tin user hiện tại
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, role, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
