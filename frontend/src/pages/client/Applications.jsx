import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../theme/colors';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { getAppliedJobs, cancelApplication } from '../../../store/applications/action';

const statusColors = {
  pending: colors.status.warning || "warning",
  viewed: colors.status.info || "info",
  accepted: colors.status.success || "success",
  rejected: colors.status.error || "error",
  cancelled: "default",
};

const statusLabels = {
  pending: "Chờ xem xét",
  viewed: "Đang xem xét",
  accepted: "Được chấp nhận",
  rejected: "Bị từ chối",
  cancelled: "Đã hủy",
};

export default function Applications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { applications, pagination, loading, error } = useSelector((state) => state.applications);

  const [page, setPage] = React.useState(1);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState(null);
  const [cancelLoading, setCancelLoading] = React.useState(false);

  // Fetch applications
  React.useEffect(() => {
    if (user?.id) {
      dispatch(getAppliedJobs(user.id, page, 10));
    }
  }, [dispatch, user?.id, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCancelClick = (application) => {
    setSelectedApplication(application);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedApplication) return;
    setCancelLoading(true);
    const result = await dispatch(cancelApplication(selectedApplication.id, user.id));
    setCancelLoading(false);
    if (result.success) {
      setCancelDialogOpen(false);
      setSelectedApplication(null);
      dispatch(getAppliedJobs(user.id, page, 10));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

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
          Việc đã ứng tuyển
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.text.secondary,
            fontSize: '0.95rem',
            fontWeight: 400,
          }}
        >
          Theo dõi trạng thái các đơn ứng tuyển của bạn
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : applications && applications.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: colors.shadow.navy,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: colors.gradients.primaryButton,
                    '& th': {
                      color: colors.neutral.white,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      padding: '16px',
                    },
                  }}
                >
                  <TableCell>Vị trí</TableCell>
                  <TableCell>Công ty</TableCell>
                  <TableCell>Ngày ứng tuyển</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app, index) => (
                  <TableRow
                    key={app.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: colors.primary.lighter,
                        boxShadow: `inset 0 0 0 1px ${colors.primary.light}`,
                      },
                      borderBottom: `1px solid ${colors.neutral.border}`,
                      transition: 'all 0.3s ease',
                      '& td': {
                        padding: '16px',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.text.primary,
                        }}
                      >
                        {app.job_title || app.job?.title || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.secondary,
                        }}
                      >
                        {app.company_name || app.job?.company_name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.secondary,
                        }}
                      >
                        {formatDate(app.applied_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[app.status] || app.status}
                        color={statusColors[app.status] || 'default'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="medium"
                          variant="outlined"
                          onClick={() => navigate(`/candidate/jobs/${app.job_id}`)}
                          sx={{
                            borderColor: colors.primary.dark,
                            color: colors.primary.dark,
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            px: 2.5,
                            py: 1.2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: colors.primary.darkest,
                              backgroundColor: colors.primary.lighter,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          Xem việc làm
                        </Button>
                        {app.status === 'pending' && (
                          <Button
                            size="medium"
                            color="error"
                            variant="outlined"
                            onClick={() => handleCancelClick(app)}
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              px: 2.5,
                              py: 1.2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: `${colors.status.error}15`,
                                transform: 'translateY(-2px)',
                              },
                            }}
                          >
                            Hủy
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  },
                  '& .MuiPaginationItem-page.Mui-selected': {
                    background: colors.gradients.primaryButton,
                    color: colors.neutral.white,
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Card
          sx={{
            boxShadow: colors.shadow.navy,
            borderRadius: 2,
            border: `2px dashed ${colors.primary.light}`,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 10 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 500,
                mb: 3,
              }}
            >
              Bạn chưa ứng tuyển việc làm nào
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/candidate/jobs')}
              sx={{
                background: colors.gradients.primaryButton,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: colors.shadow.navyMedium,
                },
              }}
            >
              🔍 Tìm việc ngay
            </Button>
          </CardContent>
        </Card>
      )}


      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: '1px solid #CEE5FD',
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#013265', pb: 1 }}>
          Xác nhận hủy
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#5B6B7C' }}>
            Bạn có chắc chắn muốn hủy ứng tuyển vị trí{' '}
            <strong style={{ color: '#013265' }}>
              {selectedApplication?.job_title || selectedApplication?.job?.title}
            </strong>
            ? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            disabled={cancelLoading}
            sx={{
              backgroundColor: '#E92020',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              '&:hover': { backgroundColor: '#C41818' },
            }}
          >
            {cancelLoading ? <CircularProgress size={24} /> : 'Xác nhận hủy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
