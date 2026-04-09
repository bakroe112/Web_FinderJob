import * as React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../theme/colors';
import ApplyJobDialog from './components/ApplyJobDialog';
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
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getJobDetail, toggleSavedJob } from '../../../store/jobs/action';
import { checkApplied } from '../../../store/applications/action';
import { axiosClient } from '../../../config/AxiosClient';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { user } = useSelector((state) => state.user);
  const { jobDetail, loading, error } = useSelector((state) => state.jobs);
  const { appliedJobs } = useSelector((state) => state.applications);

  const [isSaved, setIsSaved] = React.useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = React.useState(false);
  const [jobSkills, setJobSkills] = React.useState([]);

  // Fetch job detail
  React.useEffect(() => {
    if (id) {
      console.log('🔄 useEffect - id:', id, 'user?.id:', user?.id);
      dispatch(getJobDetail(id, user?.id));
      if (user?.id) {
        console.log('🔄 Calling checkApplied - userId:', user.id, 'jobId:', id);
        dispatch(checkApplied(user.id, id));
      }
      // Fetch job skills
      axiosClient.post('/skills/job', { job_id: id })
        .then(res => {
          if (res.data.success) setJobSkills(res.data.data || []);
        })
        .catch(err => console.error('Fetch job skills error:', err));
    }
  }, [dispatch, id, user?.id]);

  // Update isSaved when jobDetail changes
  React.useEffect(() => {
    if (jobDetail?.isSaved !== undefined) {
      setIsSaved(jobDetail.isSaved);
    }
  }, [jobDetail]);

  // Open apply dialog if query param is set
  React.useEffect(() => {
    if (searchParams.get('apply') === 'true' && user?.id) {
      setApplyDialogOpen(true);
    }
  }, [searchParams, user?.id]);

  const handleToggleSaved = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const result = await dispatch(toggleSavedJob(user.id, id));
    if (result.success) {
      setIsSaved(result.data.is_saved);
    }
  };

  const handleApply = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
  };

  const isApplied = appliedJobs[id];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/candidate/jobs')}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  if (!jobDetail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Không tìm thấy việc làm</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/candidate/jobs')}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/candidate/jobs")}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              boxShadow: colors.shadow.navy,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: colors.shadow.navyMedium,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                  pb: 3,
                  borderBottom: `1px solid ${colors.neutral.border}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Avatar
                    src={jobDetail.logo_url}
                    alt={jobDetail.company_name}
                    sx={{
                      width: 70,
                      height: 70,
                      mt: 0.5,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '2px solid #fff',
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        background: colors.gradients.primaryButton,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      {jobDetail.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.text.secondary,
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      {jobDetail.company_name}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleToggleSaved}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {isSaved ? (
                    <BookmarkIcon
                      fontSize="large"
                      style={{ color: colors.accent.main }}
                    />
                  ) : (
                    <BookmarkBorderIcon
                      fontSize="large"
                      sx={{
                        color: colors.text.light,
                        transition: 'color 0.3s ease',
                      }}
                    />
                  )}
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    backgroundColor: colors.primary.lighter,
                    borderRadius: 1.5,
                    flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 auto' },
                  }}
                >
                  <LocationOnIcon sx={{ color: colors.primary.dark, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {jobDetail.work_location}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    backgroundColor: colors.primary.lighter,
                    borderRadius: 1.5,
                    flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 auto' },
                  }}
                >
                  <WorkIcon sx={{ color: colors.status.info, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {jobDetail.job_type || "Full-time"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    backgroundColor: colors.accent.light,
                    borderRadius: 1.5,
                    flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 auto' },
                  }}
                >
                  <AttachMoneyIcon sx={{ color: colors.accent.main, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {jobDetail.salary || "Thỏa thuận"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    backgroundColor: colors.primary.light,
                    borderRadius: 1.5,
                    flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 auto' },
                  }}
                >
                  <AccessTimeIcon sx={{ color: colors.primary.dark, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {jobDetail.experience || "Không yêu cầu"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: colors.text.primary,
                  position: 'relative',
                  paddingBottom: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: colors.gradients.primaryButton,
                    borderRadius: 2,
                  },
                }}
              >
                Thông tin cơ bản
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Lĩnh vực
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.field_name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Mức lương
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.salary || 'Thỏa thuận'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Loại công việc
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.job_type || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Hình thức làm việc
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.workplace_type || '-'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: colors.text.primary,
                  position: 'relative',
                  paddingBottom: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: colors.gradients.primaryButton,
                    borderRadius: 2,
                  },
                }}
              >
                Thông tin tuyển dụng
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Kinh nghiệm yêu cầu
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.experience || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Thời gian làm việc
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.working_time || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Số lượng tuyển
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.vacancy_count || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    Hạn nộp hồ sơ
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
                    {jobDetail.deadline ? new Date(jobDetail.deadline).toLocaleDateString('vi-VN') : '-'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: colors.text.primary,
                  position: 'relative',
                  paddingBottom: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: colors.gradients.primaryButton,
                    borderRadius: 2,
                  },
                }}
              >
                Mô tả công việc
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  mb: 4,
                  lineHeight: 1.8,
                  color: colors.text.secondary,
                }}
              >
                {jobDetail.job_description || "Chưa có mô tả"}
              </Typography>

              {jobSkills.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: colors.text.primary,
                      position: 'relative',
                      paddingBottom: 1,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: 40,
                        height: 3,
                        background: colors.gradients.primaryButton,
                        borderRadius: 2,
                      },
                    }}
                  >
                    Kỹ năng yêu cầu
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    {jobSkills.map((skill) => (
                      <Chip
                        key={skill.id}
                        label={skill.name}
                        variant="outlined"
                        sx={{
                          borderColor: '#014A94',
                          color: '#014A94',
                          fontWeight: 500,
                          borderRadius: '8px',
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}

              {jobDetail.benefits && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: colors.text.primary,
                      position: 'relative',
                      paddingBottom: 1,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: 40,
                        height: 3,
                        background: colors.gradients.primaryButton,
                        borderRadius: 2,
                      },
                    }}
                  >
                    Quyền lợi
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      mb: 4,
                      lineHeight: 1.8,
                      color: colors.text.secondary,
                    }}
                  >
                    {jobDetail.benefits}
                  </Typography>
                </>
              )}


            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: "sticky",
              top: 100,
              boxShadow: colors.shadow.navy,
              borderRadius: 2,
              background: colors.neutral.background,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: colors.text.primary,
                  mb: 2,
                }}
              >
                Ứng tuyển ngay
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {isApplied
                  ? "Bạn đã ứng tuyển vị trí này"
                  : "Hãy ứng tuyển ngay để không bỏ lỡ cơ hội"}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => setApplyDialogOpen(true)}
                disabled={isApplied}
                sx={{
                  background: isApplied
                    ? colors.text.light
                    : colors.gradients.primaryButton,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: colors.shadow.navyMedium,
                  },
                  '&:disabled': {
                    transform: 'none',
                  },
                }}
              >
                {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleToggleSaved}
                sx={{
                  mt: 2,
                  borderColor: colors.primary.dark,
                  color: colors.primary.dark,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: colors.primary.lighter,
                    borderColor: colors.primary.darkest,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {isSaved ? "Đã lưu" : "Lưu việc làm"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ApplyJobDialog
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
        jobDetail={jobDetail}
      />
    </Container>
  );
}
