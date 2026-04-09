import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { getRecruiterJobs } from '../../../store/jobs/action';
import { getAllApplications } from '../../../store/applications/action';
import { StatsSection, RecentJobsSection, StyledButton } from './components';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { recruiterJobs, loading: jobsLoading } = useSelector(
    (state) => state.jobs
  );
  const { recruiterApplications, loading: appsLoading } = useSelector(
    (state) => state.applications
  );

  const [stats, setStats] = React.useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  // Fetch data on mount
  React.useEffect(() => {
    if (user?.id) {
      dispatch(getRecruiterJobs(user.id));
      dispatch(getAllApplications(user.id));
    }
  }, [dispatch, user?.id]);

  // Calculate stats
  React.useEffect(() => {
    const activeJobs =
      recruiterJobs?.filter((j) => j.status === 'active') || [];
    const pendingApps =
      recruiterApplications?.filter((a) => a.status === 'pending') || [];

    setStats({
      totalJobs: recruiterJobs?.length || 0,
      activeJobs: activeJobs.length,
      totalApplications: recruiterApplications?.length || 0,
      pendingApplications: pendingApps.length,
    });
  }, [recruiterJobs, recruiterApplications]);

  const loading = jobsLoading || appsLoading;

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
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
            Xin chào, {user?.email?.split('@')[0] || 'Nhà tuyển dụng'}!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#5B6B7C',
              fontSize: '16px',
              fontWeight: 500,
            }}
            gutterBottom
          >
            Chào mừng trở lại! Đây là tổng quan hoạt động tuyển dụng của bạn.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#013265' }} size={48} />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <StatsSection stats={stats} />

            {/* Recent Jobs Section */}
            <RecentJobsSection
              recruiterJobs={recruiterJobs}
              loading={false}
            />

            {/* Action Buttons */}
            <Box
              sx={{
                mt: 5,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <StyledButton
                variant="contained"
                size="medium"
                onClick={() => navigate('/recruiter/jobs/create')}
              >
                Đăng tin tuyển dụng
              </StyledButton>
              <StyledButton
                variant="outlined"
                size="medium"
                onClick={() => navigate('/recruiter/applications')}
              >
                Xem ứng viên
              </StyledButton>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
