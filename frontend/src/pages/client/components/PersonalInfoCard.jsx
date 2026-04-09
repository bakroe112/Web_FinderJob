import React from 'react';
import {
  Card,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { colors } from '../../../../theme/colors';

export default function PersonalInfoCard({
  user,
  formData,
  editMode,
  error,
  success,
  onChange,
  onEdit,
  onSave,
  onCancel,
  avatarUploading,
  avatarError,
  avatarSuccess,
  onAvatarChange,
}) {
  const fileInputRef = React.useRef(null);
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: colors.shadow.navy,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": { boxShadow: colors.shadow.navyStrong },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 10,
        }}
      >
        {/* ── Left panel: Avatar ── */}
        <Box
          sx={{
            width: { xs: "100%", md: 210 },
            minWidth: { md: 450 },
            bgcolor: colors.primary.lighter,
            borderRight: { md: `1px solid ${colors.primary.light}` },
            borderBottom: {
              xs: `1px solid ${colors.primary.light}`,
              md: "none",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            px: 2,
          }}
        >
          {(avatarError || avatarSuccess) && (
            <Box sx={{ width: "100%", mb: 2 }}>
              {avatarError && (
                <Alert
                  severity="error"
                  sx={{
                    fontSize: "0.75rem",
                    py: 0.5,
                    borderColor: colors.primary.light,
                    backgroundColor: colors.primary.lighter,
                    "& .MuiAlert-icon": { color: colors.primary.dark },
                    "& .MuiAlert-message": { color: colors.primary.darkest },
                  }}
                >
                  {avatarError}
                </Alert>
              )}
              {avatarSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    fontSize: "0.75rem",
                    py: 0.5,
                    borderColor: colors.accent.light,
                    backgroundColor: colors.accent.light,
                    "& .MuiAlert-icon": { color: colors.accent.main },
                    "& .MuiAlert-message": { color: colors.primary.darkest },
                  }}
                >
                  {avatarSuccess}
                </Alert>
              )}
            </Box>
          )}
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={formData.avatar_url}
              sx={{
                width: 120,
                height: 120,
                border: `3px solid ${colors.primary.dark}`,
                boxShadow: colors.shadow.navyMedium,
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
                bgcolor: colors.accent.main,
                color: "white",
                borderRadius: "50%",
                "&:hover": { bgcolor: colors.accent.dark },
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
              onChange={onAvatarChange}
              accept="image/*"
            />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: colors.primary.darkest,
              textAlign: "center",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {formData.full_name || user?.name || "Chưa cập nhật"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: colors.primary.dark,
              textAlign: "center",
              wordBreak: "break-all",
            }}
          >
            {user?.email}
          </Typography>
        </Box>

        {/* ── Right panel: Form ── */}
        <Box
          component="form"
          onSubmit={onSave}
          sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: colors.primary.darkest }}
          >
            Thông tin cá nhân
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderColor: colors.primary.light,
                backgroundColor: colors.primary.lighter,
                "& .MuiAlert-icon": { color: colors.primary.dark },
                "& .MuiAlert-message": { color: colors.primary.darkest },
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                borderColor: colors.accent.light,
                backgroundColor: colors.accent.light,
                "& .MuiAlert-icon": { color: colors.accent.main },
                "& .MuiAlert-message": { color: colors.primary.darkest },
              }}
            >
              {success}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ flex: 1 }}>
            {/* Cột trái */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    placeholder="Họ và tên"
                    name="full_name"
                    value={formData.full_name}
                    onChange={onChange}
                    disabled={!editMode}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.dark,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    placeholder="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    disabled={!editMode}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.dark,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    label="Giới thiệu bản thân"
                    placeholder="Giới thiệu bản thân"
                    name="summary"
                    value={formData.summary}
                    onChange={onChange}
                    disabled={!editMode}
                    multiline
                    rows={6}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.dark,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    placeholder="Địa chỉ"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    disabled={!editMode}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.dark,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Vị trí công việc"
                    placeholder="Vị trí công việc"
                    name="job_title"
                    value={formData.job_title}
                    onChange={onChange}
                    disabled={!editMode}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.dark,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    label="Kinh nghiệm làm việc"
                    placeholder="Kinh nghiệm làm việc"
                    name="experience"
                    value={formData.experience}
                    onChange={onChange}
                    disabled={!editMode}
                    multiline
                    rows={6}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.dark,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              pt: 3,
              mt: "auto",
            }}
          >
            {editMode ? (
              <>
                <Button
                  onClick={onCancel}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  sx={{
                    borderColor: colors.primary.dark,
                    color: colors.primary.darkest,
                    fontWeight: 700,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: colors.primary.darkest,
                      backgroundColor: colors.primary.lighter,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    background: colors.gradients.primaryButton,
                    color: "white",
                    fontWeight: 700,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: colors.gradients.primaryButtonHover,
                      transform: "translateY(-2px)",
                      boxShadow: colors.shadow.navyMedium,
                    },
                  }}
                >
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <Button
                onClick={onEdit}
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  background: colors.gradients.primaryButton,
                  color: "white",
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: colors.gradients.primaryButtonHover,
                    transform: "translateY(-2px)",
                    boxShadow: colors.shadow.navyMedium,
                  },
                }}
              >
                Chỉnh sửa
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}