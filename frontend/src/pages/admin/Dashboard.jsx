import * as React from 'react';
// Admin Dashboard
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { axiosClient } from '../../config/AxiosClient';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';

const COLORS = ['#013265', '#014A94', '#F4C000', '#2E7D32', '#9c27b0', '#E92020', '#00BCD4', '#FF9800'];

const roleLabels = { candidate: 'Ứng viên', recruiter: 'Nhà tuyển dụng', admin: 'Admin' };
const jobStatusLabels = { Open: 'Đang tuyển', Closed: 'Đóng tuyển', Paused: 'Tạm dừng' };
const appStatusLabels = { pending: 'Chờ xem xét', viewed: 'Đang xem xét', accepted: 'Chấp nhận', rejected: 'Từ chối', interviewing: 'Phỏng vấn' };

const toChartData = (obj, labelMap) =>
  Object.entries(obj).map(([key, value]) => ({ name: labelMap?.[key] || key, value }));

const monthLabel = (m) => {
  const [y, mo] = m.split('-');
  return `${mo}/${y}`;
};

const toMonthSeries = (obj) =>
  Object.entries(obj)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ name: monthLabel(key), value }));

const renderCustomLabel = ({ name, percent }) =>
  percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const summaryCards = stats
    ? [
        { title: 'Tổng người dùng', value: stats.users.total, icon: <PeopleIcon />, color: '#013265' },
        { title: 'Tổng ứng viên', value: stats.users.byRole.candidate || 0, icon: <PeopleIcon />, color: '#014A94' },
        { title: 'Tổng nhà tuyển dụng', value: stats.users.byRole.recruiter || 0, icon: <BusinessIcon />, color: '#F4C000' },
        { title: 'Tổng tin tuyển dụng', value: stats.jobs.total, icon: <WorkIcon />, color: '#2E7D32' },
        { title: 'Tổng đơn ứng tuyển', value: stats.applications.total, icon: <AssignmentIcon />, color: '#9c27b0' },
        { title: 'Tổng phân tích CV', value: stats.analyses.total, icon: <AnalyticsIcon />, color: '#E92020' },
      ]
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tổng quan hệ thống
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            background: 'linear-gradient(90deg, #F4C000, #DEA500)',
            borderRadius: 2,
            mt: 1,
            mb: 1,
          }}
        />
        <Typography variant="body1" sx={{ color: '#5B6B7C' }}>
          Chào mừng trở lại! Đây là tổng quan hoạt động của hệ thống JobHub.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013265' }} />
        </Box>
      ) : stats ? (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {summaryCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    border: '1px solid #CEE5FD',
                    boxShadow: '0 2px 12px rgba(1,50,101,0.08)',
                    borderTop: `3px solid ${stat.color}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(1,50,101,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          backgroundColor: stat.color,
                          borderRadius: '10px',
                          p: 1,
                          mr: 1.5,
                          display: 'flex',
                          color: stat.color === '#F4C000' ? '#013265' : '#fff',
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#013265' }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#5B6B7C', fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Row 1: Users by Role + Users by Status */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <ChartCard title="Người dùng theo vai trò">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={toChartData(stats.users.byRole, roleLabels)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={renderCustomLabel}
                    >
                      {toChartData(stats.users.byRole, roleLabels).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard title="Công việc theo trạng thái">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={toChartData(stats.jobs.byStatus, jobStatusLabels)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={renderCustomLabel}
                    >
                      {toChartData(stats.jobs.byStatus, jobStatusLabels).map((_, i) => (
                        <Cell key={i} fill={['#2E7D32', '#C62828', '#F57F17'][i % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Row 2: Jobs by Type + Jobs by Workplace */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <ChartCard title="Công việc theo loại hình">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={toChartData(stats.jobs.byType)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Số lượng" fill="#014A94" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard title="Công việc theo hình thức">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={toChartData(stats.jobs.byWorkplace)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Số lượng" fill="#F4C000" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Row 3: Applications by Status + Score Distribution */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <ChartCard title="Đơn ứng tuyển theo trạng thái">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={toChartData(stats.applications.byStatus, appStatusLabels)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={renderCustomLabel}
                    >
                      {toChartData(stats.applications.byStatus, appStatusLabels).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard title="Phân bố điểm CV">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={toChartData(stats.analyses.scoreRanges)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Số lượng" fill="#9c27b0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Row 4: Analyses by Field */}
          {Object.keys(stats.analyses.byField).length > 0 && (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <ChartCard title="Phân tích CV theo lĩnh vực đề xuất">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={toChartData(stats.analyses.byField)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" name="Số lượng" fill="#E92020" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Grid>
            </Grid>
          )}

          {/* Row 5: Monthly Trends */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ChartCard title="Xu hướng theo tháng">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      type="category"
                      allowDuplicatedCategory={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(stats.jobs.byMonth).length > 0 && (
                      <Line
                        data={toMonthSeries(stats.jobs.byMonth)}
                        type="monotone"
                        dataKey="value"
                        name="Công việc"
                        stroke="#2E7D32"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                    {Object.keys(stats.applications.byMonth).length > 0 && (
                      <Line
                        data={toMonthSeries(stats.applications.byMonth)}
                        type="monotone"
                        dataKey="value"
                        name="Đơn ứng tuyển"
                        stroke="#014A94"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                    {Object.keys(stats.analyses.byMonth).length > 0 && (
                      <Line
                        data={toMonthSeries(stats.analyses.byMonth)}
                        type="monotone"
                        dataKey="value"
                        name="Phân tích CV"
                        stroke="#E92020"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Container>
  );
}

function ChartCard({ title, children }) {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid #CEE5FD',
        boxShadow: '0 2px 12px rgba(1,50,101,0.08)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#013265', mb: 2 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
