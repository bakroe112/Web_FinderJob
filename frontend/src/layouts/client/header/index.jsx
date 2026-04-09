import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  setLocalNotifications,
} from '../../../store/notifications/action';

const candidatePages = [
  { title: 'Tìm việc', path: '/candidate/jobs' },
  { title: 'Việc đã ứng tuyển', path: '/candidate/applications' },
  { title: 'Việc đã lưu', path: '/candidate/saved-jobs' },
  { title: 'Đánh giá CV', path: '/candidate/resume-analysis' },
];

const recruiterPages = [
  { title: 'Quản lý tin tuyển dụng', path: '/recruiter/jobs' },
  { title: 'Ứng viên', path: '/recruiter/applications' },
];

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount, notifications } = useNotification();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = React.useState(false);
  const [notificationsLoading, setNotificationsLoading] = React.useState(false);
  const [localNotifications, setLocalNotificationsState] = React.useState([]);

  const pages = user?.role === 'recruiter' ? recruiterPages : candidatePages;

  // Fetch notifications when drawer opens
  const handleOpenNotificationDrawer = async () => {
    setNotificationDrawerOpen(true);
    if (!localNotifications.length) {
      setNotificationsLoading(true);
      const result = await dispatch(fetchNotifications(user?.id));
      if (result.success) {
        setLocalNotificationsState(result.data || []);
      }
      setNotificationsLoading(false);
    }
  };

  const handleCloseNotificationDrawer = () => {
    setNotificationDrawerOpen(false);
  };

  const handleDeleteNotification = async (notificationId) => {
    const result = await dispatch(deleteNotification(user?.id, notificationId));
    if (result.success) {
      setLocalNotificationsState(localNotifications.filter(n => n.id !== notificationId));
    }
  };

  const handleMarkAsRead = async (notification) => {
    if (notification.is_read) return; // Already read

    const result = await dispatch(markNotificationAsRead(user?.id, notification.id));
    if (result.success) {
      // Update local state
      setLocalNotificationsState(
        localNotifications.map(n =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const handleProfile = () => {
    const profilePath = user?.role === 'recruiter' 
      ? '/recruiter/profile' 
      : '/candidate/profile';
    navigate(profilePath);
    handleCloseUserMenu();
  };

  const handleDashboard = () => {
    const dashboardPath = user?.role === 'recruiter' 
      ? '/recruiter/dashboard' 
      : '/candidate/dashboard';
    navigate(dashboardPath);
    handleCloseUserMenu();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
        boxShadow: '0 4px 20px rgba(1, 50, 101, 0.15)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              backgroundColor: '#F4C000',
              borderRadius: 1,
              p: 1,
              mr: 2,
            }}
          >
            <WorkIcon sx={{ color: '#013265', fontSize: 28 }} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#F4C000',
              },
            }}
          >
            JOBHUB
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {isAuthenticated && pages.map((page) => (
                <MenuItem key={page.path} onClick={() => handleNavigate(page.path)}>
                  <Typography sx={{ textAlign: 'center' }}>{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              backgroundColor: '#F4C000',
              borderRadius: 1,
              p: 0.75,
              mr: 1,
            }}
          >
            <WorkIcon sx={{ color: '#013265', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#F4C000',
              },
            }}
          >
            JOBHUB
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {isAuthenticated && pages.map((page) => (
              <Button
                key={page.path}
                onClick={() => handleNavigate(page.path)}
                sx={{ 
                  my: 2, 
                  color: '#ffffff', 
                  display: 'block',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    backgroundColor: 'rgba(244, 192, 0, 0.1)',
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleOpenNotificationDrawer}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 192, 0, 0.2)',
                      color: '#F4C000',
                    },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Notification Side Panel */}
                <Drawer
                  anchor="right"
                  open={notificationDrawerOpen}
                  onClose={handleCloseNotificationDrawer}
                  PaperProps={{
                    sx: { width: { xs: '100%', sm: 400 } },
                  }}
                >
                  <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
                    color: '#ffffff',
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                      Thông báo
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleCloseNotificationDrawer}
                      sx={{ color: '#ffffff' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Divider />

                  {notificationsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                      <CircularProgress sx={{ color: '#013265' }} />
                    </Box>
                  ) : localNotifications && localNotifications.length > 0 ? (
                    <List sx={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
                      {localNotifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                          <ListItem
                            button
                            onClick={() => handleMarkAsRead(notification)}
                            sx={{
                              bgcolor: notification.is_read ? 'transparent' : '#F0F7FF',
                              py: 2,
                              px: 2,
                              cursor:"pointer",
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: '#F0F7FF',
                                borderLeft: '3px solid #F4C000',
                              },
                            }}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                                sx={{
                                  color: '#E92020',
                                  '&:hover': {
                                    backgroundColor: '#FFF0F0',
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            }
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <NotificationsIcon 
                                fontSize="small" 
                                sx={{
                                  color: notification.is_read ? '#5B6B7C' : '#077BF1',
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: notification.is_read ? 400 : 600,
                                    color: '#013265',
                                  }}
                                >
                                  {notification.message}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(notification.created_at).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < localNotifications.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                      <NotificationsNoneIcon sx={{ fontSize: 48, color: '#5B6B7C', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Không có thông báo
                      </Typography>
                    </Box>
                  )}
                </Drawer>

                <Tooltip title="Tài khoản">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Avatar 
                      alt={user?.email} 
                      src={user?.avatar_url || ''} 
                      sx={{
                        border: '2px solid #F4C000',
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="user-menu"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem 
                    onClick={handleDashboard}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F0F7FF',
                      },
                    }}
                  >
                    <Typography sx={{ textAlign: 'center', color: '#013265', fontWeight: 500 }}>Dashboard</Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleProfile}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F0F7FF',
                      },
                    }}
                  >
                    <Typography sx={{ textAlign: 'center', color: '#013265', fontWeight: 500 }}>Hồ sơ</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#FFF0F0',
                      },
                    }}
                  >
                    <Typography sx={{ textAlign: 'center', color: '#E92020', fontWeight: 600 }}>Đăng xuất</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#F4C000',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontWeight: 600,
                    borderColor: '#F4C000',
                    color: '#F4C000',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F4C000',
                      color: '#013265',
                      borderColor: '#F4C000',
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
