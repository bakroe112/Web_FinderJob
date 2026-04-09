import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors } from '../../../../theme/colors';
import { JobCard, StyledButton } from './DashboardStyles';

export default function LatestJobsSection({
  latestJobs,
  loading,
  error,
  appliedJobIds = [],
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* Section Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            mb: 3,
            fontWeight: 700,
            color: '#013265',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 24,
              background: 'linear-gradient(180deg, #013265 0%, #F4C000 100%)',
              borderRadius: 2,
            }}
          />
          Việc làm mới nhất
        </Typography>
      </Box>

      {/* Loading State */}
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
            '& .MuiAlert-icon': {
              color: '#E92020',
            },
          }}
        >
          {error}
        </Alert>
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {latestJobs && latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid ${colors.primary.light}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Company Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar
                        src={job.logo_url || '/default-company-logo.png'}
                        alt={job.company_name}
                        sx={{
                          width: 40,
                          height: 40,
                          border: `2px solid ${colors.primary.light}`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.primary.dark,
                        }}
                      >
                        {job.company_name}
                      </Typography>
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

                    {/* Divider */}
                    <Box sx={{ height: '1px', bgcolor: colors.primary.light, mb: 2.5 }} />

                    {/* Location */}
                    {job.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: colors.primary.darkest, fontWeight: 500 }}>
                          {job.location}
                        </Typography>
                      </Box>
                    )}

                    {/* Salary */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <AttachMoneyIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: colors.accent.main,
                        }}
                      >
                        {job.salary_min && job.salary_max
                          ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} VNĐ`
                          : 'Thỏa thuận'}
                      </Typography>
                    </Box>

                    {/* Job Type and Experience */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
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
                      {job.experience && (
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
                          <SchoolIcon sx={{ fontSize: 18, color: colors.accent.main }} />
                          {job.experience} năm KN
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0, gap: 1, display: 'flex' }}>
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
                    {appliedJobIds.includes(job.id) ? (
                      <Button
                        variant="contained"
                        disabled
                        sx={{
                          flex: 1,
                          fontWeight: 600,
                          padding: '10px 24px',
                          borderRadius: 2,
                          textTransform: 'none',
                          background: '#D4950C !important',
                          color: '#fff !important',
                          boxShadow: 'none !important',
                          opacity: '0.9 !important',
                        }}
                      >
                        Đã nộp
                      </Button>
                    ) : (
                      <StyledButton
                        variant="contained"
                        onClick={() => navigate(`/candidate/jobs/${job.id}?apply=true`)}
                        sx={{ flex: 1 }}
                      >
                        Ứng tuyển
                      </StyledButton>
                    )}
                  </CardActions>
                </JobCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  backgroundColor: 'transparent',
                  borderRadius: 2,
                  border: `2px dashed ${colors.primary.light}`,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text.secondary,
                    fontWeight: 600,
                  }}
                >
                  Chưa có việc làm nào
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
