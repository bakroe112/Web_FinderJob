import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolIcon from "@mui/icons-material/School";
import { getLatestJobs } from "../../store/jobs/action";
import { colors } from "../../theme/colors";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { latestJobs, loading } = useSelector((state) => state.jobs);
  const [keyword, setKeyword] = React.useState("");

  // Fetch latest jobs on mount
  React.useEffect(() => {
    dispatch(getLatestJobs(6));
  }, [dispatch]);


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    return `${min ? (min / 1000000).toFixed(0) : 0} - ${max ? (max / 1000000).toFixed(0) : 0} triệu`;
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary.darkest} 0%, ${colors.primary.dark} 50%, #0856BD 100%)`,
          color: "white",
          py: { xs: 6, sm: 8, md: 12 },
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(244, 192, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(244, 192, 0, 0.05) 0%, transparent 50%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 2,
              letterSpacing: '-0.5px',
              background: `linear-gradient(90deg, #ffffff 0%, #F0F7FF 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Tìm việc làm mơ ước
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 5,
              opacity: 0.95,
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              letterSpacing: '0.3px',
            }}
          >
            Hàng nghìn cơ hội việc làm đang chờ đón bạn tại những công ty hàng đầu
          </Typography>

          {/* Search Form */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Nhập vị trí, công ty hoặc từ khóa..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                },
                "& .MuiOutlinedInput-root": {
                  fontSize: '1rem',
                  padding: '8px 16px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.dark,
                    borderWidth: '2px',
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.primary.dark, fontSize: 24 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        background: colors.gradients.primaryButton,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '1rem',
                        px: 3,
                        py: 1.2,
                        borderRadius: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: colors.gradients.primaryButtonHover,
                          transform: 'translateY(-2px)',
                          boxShadow: colors.shadow.navyStrong,
                        },
                      }}
                    >
                      Tìm kiếm
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

        </Container>
      </Box>

      {/* Latest Jobs Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ color: colors.primary.darkest }}>
          Việc làm mới nhất
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {latestJobs && latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                        <Avatar
                          src={job.logo_url}
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
                      {job.work_location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: colors.primary.darkest, fontWeight: 500 }}>
                            {job.work_location}
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
                          {formatSalary(job.salary_min, job.salary_max)}
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
              ))
            ) : (
              <Grid item xs={12}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: colors.shadow.navy,
                    border: `2px dashed ${colors.primary.light}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 8 }}>
                    <Typography
                      sx={{
                        color: colors.text.secondary,
                        fontWeight: 600,
                      }}
                    >
                      Chưa có việc làm nào
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        <Box sx={{ textAlign: "center", mt: 6, mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/candidate/jobs")}
            sx={{
              background: colors.gradients.primaryButton,
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: '1.05rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: colors.gradients.primaryButtonHover,
                transform: 'translateY(-2px)',
                boxShadow: colors.shadow.navyStrong,
              },
            }}
          >
            Xem tất cả việc làm
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
