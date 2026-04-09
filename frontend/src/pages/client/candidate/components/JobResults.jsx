import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import JobCardComponent from './JobCardComponent';

export default function JobResults({
  jobs,
  pagination,
  loading,
  error,
  savedJobs,
  onPageChange,
  onToggleSaved,
  currentPage,
}) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#013265' }} size={48} />
      </Box>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: '#013265',
        }}
      >
        Tìm thấy {pagination?.total || 0} việc làm
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <JobCardComponent
                job={job}
                isSaved={savedJobs[job.id] || false}
                onToggleSaved={onToggleSaved}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                backgroundColor: '#F0F7FF',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#013265',
                  fontWeight: 600,
                }}
              >
                Không tìm thấy việc làm phù hợp
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={onPageChange}
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#013265',
                '&.Mui-selected': {
                  backgroundColor: '#013265',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#014A94',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(1, 50, 101, 0.1)',
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );
}
