import * as React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../../store/notifications/action';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
  boxShadow: '0 4px 20px rgba(1, 50, 101, 0.15)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      background: 'linear-gradient(180deg, #013265 0%, #0B2A4A 100%)',
      color: '#ffffff',
      borderRight: 'none',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const menuItems = [
  { title: 'Dashboard', path: '/recruiter/dashboard', icon: <DashboardIcon /> },
  { title: 'Tin tuyển dụng', path: '/recruiter/jobs', icon: <WorkIcon /> },
  { title: 'Đăng tin mới', path: '/recruiter/jobs/create', icon: <AddIcon /> },
  { title: 'Ứng viên', path: '/recruiter/applications', icon: <PeopleIcon /> },
  { title: 'Hồ sơ công ty', path: '/recruiter/profile', icon: <PersonIcon /> },
];

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = React.useState(false);
  const [notificationsLoading, setNotificationsLoading] = React.useState(false);
  const [localNotifications, setLocalNotificationsState] = React.useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleProfile = () => {
    navigate('/recruiter/profile');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Nhà tuyển dụng
          </Typography>
          <IconButton 
            color="inherit"
            onClick={handleOpenNotificationDrawer}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <Badge
              badgeContent={unreadCount}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#F4C000',
                  color: '#013265',
                  fontWeight: 700,
                },
              }}
            >
              <NotificationsIcon sx={{ color: '#fff' }} />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
            <Avatar
              alt={user?.email}
              src={user?.avatar_url || ''}
              sx={{
                width: 34,
                height: 34,
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>Hồ sơ</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>

          {/* Notification Side Panel */}
          <MuiDrawer
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
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                Thông báo
              </Typography>
              <IconButton
                size="small"
                onClick={handleCloseNotificationDrawer}
                sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />

            {notificationsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : localNotifications && localNotifications.length > 0 ? (
              <List sx={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
                {localNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      button
                      onClick={() => handleMarkAsRead(notification)}
                      sx={{
                        bgcolor: notification.is_read ? 'transparent' : 'rgba(1,50,101,0.04)',
                        py: 2,
                        px: 2,
                        cursor: 'pointer',
                        borderLeft: notification.is_read ? 'none' : '3px solid #014A94',
                        '&:hover': {
                          bgcolor: 'rgba(1,50,101,0.06)',
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
                            color: '#999',
                            '&:hover': { color: '#C62828', bgcolor: 'rgba(198,40,40,0.08)' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <NotificationsIcon fontSize="small" sx={{ color: notification.is_read ? '#999' : '#014A94' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notification.is_read ? 400 : 600,
                              color: 'text.primary',
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
                <NotificationsNoneIcon sx={{ fontSize: 48, color: '#CEE5FD', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Không có thông báo
                </Typography>
              </Box>
            )}
          </MuiDrawer>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 'auto', ml: 1 }}>
            <Box
              sx={{
                backgroundColor: '#F4C000',
                borderRadius: 1,
                p: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WorkIcon sx={{ color: '#013265', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: '#ffffff',
              }}
            >
              JOBHUB
            </Typography>
          </Box>
          <IconButton onClick={toggleDrawer} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#F4C000' } }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
        <List component="nav" sx={{ px: 1, pt: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(244, 192, 0, 0.15)',
                  color: '#F4C000',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 192, 0, 0.25)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.15)' }} />
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: '#F8FAFC',
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
