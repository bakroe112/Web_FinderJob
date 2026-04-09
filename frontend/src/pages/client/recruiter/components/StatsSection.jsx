import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import PendingIcon from '@mui/icons-material/Pending';
import { StatsCard } from './DashboardStyles';

export default function StatsSection({ stats }) {
  const statsCards = [
    {
      title: 'Tổng tin tuyển dụng',
      value: stats.totalJobs,
      icon: <WorkIcon />,
      color: '#077BF1',
    },
    {
      title: 'Tin đang hoạt động',
      value: stats.activeJobs,
      icon: <CheckCircleIcon />,
      color: '#1F7A1F',
    },
    {
      title: 'Tổng ứng viên',
      value: stats.totalApplications,
      icon: <PeopleIcon />,
      color: '#F4C000',
    },
    {
      title: 'Ứng viên chờ duyệt',
      value: stats.pendingApplications,
      icon: <PendingIcon />,
      color: '#E92020',
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mb: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
      }}
    >
      {statsCards.map((stat, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={index}
          sx={{ display: 'flex', flex: 1, minWidth: 0 }}
        >
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: stat.color,
                    borderRadius: 2,
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    color: 'white',
                    minWidth: 56,
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: '#013265',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#5B6B7C',
                      fontWeight: 500,
                      fontSize: '15px',
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
      ))}
    </Grid>
  );
}
