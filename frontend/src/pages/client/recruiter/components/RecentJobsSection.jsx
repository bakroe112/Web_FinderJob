import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { colors } from '../../../../theme/colors';
import { JobCard, StyledButton } from './DashboardStyles';

export default function RecentJobsSection({ recruiterJobs, loading }) {
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
            color: "#013265",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 24,
              background: "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
              borderRadius: 2,
            }}
          />
          Tin tuyển dụng gần đây
        </Typography>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#013265" }} size={48} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {recruiterJobs && recruiterJobs.length > 0 ? (
            recruiterJobs.slice(0, 3).map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${colors.primary.light}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Job Title */}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: colors.primary.darkest,
                        mb: 2,
                        lineHeight: 1.4,
                        minHeight: "2.8em",
                      }}
                    >
                      {job.title}
                    </Typography>

                    {/* Divider */}
                    <Box
                      sx={{
                        height: "1px",
                        bgcolor: colors.primary.light,
                        mb: 2.5,
                      }}
                    />

                    {/* Location */}
                    {job.work_location && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <LocationOnIcon
                          sx={{
                            fontSize: 18,
                            color: colors.accent.main,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.primary.darkest,
                            fontWeight: 500,
                          }}
                        >
                          {job.work_location}
                        </Typography>
                      </Box>
                    )}

                    {/* Applications count */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <PeopleIcon
                        sx={{
                          fontSize: 18,
                          color: colors.accent.main,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: colors.accent.main,
                        }}
                      >
                        {job.total_applicants || 0} ứng viên
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0, gap: 1, display: "flex" }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
                      sx={{
                        flex: 1,
                        borderColor: colors.primary.dark,
                        color: colors.primary.dark,
                        fontWeight: 700,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: colors.primary.darkest,
                          backgroundColor: colors.primary.lighter,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </JobCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  backgroundColor: "transparent",
                  borderRadius: 2,
                  border: `2px dashed ${colors.primary.light}`,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text?.secondary || "#5B6B7C",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Bạn chưa có tin tuyển dụng nào
                </Typography>
                <StyledButton
                  variant="contained"
                  onClick={() => navigate("/recruiter/jobs/create")}
                >
                  Đăng tin ngay
                </StyledButton>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
