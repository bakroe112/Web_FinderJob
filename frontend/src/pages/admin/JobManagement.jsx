import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { axiosClient } from '../../config/AxiosClient';

const statusConfig = {
  Open: { label: 'Đang tuyển', bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  Closed: { label: 'Đóng tuyển', bg: '#FFEBEE', color: '#C62828', border: '#EF9A9A' },
  Paused: { label: 'Tạm dừng', bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
};

export default function JobManagement() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [jobSkills, setJobSkills] = React.useState([]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/jobs/all');
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lấy danh sách việc làm thất bại');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetail = async (job) => {
    setDetailDialogOpen(true);
    handleMenuClose();
    try {
      const response = await axiosClient.post('/skills/job', { job_id: job.id });
      if (response.data.success) {
        setJobSkills(response.data.data || []);
      }
    } catch {
      setJobSkills([]);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob) return;

    setActionLoading(true);
    try {
      await axiosClient.post('/recruiter/jobs/delete', { job_id: selectedJob.id });
      fetchJobs();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa việc làm thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return salary;
  };

  const filteredJobs = jobs.filter((job) =>
    !searchQuery.trim() || job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Quản lý việc làm
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            background: 'linear-gradient(90deg, #F4C000, #DEA500)',
            borderRadius: 2,
            mt: 1,
          }}
        />
      </Box>

      {/* Search */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm việc làm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#5B6B7C' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '&:hover fieldset': { borderColor: '#013265' },
              '&.Mui-focused fieldset': { borderColor: '#013265' },
            },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013265' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      ) : filteredJobs.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '12px',
            border: '1px solid #CEE5FD',
            boxShadow: '0 2px 12px rgba(1,50,101,0.08)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
                  '& .MuiTableCell-head': {
                    color: '#fff',
                    fontWeight: 600,
                    borderBottom: 'none',
                    py: 2,
                  },
                }}
              >
                <TableCell>Vị trí</TableCell>
                <TableCell>Công ty</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Mức lương</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đăng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job, idx) => {
                const status = statusConfig[job.status] || { label: job.status, bg: '#F0F0F0', color: '#666', border: '#CCC' };
                return (
                  <TableRow
                    key={job.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#fff' : '#F8FAFC',
                      '&:hover': { bgcolor: 'rgba(1,50,101,0.04)' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#013265' }}>
                        {job.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{job.company_name || 'N/A'}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{formatSalary(job.salary)}</TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          bgcolor: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`,
                          fontWeight: 600,
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(job.created_at)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuClick(e, job)} sx={{ color: '#5B6B7C' }}>
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
        <Card sx={{ borderRadius: '12px', border: '1px solid #CEE5FD' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#5B6B7C' }}>Không tìm thấy việc làm</Typography>
          </CardContent>
        </Card>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '10px', border: '1px solid #CEE5FD', boxShadow: '0 4px 20px rgba(1,50,101,0.1)' },
        }}
      >
        <MenuItem onClick={() => handleViewDetail(selectedJob)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1, color: '#014A94' }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: '#C62828' }} />
          <Typography sx={{ color: '#C62828' }}>Xóa</Typography>
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => { setDetailDialogOpen(false); setJobSkills([]); }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', border: '1px solid #CEE5FD' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#013265', borderBottom: '1px solid #CEE5FD' }}>
          {selectedJob?.title}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, borderColor: '#CEE5FD' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Công ty
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.company_name || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Loại công việc
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.job_type || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Địa điểm
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.location || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Hình thức làm việc
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.workplace_type || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Mức lương
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>
              {formatSalary(selectedJob?.salary)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Kinh nghiệm yêu cầu
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.experience || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Số lượng cần tuyển
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.vacancy_count || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Thời gian làm việc
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{selectedJob?.working_time || 'N/A'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Hạn nộp hồ sơ
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{formatDate(selectedJob?.deadline)}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Trạng thái
            </Typography>
            {(() => {
              const s = statusConfig[selectedJob?.status] || { label: selectedJob?.status, bg: '#F0F0F0', color: '#666', border: '#CCC' };
              return (
                <Chip
                  label={s.label}
                  size="small"
                  sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 600, borderRadius: '6px' }}
                />
              );
            })()}
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Mô tả công việc
            </Typography>
            <Typography paragraph>{selectedJob?.job_description || 'N/A'}</Typography>
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600, mb: 1 }}>
              Kỹ năng yêu cầu
            </Typography>
            {jobSkills.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {jobSkills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: '#014A94', color: '#014A94', borderRadius: '8px', fontWeight: 500 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: '#5B6B7C' }}>Chưa có kỹ năng yêu cầu</Typography>
            )}
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="subtitle2" sx={{ color: '#5B6B7C', fontWeight: 600 }}>
              Quyền lợi được hưởng
            </Typography>
            <Typography paragraph>{selectedJob?.interest || 'N/A'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            sx={{ color: '#013265', borderRadius: '8px', fontWeight: 600 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '12px', border: '1px solid #CEE5FD' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#C62828' }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa việc làm <strong>{selectedJob?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#5B6B7C', borderRadius: '8px' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={actionLoading}
            sx={{
              borderRadius: '8px',
              bgcolor: '#C62828',
              '&:hover': { bgcolor: '#B71C1C' },
            }}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
