import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { searchJobs, toggleSavedJob } from '../../../store/jobs/action';
import { colors } from '../../../theme/colors';
import { SearchFilter, JobResults } from './components';

export default function JobList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { jobs, pagination, loading, error } = useSelector((state) => state.jobs);

  const [filters, setFilters] = React.useState({
    keyword: '',
    location: '',
    job_type: '',
    experience: '',
    salary_min: '',
    salary_max: '',
    page: 1,
    limit: 12,
  });
  const [savedJobs, setSavedJobs] = React.useState({});

  // Fetch initial jobs on mount
  React.useEffect(() => {
    const searchFilters = {
      ...filters,
      ...(user?.id && { user_id: user.id }),
    };
    dispatch(searchJobs(searchFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user?.id]);

  // Update savedJobs when jobs are fetched
  React.useEffect(() => {
    if (jobs && jobs.length > 0) {
      const savedJobsMap = {};
      jobs.forEach((job) => {
        if (job.isSaved !== undefined) {
          savedJobsMap[job.id] = job.isSaved;
        }
      });
      setSavedJobs(savedJobsMap);
    }
  }, [jobs]);

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      page: 1,
      ...(user?.id && { user_id: user.id }),
    };
    dispatch(searchJobs(searchFilters));
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (event, page) => {
    const searchFilters = {
      ...filters,
      page,
      ...(user?.id && { user_id: user.id }),
    };
    setFilters((prev) => ({ ...prev, page }));
    dispatch(searchJobs(searchFilters));
    window.scrollTo(0, 0);
  };

  const handleToggleSaved = async (jobId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const result = await dispatch(toggleSavedJob(user.id, jobId));
    if (result.success) {
      setSavedJobs((prev) => ({
        ...prev,
        [jobId]: result.data.is_saved,
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
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
            Tìm việc làm
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              fontSize: '0.95rem',
              fontWeight: 400,
            }}
          >
            Khám phá hàng ngàn cơ hội việc làm phù hợp
          </Typography>
        </Box>

        {/* Search Filters */}
        <SearchFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
        />

        {/* Results */}
        <JobResults
          jobs={jobs}
          pagination={pagination}
          loading={loading}
          error={error}
          savedJobs={savedJobs}
          onPageChange={handlePageChange}
          onToggleSaved={handleToggleSaved}
          currentPage={filters.page}
        />
      </Container>
    </Box>
  );
}
