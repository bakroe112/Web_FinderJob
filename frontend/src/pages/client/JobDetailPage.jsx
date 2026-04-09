import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getJobDetail, toggleSavedJob } from '../../store/jobs/action';
import { applyJob, checkApplied } from '../../store/applications/action';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { currentJob, loading, error, savedJobs } = useSelector((state) => state.jobs);
  const { appliedJobs } = useSelector((state) => state.applications);

  const [applyDialogOpen, setApplyDialogOpen] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState('');
  const [applyLoading, setApplyLoading] = React.useState(false);
  const [applyError, setApplyError] = React.useState('');
  const [applySuccess, setApplySuccess] = React.useState(false);

  const isSaved = savedJobs?.includes(parseInt(id));
  const isApplied = appliedJobs?.[id];

  // Fetch job detail
  React.useEffect(() => {
    dispatch(getJobDetail(id));
    if (user?.id && user?.role === 'candidate') {
      dispatch(checkApplied(user.id, id));
    }
  }, [dispatch, id, user?.id, user?.role]);

  const handleToggleSave = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleSavedJob(user.id, parseInt(id)));
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setApplyDialogOpen(true);
  };

  const handleApplySubmit = async () => {
    setApplyLoading(true);
    setApplyError('');

    const result = await dispatch(applyJob(user.id, id, coverLetter));

    setApplyLoading(false);

    if (result.success) {
      setApplySuccess(true);
      setApplyDialogOpen(false);
    } else {
      setApplyError(result.message);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    return `${min ? (min / 1000000).toFixed(0) : 0} - ${max ? (max / 1000000).toFixed(0) : 0} triệu VNĐ`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const jobTypeLabels = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentJob) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Không tìm thấy việc làm</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/jobs')} sx={{ mb: 3 }}>
        Quay lại danh sách
      </Button>

      {applySuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {currentJob.title}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {currentJob.company_name || 'Công ty'}
                  </Typography>
                </Box>
                <IconButton onClick={handleToggleSave}>
                  {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon color="action" />
                  <Typography>{currentJob.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkIcon color="action" />
                  <Typography>{formatSalary(currentJob.salary_min, currentJob.salary_max)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon color="action" />
                  <Typography>Đăng ngày {formatDate(currentJob.created_at)}</Typography>
                </Box>
              </Box>

              {currentJob.job_type && (
                <Chip
                  label={jobTypeLabels[currentJob.job_type] || currentJob.job_type}
                  color="primary"
                  sx={{ mb: 3 }}
                />
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Mô tả công việc
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {currentJob.description}
              </Typography>

              {currentJob.requirements && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Yêu cầu ứng viên
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                    {currentJob.requirements}
                  </Typography>
                </>
              )}

              {currentJob.benefits && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Quyền lợi
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {currentJob.benefits}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              {isApplied ? (
                <Alert severity="info">Bạn đã ứng tuyển vị trí này</Alert>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleApplyClick}
                  disabled={user?.role !== 'candidate'}
                >
                  Ứng tuyển ngay
                </Button>
              )}

              {!isAuthenticated && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  <Button onClick={() => navigate('/login')}>Đăng nhập</Button> để ứng tuyển
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin chung
              </Typography>
              <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', py: 1 } }}>
                <Box>
                  <Typography color="text.secondary">Kinh nghiệm</Typography>
                  <Typography>{currentJob.experience ? `${currentJob.experience} năm` : 'Không yêu cầu'}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary">Loại công việc</Typography>
                  <Typography>{jobTypeLabels[currentJob.job_type] || 'Full-time'}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary">Hạn nộp hồ sơ</Typography>
                  <Typography>{currentJob.deadline ? formatDate(currentJob.deadline) : 'Không giới hạn'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ứng tuyển: {currentJob.title}</DialogTitle>
        <DialogContent>
          {applyError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {applyError}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Viết thư giới thiệu để gây ấn tượng với nhà tuyển dụng
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Thư giới thiệu (không bắt buộc)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleApplySubmit} variant="contained" disabled={applyLoading}>
            {applyLoading ? <CircularProgress size={24} /> : 'Gửi ứng tuyển'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
