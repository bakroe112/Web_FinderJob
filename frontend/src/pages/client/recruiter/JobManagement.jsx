import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getRecruiterJobs, deleteJob } from '../../../store/jobs/action';
import { StyledButton } from './components';

const statusConfig = {
  Open: { label: 'Đang tuyển', bg: '#E8F5E9', color: '#1F7A1F', borderColor: '#A5D6A7' },
  Closed: { label: 'Đã đóng', bg: '#FFEBEE', color: '#E92020', borderColor: '#EF9A9A' },
};

export default function JobManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { recruiterJobs, loading, error } = useSelector((state) => state.jobs);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Fetch jobs on mount
  React.useEffect(() => {
    if (user?.id) {
      dispatch(getRecruiterJobs(user.id));
    }
  }, [dispatch, user?.id]);

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    navigate(`/recruiter/jobs/${selectedJob.id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`/recruiter/jobs/edit/${selectedJob.id}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    const result = await dispatch(deleteJob(selectedJob.id));
    setDeleteLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      setSelectedJob(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 5,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Quản lý tin tuyển dụng
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#5B6B7C',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Quản lý tất cả tin tuyển dụng của bạn
            </Typography>
          </Box>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/recruiter/jobs/create')}
          >
            Đăng tin mới
          </StyledButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#013265' }} size={48} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: '#FFF0F0',
              color: '#E92020',
              border: '1px solid #FFBDBD',
              '& .MuiAlert-icon': { color: '#E92020' },
            }}
          >
            {error}
          </Alert>
        ) : recruiterJobs && recruiterJobs.length > 0 ? (
          <TableContainer
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 3,
              border: '1px solid #CEE5FD',
              boxShadow: '0 2px 12px rgba(1, 50, 101, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
                  }}
                >
                  {['Vị trí', 'Địa điểm', 'Lương', 'Ứng viên', 'Trạng thái', 'Ngày đăng', 'Thao tác'].map(
                    (header, i) => (
                      <TableCell
                        key={header}
                        align={i === 6 ? 'right' : 'left'}
                        sx={{
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '14px',
                          borderBottom: 'none',
                          py: 2,
                        }}
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {recruiterJobs.map((job, index) => {
                  const status = statusConfig[job.job_status] || {
                    label: job.job_status,
                    bg: '#F0F7FF',
                    color: '#013265',
                    borderColor: '#CEE5FD',
                  };
                  return (
                    <TableRow
                      key={job.id}
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
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: "#013265" }}
                        >
                          {job.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#5B6B7C", fontWeight: 500 }}>
                        {job.work_location || "-"}
                      </TableCell>
                      <TableCell sx={{ color: "#F4C000", fontWeight: 700 }}>
                        {job.salary || "Thỏa thuận"}
                      </TableCell>
                      <TableCell sx={{ color: "#013265", fontWeight: 600 }}>
                        {job.total_applicants || 0}
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
                      <TableCell sx={{ color: "#5B6B7C", fontWeight: 500 }}>
                        {formatDate(job.created_at)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, job)}
                          sx={{
                            color: "#013265",
                            "&:hover": {
                              backgroundColor: "#CEE5FD",
                            },
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
              textAlign: 'center',
              py: 10,
              backgroundColor: '#ffffff',
              borderRadius: 3,
              border: '2px dashed #CEE5FD',
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#5B6B7C', fontWeight: 600, mb: 2 }}
            >
              Bạn chưa có tin tuyển dụng nào
            </Typography>
            <StyledButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/recruiter/jobs/create')}
            >
              Đăng tin ngay
            </StyledButton>
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
              border: '1px solid #CEE5FD',
              boxShadow: '0 4px 16px rgba(1, 50, 101, 0.12)',
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={handleView}
            sx={{
              py: 1.5,
              '&:hover': { backgroundColor: '#F0F7FF' },
            }}
          >
            <VisibilityIcon fontSize="small" sx={{ mr: 1.5, color: '#014A94' }} />
            <Typography sx={{ fontWeight: 500, color: '#013265' }}>Xem chi tiết</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleEdit}
            sx={{
              py: 1.5,
              '&:hover': { backgroundColor: '#F0F7FF' },
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: '#F4C000' }} />
            <Typography sx={{ fontWeight: 500, color: '#013265' }}>Chỉnh sửa</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleDeleteClick}
            sx={{
              py: 1.5,
              '&:hover': { backgroundColor: '#FFF0F0' },
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: '#E92020' }} />
            <Typography sx={{ fontWeight: 500, color: '#E92020' }}>Xóa</Typography>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: '1px solid #CEE5FD',
              minWidth: 400,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: '#013265',
              pb: 1,
            }}
          >
            Xác nhận xóa
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#5B6B7C' }}>
              Bạn có chắc chắn muốn xóa tin tuyển dụng{' '}
              <strong style={{ color: '#013265' }}>{selectedJob?.title}</strong>?
              Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <StyledButton
              variant="outlined"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </StyledButton>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              disabled={deleteLoading}
              sx={{
                backgroundColor: '#E92020',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  backgroundColor: '#C41818',
                },
              }}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
