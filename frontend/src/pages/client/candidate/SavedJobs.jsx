import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Chip from '@mui/material/Chip';
import { colors } from '../../../theme/colors';
import { getSavedJobs, toggleSavedJob } from '../../../store/jobs/action';

export default function SavedJobs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { savedJobs, loading, error } = useSelector((state) => state.jobs);

  // Fetch saved jobs
  React.useEffect(() => {
    if (user?.id) {
      dispatch(getSavedJobs(user.id));
    }
  }, [dispatch, user?.id]);

  const handleRemoveSaved = async (jobId) => {
    await dispatch(toggleSavedJob(user.id, jobId));
    // Refresh the list
    dispatch(getSavedJobs(user.id));
  };
console.log("savedJobs", savedJobs);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
            color: colors.primary.darkest,
            mb: 1,
          }}
        >
          Việc làm đã lưu
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.95rem', fontWeight: 400 }}>
          Danh sách các việc làm bạn đã lưu để xem sau
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : savedJobs && savedJobs.length > 0 ? (
        <Grid container spacing={3}>
          {savedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: colors.shadow.navy,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${colors.primary.light}`,
                  '&:hover': {
                    boxShadow: colors.shadow.navyStrong,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Company Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      src={job?.logo_url || ''}
                      alt={job?.company_name || 'Công ty'}
                      sx={{
                        width: 40,
                        height: 40,
                        border: `2px solid ${colors.primary.light}`,
                      }}
                    >
                      {job?.company_name?.charAt(0) || 'C'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.primary.dark,
                        }}
                      >
                        {job?.company_name || 'Công ty'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Job Title */}
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: colors.primary.darkest,
                      mb: 2,
                      lineHeight: 1.4,
                      minHeight: '2.8em',
                    }}
                  >
                    {job.title}
                  </Typography>

                  {/* Key Info Row */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                    {job.job_type && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.primary.darkest,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <WorkIcon sx={{ fontSize: 18, color: colors.accent.main }} />
                        {job.job_type}
                      </Typography>
                    )}
                    {job.workplace_type && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.primary.darkest,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 18, color: colors.accent.main }} />
                        {job.workplace_type}
                      </Typography>
                    )}
                  </Box>

                  {/* Divider */}
                  <Box sx={{ height: '1px', bgcolor: colors.primary.light, mb: 2.5 }} />

                  {/* Location, Salary, Experience */}
                  {job.work_location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: colors.primary.darkest, fontWeight: 500 }}>
                        {job.work_location}
                      </Typography>
                    </Box>
                  )}

                  {job.salary && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <AttachMoneyIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: colors.accent.main,
                        }}
                      >
                        {job.salary}
                      </Typography>
                    </Box>
                  )}

                  {job.experience && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <SchoolIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: colors.primary.darkest, fontWeight: 500 }}>
                        {job.experience}
                      </Typography>
                    </Box>
                  )}

                  {job.deadline && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontWeight: 500,
                        display: 'block',
                        mt: 1.5,
                      }}
                    >
                      Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ display: 'flex', gap: 1, p: 3, pt: 0 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                    sx={{
                      flex: 1,
                      borderColor: colors.primary.dark,
                      color: colors.primary.dark,
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: colors.primary.darkest,
                        backgroundColor: colors.primary.lighter,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/candidate/jobs/${job.id}?apply=true`)}
                    sx={{
                      flex: 1,
                      background: colors.gradients.primaryButton,
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: colors.gradients.primaryButtonHover,
                        transform: 'translateY(-2px)',
                        boxShadow: colors.shadow.navyMedium,
                      },
                    }}
                  >
                    Ứng tuyển
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: colors.shadow.navy,
            border: `2px dashed ${colors.primary.light}`,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ fontSize: '2rem', mb: 2 }}>
              📋
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Bạn chưa lưu việc làm nào
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/candidate/jobs')}
              sx={{
                mt: 2,
                background: colors.gradients.primaryButton,
                fontWeight: 700,
                px: 4,
                py: 1.2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: colors.gradients.primaryButtonHover,
                  transform: 'translateY(-2px)',
                  boxShadow: colors.shadow.navyMedium,
                },
              }}
            >
              Tìm việc ngay
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
