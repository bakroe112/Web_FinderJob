import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import { getRecruiterJobDetail } from '../../../store/jobs/action';
import { StyledButton } from './components';
import { axiosClient } from '../../../config/AxiosClient';

const statusConfig = {
  Open: { label: 'Đang tuyển', bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  Closed: { label: 'Đã đóng', bg: '#FFEBEE', color: '#C62828', border: '#EF9A9A' },
  Paused: { label: 'Tạm dừng', bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
};

const cardSx = {
  borderRadius: '12px',
  border: '1px solid #CEE5FD',
  boxShadow: '0 2px 12px rgba(1,50,101,0.08)',
  overflow: 'hidden',
};

const sectionTitleSx = {
  fontWeight: 700,
  color: '#013265',
  mb: 2,
};

const infoLabelSx = {
  fontWeight: 600,
  color: '#5B6B7C',
  fontSize: '0.8rem',
  mb: 0.5,
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { jobDetail, recruiterJobDetail, loading, error } = useSelector((state) => state.jobs);
  const [jobSkills, setJobSkills] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      dispatch(getRecruiterJobDetail(id));
      // Fetch job skills
      axiosClient.post('/skills/job', { job_id: id })
        .then(res => {
          if (res.data.success) setJobSkills(res.data.data || []);
        })
        .catch(err => console.error('Fetch job skills error:', err));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#013265' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recruiter/jobs')}
          sx={{ mb: 3 }}
          size="medium"
        >
          Quay lại
        </StyledButton>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Container>
    );
  }

  if (!jobDetail && !recruiterJobDetail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recruiter/jobs')}
          sx={{ mb: 3 }}
          size="medium"
        >
          Quay lại
        </StyledButton>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>Không tìm thấy thông tin công việc</Alert>
      </Container>
    );
  }

  const job = recruiterJobDetail || jobDetail;
  const status = statusConfig[job.job_status] || { label: job.job_status, bg: '#F0F0F0', color: '#666', border: '#CCC' };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <StyledButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recruiter/jobs')}
          size="medium"
        >
          Quay lại
        </StyledButton>
        <StyledButton
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/recruiter/jobs/edit/${id}`)}
          size="medium"
        >
          Chỉnh sửa
        </StyledButton>
      </Box>

      {/* Main Card */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {/* Job Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, color: '#013265', mb: 1 }}
              >
                {job.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ color: '#014A94', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#5B6B7C' }}>{job.work_location || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkIcon sx={{ color: '#014A94', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#5B6B7C' }}>{job.job_type}</Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={status.label}
              sx={{
                bgcolor: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`,
                fontWeight: 600,
                borderRadius: '8px',
                px: 1,
              }}
            />
          </Box>

          <Divider sx={{ my: 3, borderColor: '#CEE5FD' }} />

          {/* Thông tin cơ bản */}
          <Typography variant="h6" sx={sectionTitleSx}>
            Thông tin cơ bản
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Lĩnh vực</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.field_name || '-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Mức lương</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.salary || 'Thỏa thuận'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Loại công việc</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.job_type}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Hình thức làm việc</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.workplace_type || '-'}</Typography>
            </Grid>
          </Grid>

          {/* Thông tin tuyển dụng */}
          <Typography variant="h6" sx={sectionTitleSx}>
            Thông tin tuyển dụng
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Kinh nghiệm yêu cầu</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.experience || '-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Thời gian làm việc</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.working_time || '-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Số lượng tuyển</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{job.vacancy_count || '-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Hạn nộp hồ sơ</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : '-'}
              </Typography>
            </Grid>
          </Grid>

          {/* Thông tin hệ thống */}
          <Typography variant="h6" sx={sectionTitleSx}>
            Thông tin hệ thống
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Ngày tạo</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {job.created_at ? new Date(job.created_at).toLocaleDateString('vi-VN') : '-'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography sx={infoLabelSx}>Ngày cập nhật</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {job.updated_at ? new Date(job.updated_at).toLocaleDateString('vi-VN') : '-'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: '#CEE5FD' }} />

          {/* Mô tả công việc */}
          <Typography variant="h6" sx={sectionTitleSx}>
            Mô tả công việc
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 3, color: '#333', lineHeight: 1.8 }}>
            {job.job_description}
          </Typography>

          {jobSkills.length > 0 && (
            <>
              <Typography variant="h6" sx={sectionTitleSx}>
                Kỹ năng yêu cầu
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
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

          {job.interest && (
            <>
              <Typography variant="h6" sx={sectionTitleSx}>
                Quyền lợi
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 3, color: '#333', lineHeight: 1.8 }}>
                {job.interest}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
