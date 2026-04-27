import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { axiosClient } from '../config/AxiosClient';

// Create Notification Context
const NotificationContext = createContext(null);

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      setLoading(true);
      const response = await axiosClient.post('/notifications/list', {
        user_id: user.id,
      });

      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter((n) => !n.is_read).length);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lấy thông báo thất bại');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await axiosClient.post('/notifications/mark-read', {
        notification_id: notificationId,
      });

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await axiosClient.post('/notifications/mark-all-read', {
        user_id: user.id,
      });

      if (response.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  }, [user?.id]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await axiosClient.post('/notifications/delete', {
        notification_id: notificationId,
      });

      if (response.data.success) {
        const notification = notifications.find((n) => n.id === notificationId);
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (notification && !notification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  }, [notifications]);

  // Fetch notifications when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  // Memoize context value
  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use Notification Context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
