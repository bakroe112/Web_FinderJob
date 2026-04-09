import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LinearProgress from '@mui/material/LinearProgress';
import {
  getAllApplications,
  updateApplicationStatus,
} from '../../../store/applications/action';
import Stack from '@mui/material/Stack';
import { StyledButton } from './components';
import { axiosClient } from "../../../config/AxiosClient";

const statusConfig = {
  pending: { label: 'Chờ xem xét', bg: '#FFF3C1', color: '#DEA500', borderColor: '#F4C000' },
  viewed: { label: 'Đang xem xét', bg: '#E3F2FD', color: '#014A94', borderColor: '#90CAF9' },
  accepted: { label: 'Chấp nhận', bg: '#E8F5E9', color: '#1F7A1F', borderColor: '#A5D6A7' },
  rejected: { label: 'Từ chối', bg: '#FFEBEE', color: '#E92020', borderColor: '#EF9A9A' },
};

export default function ApplicationManagement() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { recruiterApplications, loading, error } = useSelector((state) => state.applications);

  const [tabValue, setTabValue] = React.useState('all');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedApp, setSelectedApp] = React.useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false);
  const [analyzeDialogOpen, setAnalyzeDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState('');
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [analysisLoading, setAnalysisLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);

  // Fetch applications on mount
  React.useEffect(() => {
    if (user?.id) {
      dispatch(getAllApplications(user.id));
    }
  }, [dispatch, user?.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event, app) => {
    setAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusClick = (status) => {
    // Map status values to backend format
    const statusMap = {
      viewed: "viewed",
      accepted: "accepted",
      rejected: "rejected",
    };
    setNewStatus(statusMap[status] || status);
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleDetailClick = () => {
    setDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleUpdateStatusClick = () => {
    setNewStatus(selectedApp?.status || 'viewed'); // Set status từ ứng dụng hiện tại
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;

    console.log('handleStatusUpdate:', { user_id: user?.id, app_id: selectedApp?.id, status: newStatus });
    setUpdateLoading(true);
    const result = await dispatch(updateApplicationStatus(user.id, selectedApp.id, newStatus));
    setUpdateLoading(false);

    if (result.success) {
      console.log('Update status success');
      setStatusDialogOpen(false);
      setSelectedApp(null);
      setNewStatus('');
    } else {
      console.log('Update status failed:', result.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleAnalyzeCv = async () => {
    if (!selectedApp?.resume_url) return;

    setAnalysisLoading(true);
    try {
      // Download file từ Supabase
      const fileResponse = await fetch(selectedApp.resume_url);
      const blob = await fileResponse.blob();
      const fileName = selectedApp.resume_url.split('/').pop();
      const file = new File([blob], fileName, { type: blob.type });

      // Gửi tới API để phân tích
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('candidate_id', selectedApp.candidate_id);
      formData.append('job_id', selectedApp.job_id);

      const response = await axiosClient.post(
        "recruiter/upload-resume-for-analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        setAnalysisResult(response.data);
      } else {
        alert(response.data.message || 'Phân tích thất bại');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi phân tích CV');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#1F7A1F';
    if (score >= 50) return '#DEA500';
    return '#E92020';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 50) return 'Tốt';
    return 'Cần cải thiện';
  };

  const hasRealData = (obj, fields) => {
    if (!obj) return false;
    return fields.some(field => obj[field] && obj[field] !== 'N/A' && obj[field]?.trim());
  };

  const filterValidEducation = (education) => {
    if (!education) return [];
    return education.filter(edu => hasRealData(edu, ['degree', 'institution', 'field', 'year']));
  };

  const filterValidExperience = (experience) => {
    if (!experience) return [];
    return experience.filter(exp => hasRealData(exp, ['job_title', 'company_name', 'duration', 'description']));
  };

  // Filter applications by tab
  const filteredApplications = React.useMemo(() => {
    if (!recruiterApplications) return [];
    if (tabValue === 'all') return recruiterApplications;
    return recruiterApplications.filter((app) => app.status === tabValue);
  }, [recruiterApplications, tabValue]);
  return (
    <Box sx={{ backgroundColor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #013265 0%, #014A94 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Quản lý ứng viên
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#5B6B7C", fontSize: "16px", fontWeight: 500 }}
          >
            Xem và quản lý tất cả đơn ứng tuyển
          </Typography>
        </Box>

        {/* Status Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 4,
            "& .MuiTabs-indicator": {
              backgroundColor: "#013265",
              height: 3,
              borderRadius: 2,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              color: "#5B6B7C",
              "&.Mui-selected": {
                color: "#013265",
              },
            },
          }}
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Chờ xem xét" value="pending" />
          <Tab label="Đang xem xét" value="viewed" />
          <Tab label="Đã chấp nhận" value="accepted" />
          <Tab label="Đã từ chối" value="rejected" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#013265" }} size={48} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "#FFF0F0",
              color: "#E92020",
              border: "1px solid #FFBDBD",
              borderRadius: 2,
              "& .MuiAlert-icon": { color: "#E92020" },
            }}
          >
            {error}
          </Alert>
        ) : filteredApplications && filteredApplications.length > 0 ? (
          <TableContainer
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 3,
              border: "1px solid #CEE5FD",
              boxShadow: "0 2px 12px rgba(1, 50, 101, 0.08)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(135deg, #013265 0%, #014A94 100%)",
                  }}
                >
                  {[
                    "Ứng viên",
                    "Vị trí ứng tuyển",
                    "Ngày ứng tuyển",
                    "Trạng thái",
                    "Thao tác",
                  ].map((header, i) => (
                    <TableCell
                      key={header}
                      align={i === 4 ? "right" : "left"}
                      sx={{
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "14px",
                        borderBottom: "none",
                        py: 2,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((app, index) => {
                  const status = statusConfig[app.status] || {
                    label: app.status,
                    bg: "#F0F7FF",
                    color: "#013265",
                    borderColor: "#CEE5FD",
                  };
                  return (
                    <TableRow
                      key={app.id}
                      hover
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#F8FAFC",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "#F0F7FF !important",
                        },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={app.candidate_avatar}
                            sx={{
                              width: 40,
                              height: 40,
                              border: "2px solid #CEE5FD",
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: "#013265" }}
                            >
                              {app.candidate_name || "N/A"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#5B6B7C", fontSize: "13px" }}
                            >
                              {app.candidate_email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#013265", fontWeight: 500 }}>
                        {app.job_title || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: "#5B6B7C", fontWeight: 500 }}>
                        {formatDate(app.applied_at)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            backgroundColor: status.bg,
                            color: status.color,
                            border: `1px solid ${status.borderColor}`,
                            fontWeight: 600,
                            fontSize: "12px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, app)}
                          sx={{
                            color: "#013265",
                            "&:hover": { backgroundColor: "#CEE5FD" },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              backgroundColor: "#ffffff",
              borderRadius: 3,
              border: "2px dashed #CEE5FD",
            }}
          >
            <Typography variant="h6" sx={{ color: "#5B6B7C", fontWeight: 600 }}>
              {tabValue === "all"
                ? "Chưa có đơn ứng tuyển nào"
                : `Không có đơn ứng tuyển ${statusConfig[tabValue]?.label?.toLowerCase() || ""}`}
            </Typography>
          </Box>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: "1px solid #CEE5FD",
              boxShadow: "0 4px 16px rgba(1, 50, 101, 0.12)",
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            onClick={handleUpdateStatusClick}
            sx={{
              py: 1.5,
              "&:hover": { backgroundColor: "#F0F7FF" },
            }}
          >
            <Typography sx={{ fontWeight: 500, color: "#013265" }}>
              Cập nhật trạng thái
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={handleDetailClick}
            sx={{
              py: 1.5,
              "&:hover": { backgroundColor: "#F0F7FF" },
            }}
          >
            <Typography sx={{ fontWeight: 500, color: "#013265" }}>
              Xem chi tiết thông tin
            </Typography>
          </MenuItem>
        </Menu>

        {/* Status Update Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: "1px solid #CEE5FD",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#013265", pb: 1 }}>
            Cập nhật trạng thái đơn ứng tuyển
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "#5B6B7C", mb: 2 }}>
              Ứng viên:{" "}
              <strong style={{ color: "#013265" }}>
                {selectedApp?.candidate_name}
              </strong>
            </Typography>
            <FormControl
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#013265",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#013265" },
              }}
            >
              <InputLabel>Trạng thái mới</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái mới"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="viewed">Đang xem xét</MenuItem>
                <MenuItem value="accepted">Chấp nhận</MenuItem>
                <MenuItem value="rejected">Từ chối</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <StyledButton
              variant="outlined"
              onClick={() => setStatusDialogOpen(false)}
            >
              Hủy
            </StyledButton>
            <StyledButton
              onClick={handleStatusUpdate}
              variant="contained"
              disabled={updateLoading || !newStatus}
            >
              {updateLoading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Cập nhật"
              )}
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Application Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: "1px solid #CEE5FD",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#013265" }}>
            Chi tiết hồ sơ ứng viên
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: "#CEE5FD" }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#013265",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    height: 16,
                    background:
                      "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                    borderRadius: 2,
                  }}
                />
                Thông tin ứng viên
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, color: "#5B6B7C" }}>
                  <strong style={{ color: "#013265" }}>Tên:</strong>{" "}
                  {selectedApp?.candidate_name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5, color: "#5B6B7C" }}>
                  <strong style={{ color: "#013265" }}>Email:</strong>{" "}
                  {selectedApp?.candidate_email}
                </Typography>
                <Typography variant="body2" sx={{ color: "#5B6B7C" }}>
                  <strong style={{ color: "#013265" }}>Ngày nộp đơn:</strong>{" "}
                  {formatDate(selectedApp?.applied_at)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#013265",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    height: 16,
                    background:
                      "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                    borderRadius: 2,
                  }}
                />
                Vị trí ứng tuyển
              </Typography>
              <Typography variant="body2" sx={{ pl: 2, color: "#5B6B7C" }}>
                {selectedApp?.job_title}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#013265",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    height: 16,
                    background:
                      "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                    borderRadius: 2,
                  }}
                />
                Thư giới thiệu
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  p: 2,
                  ml: 2,
                  backgroundColor: "#F0F7FF",
                  borderRadius: 2,
                  border: "1px solid #CEE5FD",
                  color: "#5B6B7C",
                }}
              >
                {selectedApp?.introduction || "Không có thư giới thiệu"}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, alignItems: "center" }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#013265",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    height: 16,
                    background:
                      "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                    borderRadius: 2,
                  }}
                />
                CV
              </Typography>
              {selectedApp?.resume_url ? (
                <StyledButton
                  size="small"
                  variant="outlined"
                  onClick={() => setPreviewDialogOpen(true)}
                  sx={{ px: 2, py: 0.5 }}
                >
                  Xem CV
                </StyledButton>
              ) : (
                <Typography variant="body2" sx={{ color: "#5B6B7C" }}>
                  Chưa tải lên CV
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <StyledButton
              variant="outlined"
              onClick={() => setDetailDialogOpen(false)}
            >
              Đóng
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* CV Preview Dialog */}
        <Dialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              height: "90vh",
              borderRadius: 3,
              border: "1px solid #CEE5FD",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#013265" }}>
            Xem CV
          </DialogTitle>
          <DialogContent
            sx={{ p: 0, overflow: "hidden", backgroundColor: "#f0f0f0" }}
          >
            {selectedApp?.resume_url ? (
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedApp.resume_url.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={selectedApp.resume_url}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="CV Preview"
                  />
                ) : (
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedApp.resume_url)}`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="CV Preview"
                    onError={() => {
                      console.log("Error loading document");
                    }}
                  />
                )}
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">Không có CV</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <StyledButton
              variant="outlined"
              sx={{ px: 2, py: 0.5 }}
              onClick={() => {setAnalyzeDialogOpen(true); handleAnalyzeCv();}}
              disabled={!selectedApp?.resume_url || analysisLoading}
            >
              {analysisLoading ? <CircularProgress size={18} /> : 'Phân tích CV'}
            </StyledButton>
            <StyledButton
              href={selectedApp?.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              download
              sx={{ px: 2, py: 0.5 }}
            >
              Tải xuống
            </StyledButton>
            <StyledButton
              variant="outlined"
              sx={{ px: 2, py: 0.5 }}
              onClick={() => setPreviewDialogOpen(false)}
            >
              Đóng
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Dialog Phân tích CV */}
        <Dialog
          open={analyzeDialogOpen}
          onClose={() => {
            setAnalyzeDialogOpen(false);
            setAnalysisResult(null);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: '1px solid #CEE5FD',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#013265' }}>
            Kết quả phân tích CV
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: '#CEE5FD', maxHeight: '70vh', overflow: 'auto' }}>
            {analysisLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#013265' }} size={48} />
              </Box>
            ) : analysisResult ? (
              <Box>
                {/* Resume Score */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
                    <CircularProgress
                      variant="determinate"
                      value={(analysisResult.resume_score / 100) * 100}
                      size={120}
                      sx={{
                        color: getScoreColor(analysisResult.resume_score),
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                        },
                      }}
                    />
                    <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: getScoreColor(analysisResult.resume_score) }}>
                        {analysisResult.resume_score}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#5B6B7C' }}>/100</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#013265', mb: 1 }}>
                      {getScoreLabel(analysisResult.resume_score)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5B6B7C' }}>
                      Điểm đánh giá tổng thể dựa trên nội dung và cấu trúc CV
                    </Typography>
                  </Box>
                </Box>

                {/* Basic Info */}
                {analysisResult.parsed_data && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: '#013265',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PersonIcon sx={{ color: '#014A94' }} />
                      Thông tin cơ bản
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      {analysisResult.parsed_data.name && (
                        <Typography variant="body2" sx={{ mb: 0.5, color: '#5B6B7C' }}>
                          <strong style={{ color: '#013265' }}>Tên:</strong> {analysisResult.parsed_data.name}
                        </Typography>
                      )}
                      {analysisResult.parsed_data.email && (
                        <Typography variant="body2" sx={{ mb: 0.5, color: '#5B6B7C' }}>
                          <strong style={{ color: '#013265' }}>Email:</strong> {analysisResult.parsed_data.email}
                        </Typography>
                      )}
                      {analysisResult.parsed_data.mobile_number && (
                        <Typography variant="body2" sx={{ mb: 0.5, color: '#5B6B7C' }}>
                          <strong style={{ color: '#013265' }}>Điện thoại:</strong> {analysisResult.parsed_data.mobile_number}
                        </Typography>
                      )}
                      {analysisResult.parsed_data.no_of_pages && (
                        <Typography variant="body2" sx={{ color: '#5B6B7C' }}>
                          <strong style={{ color: '#013265' }}>Số trang:</strong> {analysisResult.parsed_data.no_of_pages}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Education */}
                {analysisResult.parsed_data?.education && filterValidEducation(analysisResult.parsed_data.education).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: '#013265',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <SchoolIcon sx={{ color: '#014A94' }} />
                      Trình độ học vấn ({filterValidEducation(analysisResult.parsed_data.education).length})
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      {filterValidEducation(analysisResult.parsed_data.education).map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid #CEE5FD', '&:last-child': { borderBottom: 'none' } }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#013265' }}>
                            {edu.degree || 'N/A'} - {edu.institution || 'N/A'}
                          </Typography>
                          {edu.field && (
                            <Typography variant="caption" sx={{ color: '#5B6B7C', display: 'block' }}>
                              Ngành: {edu.field}
                            </Typography>
                          )}
                          {edu.year && (
                            <Typography variant="caption" sx={{ color: '#5B6B7C', display: 'block' }}>
                              Năm: {edu.year}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Current Skills */}
                {analysisResult.parsed_data?.skills && analysisResult.parsed_data.skills.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: '#013265',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <BuildIcon sx={{ color: '#014A94' }} />
                      Kỹ năng hiện tại ({analysisResult.parsed_data.skills.length})
                    </Typography>
                    <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysisResult.parsed_data.skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          variant="outlined"
                          sx={{
                            borderColor: '#90CAF9',
                            color: '#014A94',
                            fontWeight: 500,
                            '&:hover': { backgroundColor: '#E3F2FD' },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Skill Match */}
                {analysisResult.skill_match ? (
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#F0F7FF', borderRadius: 2, border: '1px solid #CEE5FD' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: '#013265',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      Mức độ phù hợp với yêu cầu công việc
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={analysisResult.skill_match.match_percent}
                        sx={{
                          flex: 1,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#E0E0E0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor:
                              analysisResult.skill_match.match_percent >= 70
                                ? '#1F7A1F'
                                : analysisResult.skill_match.match_percent >= 40
                                ? '#DEA500'
                                : '#E92020',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#013265', minWidth: 40 }}>
                        {analysisResult.skill_match.match_percent}%
                      </Typography>
                    </Box>

                    {analysisResult.skill_match.matched.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1F7A1F', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <CheckCircleIcon sx={{ fontSize: 16 }} /> Kỹ năng đáp ứng ({analysisResult.skill_match.matched.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 3 }}>
                          {analysisResult.skill_match.matched.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" sx={{ backgroundColor: '#E8F5E9', color: '#1F7A1F', fontWeight: 500 }} />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {analysisResult.skill_match.missing.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#E92020', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <CancelIcon sx={{ fontSize: 16 }} /> Kỹ năng còn thiếu ({analysisResult.skill_match.missing.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 3 }}>
                          {analysisResult.skill_match.missing.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" sx={{ backgroundColor: '#FFEBEE', color: '#E92020', fontWeight: 500 }} />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#FFF8E1', borderRadius: 2, border: '1px solid #FFE082' }}>
                    <Typography variant="body2" sx={{ color: '#F57F17', fontWeight: 600 }}>
                      Không match skill nào với yêu cầu công việc (công việc chưa có yêu cầu kỹ năng).
                    </Typography>
                  </Box>
                )}

                {/* Experience */}
                {analysisResult.parsed_data?.experience && filterValidExperience(analysisResult.parsed_data.experience).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: '#013265',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <BuildIcon sx={{ color: '#014A94' }} />
                      Kinh nghiệm làm việc ({filterValidExperience(analysisResult.parsed_data.experience).length})
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      {filterValidExperience(analysisResult.parsed_data.experience).map((exp, idx) => (
                        <Box key={idx} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid #CEE5FD', '&:last-child': { borderBottom: 'none' } }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#013265' }}>
                            {exp.job_title || 'N/A'} - {exp.company_name || 'N/A'}
                          </Typography>
                          {exp.duration && (
                            <Typography variant="caption" sx={{ color: '#5B6B7C', display: 'block' }}>
                              Thời gian: {exp.duration}
                            </Typography>
                          )}
                          {exp.description && (
                            <Typography variant="caption" sx={{ color: '#5B6B7C', display: 'block', mt: 0.5 }}>
                              {exp.description}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">Chưa có kết quả phân tích</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <StyledButton
              variant="outlined"
              onClick={() => {
                setAnalyzeDialogOpen(false);
                setAnalysisResult(null);
              }}
            >
              Đóng
            </StyledButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
