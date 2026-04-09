import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/material/styles';
import { searchJobs } from '../../store/jobs/action';
import { colors } from '../../theme/colors';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #CEE5FD',
  boxShadow: '0 2px 8px rgba(1, 50, 101, 0.08)',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 32px rgba(1, 50, 101, 0.2)',
    transform: 'translateY(-4px)',
    borderColor: '#F4C000',
  },
}));

const SearchCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: `2px solid ${colors.primary.light}`,
  boxShadow: `0 4px 16px ${colors.shadow.navy}`,
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 8px 24px ${colors.shadow.navyMedium}`,
    borderColor: colors.accent.main,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: `1px solid ${colors.primary.light}`,
  boxShadow: colors.shadow.navy,
  borderRadius: 8,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: colors.shadow.navyStrong,
    transform: 'translateY(-4px)',
  },
}));

export default function JobListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { jobs, loading, pagination } = useSelector((state) => state.jobs);

  const [filters, setFilters] = React.useState({
    keyword: searchParams.get('keyword') || '',
    location: '',
    job_type: '',
    salary_min: '',
    salary_max: '',
  });

  const [page, setPage] = React.useState(1);

  // Fetch jobs on mount and when page changes
  React.useEffect(() => {
    dispatch(searchJobs({ ...filters, page, limit: 12 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(searchJobs({ ...filters, page: 1, limit: 12 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    return `${min ? (min / 1000000).toFixed(0) : 0} - ${max ? (max / 1000000).toFixed(0) : 0} triệu`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hôm nay';
    if (diff === 1) return 'Hôm qua';
    if (diff < 7) return `${diff} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const jobTypeLabels = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colors.primary.darkest} 0%, ${colors.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Tìm việc làm
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.primary.main,
              fontSize: '16px',
              fontWeight: 500
            }} 
          >
            Khám phá hàng ngàn cơ hội việc làm tuyệt vời
          </Typography>
        </Box>

        {/* Search & Filters */}
        <SearchCard sx={{ mb: 4, p: 2.5 }}>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={3.5}>
                <TextField
                  fullWidth
                  label="Từ khóa"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Vị trí, công ty..."
                  variant="outlined"
                  InputLabelProps={{
                    sx: {
                      color: colors.primary.main,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      '&.Mui-focused': {
                        color: colors.primary.dark,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: colors.primary.dark, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                      borderRadius: 1.5,
                      fontSize: '0.95rem',
                      '&:hover fieldset': {
                        borderColor: colors.accent.main,
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary.dark,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '12px 14px',
                      color: colors.primary.darkest,
                      '&::placeholder': {
                        color: colors.primary.main,
                        opacity: 0.7,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Địa điểm"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Hà Nội, TP.HCM..."
                  variant="outlined"
                  InputLabelProps={{
                    sx: {
                      color: colors.primary.main,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      '&.Mui-focused': {
                        color: colors.primary.dark,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: colors.primary.dark, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                      borderRadius: 1.5,
                      fontSize: '0.95rem',
                      '&:hover fieldset': {
                        borderColor: colors.accent.main,
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary.dark,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '12px 14px',
                      color: colors.primary.darkest,
                      '&::placeholder': {
                        color: colors.primary.main,
                        opacity: 0.7,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3.5}>
                <FormControl fullWidth>
                  <InputLabel sx={{
                    color: colors.primary.main,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&.Mui-focused': {
                      color: colors.primary.dark,
                    },
                  }}>Loại công việc</InputLabel>
                  <Select
                    name="job_type"
                    value={filters.job_type}
                    label="Loại công việc"
                    onChange={handleFilterChange}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.95rem',
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.accent.main,
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.dark,
                          borderWidth: '2px',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="full-time">Full-time</MenuItem>
                    <MenuItem value="part-time">Part-time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    height: "48px", 
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: colors.gradients.primaryButton,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      background: colors.gradients.primaryButtonHover,
                      transform: 'translateY(-2px)',
                      boxShadow: colors.shadow.navyStrong,
                    },
                  }}
                >
                  Tìm
                </Button>
              </Grid>
            </Grid>
          </Box>
        </SearchCard>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: colors.primary.dark }} size={48} />
          </Box>
        ) : jobs && jobs.length > 0 ? (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: colors.primary.darkest,
              }}
            >
              Tìm thấy {pagination?.total || jobs.length} việc làm
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {jobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job.id}>
                  <StatsCard
                    sx={{ 
                      height: "100%",
                      display: 'flex',
                      flexDirection: 'column',
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
                            {jobTypeLabels[job.job_type] || job.job_type}
                          </Typography>
                        )}
                      </Box>

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
                          {formatSalary(job.salary_min, job.salary_max)}
                        </Typography>
                      </Box>
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
                          color: 'white',
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: colors.gradients.primaryButtonHover,
                            transform: 'translateY(-2px)',
                            boxShadow: colors.shadow.navyStrong,
                          },
                        }}
                      >
                        Ứng tuyển
                      </Button>
                    </CardActions>
                  </StatsCard>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: colors.primary.dark,
                      '&.Mui-selected': {
                        backgroundColor: colors.primary.dark,
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: colors.primary.darkest,
                        },
                      },
                      '&:hover': {
                        backgroundColor: colors.primary.light,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <StyledCard>
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <Typography 
                variant="h6" 
                sx={{
                  color: colors.primary.darkest,
                  fontWeight: 600,
                  mb: 1,
                }}
                gutterBottom
              >
                Không tìm thấy việc làm phù hợp
              </Typography>
              <Typography sx={{ color: colors.primary.main }}>
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </Typography>
            </CardContent>
          </StyledCard>
        )}
      </Container>
    </Box>
  );
}
