const jwt = require("jsonwebtoken");
const supabase = require("../config/db_connect");

// Middleware xác thực JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không có token, vui lòng đăng nhập",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gắn user info vào request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // Kiểm tra tài khoản có bị khóa không
    const { data: userRecord } = await supabase
      .from("users")
      .select("is_blocked")
      .eq("id", decoded.id)
      .single();

    if (userRecord?.is_blocked) {
      return res.status(403).json({
        success: false,
        is_blocked: true,
        message: "Tài khoản của bạn đã bị khóa",
      });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn, vui lòng đăng nhập lại",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

// Middleware kiểm tra is_blocked cho mọi request có token (không yêu cầu xác thực)
const checkBlocked = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(); // token lỗi để route handler tự xử lý
    }

    const { data: userRecord } = await supabase
      .from("users")
      .select("is_blocked")
      .eq("id", decoded.id)
      .single();

    if (userRecord?.is_blocked) {
      return res.status(403).json({
        success: false,
        is_blocked: true,
        message: "Tài khoản của bạn đã bị khóa",
      });
    }
  } catch (e) {
    // không block request nếu check lỗi
  }
  next();
};

// Middleware kiểm tra role recruiter
const recruiterOnly = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "Chỉ nhà tuyển dụng mới có quyền truy cập",
    });
  }
  next();
};

// Middleware kiểm tra role candidate
const candidateOnly = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({
      success: false,
      message: "Chỉ ứng viên mới có quyền truy cập",
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  checkBlocked,
  recruiterOnly,
  candidateOnly,
};
