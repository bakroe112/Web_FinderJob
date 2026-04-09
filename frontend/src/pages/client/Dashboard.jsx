import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getLatestJobs } from '../../../store/jobs/action';
import { getAppliedJobs } from '../../../store/applications/action';
import { LatestJobsSection } from './components';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { latestJobs, loading: jobsLoading, error: jobsError } = useSelector(
    (state) => state.jobs
  );
  const { applications } = useSelector((state) => state.applications);

  const [stats, setStats] = React.useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  // Fetch data on mount or when user changes
  React.useEffect(() => {
    // Fetch latest jobs (no authentication needed)
    dispatch(getLatestJobs(6));

    // Fetch applied jobs only when user is available
    if (user?.id) {
      dispatch(getAppliedJobs(user.id));
    }
  }, [user?.id, dispatch]);

  // Calculate stats
  React.useEffect(() => {
    if (applications && applications.length > 0) {
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(
          (a) => a.status === 'pending'
        ).length,
        acceptedApplications: applications.filter(
          (a) => a.status === 'accepted'
        ).length,
        rejectedApplications: applications.filter(
          (a) => a.status === 'rejected'
        ).length,
      });
    }
  }, [applications]);

  const statItems = [
    { label: 'Đã nộp', value: stats.totalApplications, icon: <AssignmentIcon />, color: '#077BF1', bg: '#EBF5FF' },
    { label: 'Chờ duyệt', value: stats.pendingApplications, icon: <HourglassBottomIcon />, color: '#D4950C', bg: '#FFF8E1' },
    { label: 'Được nhận', value: stats.acceptedApplications, icon: <CheckCircleOutlineIcon />, color: '#1F7A1F', bg: '#E8F5E9' },
    { label: 'Từ chối', value: stats.rejectedApplications, icon: <HighlightOffIcon />, color: '#D32F2F', bg: '#FFEBEE' },
  ];

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e4f0fc 50%, #eef5ff 100%)',
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #d0e6f7',
            boxShadow: '0 2px 12px rgba(1,80,158,0.07)',
            // Decorative circles
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -60,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(1,80,158,0.04)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -80,
              right: 80,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(1,80,158,0.03)',
            },
          }}
        >
          {/* Greeting */}
          <Box sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#1a3a5c',
                mb: 0.5,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
              }}
            >
              Xin chào, {user?.email?.split('@')[0] || 'Ứng viên'}! 
            </Typography>
            <Typography
              sx={{
                color: 'rgba(26,58,92,0.6)',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              Tổng quan hồ sơ ứng tuyển của bạn
            </Typography>
          </Box>

          {/* Inline Stats */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              gap: { xs: 1.5, md: 2 },
              flexWrap: 'wrap',
            }}
          >
            {statItems.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2.5,
                  px: 2,
                  py: 1.5,
                  flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 auto' },
                  minWidth: { sm: 140 },
                  border: '1px solid rgba(1,80,158,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    backgroundColor: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '20px',
                      color: '#1a3a5c',
                      lineHeight: 1.1,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: 'rgba(26,58,92,0.65)',
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Latest Jobs (full width) */}
        <LatestJobsSection
          latestJobs={latestJobs}
          loading={jobsLoading}
          error={jobsError}
          appliedJobIds={applications?.map((a) => a.job_id) || []}
        />
      </Container>
    </Box>
  );
}