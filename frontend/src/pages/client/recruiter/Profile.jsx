import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { axiosClient } from "../../../config/AxiosClient";
import { changePassword } from "../../../store/user/action";
import { StyledButton } from "./components";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&:hover fieldset": { borderColor: "#013265" },
    "&.Mui-focused fieldset": { borderColor: "#013265" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#013265" },
};

export default function RecruiterProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [passwordEditMode, setPasswordEditMode] = React.useState(false);

  const [formData, setFormData] = React.useState({
    company_name: "",
    description: "",
    website: "",
    phone: "",
    location: "",
    industry: "",
    size: "",
  });

  const [passwordData, setPasswordData] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState("");
  // Fetch recruiter profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await axiosClient.post("/recruiters/get", {
          user_id: user.id,
        });

        if (response.data.success) {
          setFormData({
            avatar_url: response.data.data.avatar_url || "",
            company_name: response.data.data.company_name || "",
            description: response.data.data.description || "",
            website: response.data.data.website || "",
            phone: response.data.data.phone || "",
            location: response.data.data.location || "",
            industry: response.data.data.industry || "",
            size: response.data.data.size || "",
          });
        }
          console.log("response.data", response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Lấy thông tin thất bại");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If not in edit mode, toggle to edit mode
    if (!editMode) {
      setEditMode(true);
      return;
    }

    // Submit form and exit edit mode
    setError("");
    setSuccess("");

    try {
      const response = await axiosClient.post("/recruiters/update", {
        user_id: user.id,
        ...formData,
      });

      if (response.data.success) {
        setSuccess("Cập nhật thông tin thành công");
        setEditMode(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // If not in edit mode, toggle to edit mode
    if (!passwordEditMode) {
      setPasswordEditMode(true);
      return;
    }

    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    const result = await dispatch(
      changePassword(
        user.id,
        passwordData.oldPassword,
        passwordData.newPassword
      )
    );

    if (result.success) {
      setPasswordSuccess("Đổi mật khẩu thành công");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordEditMode(false);
    } else {
      setPasswordError(result.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setAvatarUploading(true);
      setError("");
      setSuccess("");

      // Create FormData to send file to backend
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("user_id", user.id);
      formData.append("user_role", "recruiter");

      // Upload via backend
      const response = await axiosClient.post(
        "/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess("Cập nhật ảnh công ty thành công");
        // Reload to update avatar
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setError("Cập nhật ảnh thất bại: " + response.data.message);
      }
    } catch (err) {
      setError("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setAvatarUploading(false);
    }
  };

  const fileInputRef = React.useRef(null);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#013265" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700, color: "#013265" }}
        >
          Hồ sơ công ty
        </Typography>
        <Box
          sx={{
            width: 56,
            height: 4,
            background: "linear-gradient(90deg, #F4C000, #DEA500)",
            borderRadius: 2,
            mt: 1,
          }}
        />
        <Typography variant="body2" sx={{ color: "#5B6B7C", mt: 1 }}>
          Quản lý thông tin công ty và bảo mật tài khoản
        </Typography>
      </Box>

      {/* ── Main Info Card ── */}
      <Card
        sx={{
          mb: 3,
          borderRadius: "12px",
          border: "1px solid #CEE5FD",
          boxShadow: "0 2px 12px rgba(1,50,101,0.08)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>

          {/* Left panel: Logo */}
          <Box
            sx={{
              width: { xs: "100%", md: 220 },
              minWidth: { md: 220 },
              bgcolor: "#F0F7FF",
              borderRight: { md: "1px solid #CEE5FD" },
              borderBottom: { xs: "1px solid #CEE5FD", md: "none" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              px: 2,
            }}
          >
            <Box sx={{ position: "relative", mb: 2 }}>
              <Avatar
                src={formData.avatar_url}
                sx={{
                  width: 120,
                  height: 120,
                  border: "3px solid #014A94",
                  boxShadow: "0 4px 14px rgba(1,50,101,0.15)",
                }}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  minWidth: "auto",
                  p: 0.5,
                  bgcolor: "#F4C000",
                  color: "white",
                  borderRadius: "50%",
                  "&:hover": { bgcolor: "#DEA500" },
                }}
              >
                {avatarUploading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <CameraAltIcon sx={{ fontSize: 18 }} />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#013265", textAlign: "center", lineHeight: 1.3, mb: 0.5 }}
            >
              {formData.company_name || "Công ty"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#014A94", textAlign: "center", wordBreak: "break-all" }}
            >
              {user?.email}
            </Typography>
          </Box>

          {/* Right panel: Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#013265", mb: 2 }}>
              Thông tin công ty
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Tên công ty" name="company_name"
                  value={formData.company_name} onChange={handleChange} disabled={!editMode} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Số điện thoại" name="phone"
                  value={formData.phone} onChange={handleChange} disabled={!editMode} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Website" name="website"
                  value={formData.website} onChange={handleChange} disabled={!editMode} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Ngành nghề" name="industry"
                  value={formData.industry} onChange={handleChange} disabled={!editMode} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Quy mô công ty" name="size"
                  value={formData.size} onChange={handleChange} disabled={!editMode}
                  placeholder="VD: 50-100 nhân viên" sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Địa chỉ" name="location"
                  value={formData.location} onChange={handleChange} disabled={!editMode} sx={inputSx} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, maxWidth: "79.5%" }}>
              <TextField fullWidth multiline  label="Mô tả công ty" name="description"
                value={formData.description} onChange={handleChange} disabled={!editMode} sx={inputSx} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
              {editMode && (
                <Button
                  variant="outlined"
                  onClick={() => { setEditMode(false); setError(""); setSuccess(""); }}
                  sx={{ borderRadius: "10px", borderColor: "#013265", color: "#013265",
                    "&:hover": { borderColor: "#014A94", bgcolor: "#F0F7FF" } }}
                >
                  Huỷ
                </Button>
              )}
              <StyledButton type="submit" variant="contained" sx={{ px: 3 }}>
                {editMode ? "Lưu thay đổi" : "Chỉnh sửa"}
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* ── Change Password Card ── */}
      <Card
        sx={{
          borderRadius: "12px",
          border: "1px solid #CEE5FD",
          boxShadow: "0 2px 12px rgba(1,50,101,0.08)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          {/* Left accent panel */}
          <Box
            sx={{
              width: { xs: "100%", md: 220 },
              minWidth: { md: 220 },
              bgcolor: "#F0F7FF",
              borderRight: { md: "1px solid #CEE5FD" },
              borderBottom: { xs: "1px solid #CEE5FD", md: "none" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              px: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#013265",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <Typography sx={{ color: "white", fontSize: 24 }}>🔒</Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#013265", textAlign: "center" }}>
              Bảo mật
            </Typography>
            <Typography variant="caption" sx={{ color: "#5B6B7C", textAlign: "center", mt: 0.5 }}>
              Cập nhật mật khẩu định kỳ để bảo vệ tài khoản
            </Typography>
          </Box>

          {/* Right: Password form */}
          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#013265", mb: 2 }}>
              Đổi mật khẩu
            </Typography>

            {passwordError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{passwordError}</Alert>}
            {passwordSuccess && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{passwordSuccess}</Alert>}

            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type="password" label="Mật khẩu hiện tại" name="oldPassword"
                  value={passwordData.oldPassword} onChange={handlePasswordChange}
                  disabled={!passwordEditMode} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type="password" label="Mật khẩu mới" name="newPassword"
                  value={passwordData.newPassword} onChange={handlePasswordChange}
                  disabled={!passwordEditMode} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type="password" label="Xác nhận mật khẩu mới" name="confirmPassword"
                  value={passwordData.confirmPassword} onChange={handlePasswordChange}
                  disabled={!passwordEditMode} sx={inputSx} />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
              {passwordEditMode && (
                <Button
                  variant="outlined"
                  onClick={() => { setPasswordEditMode(false); setPasswordError(""); setPasswordSuccess(""); setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); }}
                  sx={{ borderRadius: "10px", borderColor: "#013265", color: "#013265",
                    "&:hover": { borderColor: "#014A94", bgcolor: "#F0F7FF" } }}
                >
                  Huỷ
                </Button>
              )}
              <StyledButton type="submit" variant="contained" sx={{ px: 3 }}>
                {passwordEditMode ? "Lưu thay đổi" : "Đổi mật khẩu"}
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
