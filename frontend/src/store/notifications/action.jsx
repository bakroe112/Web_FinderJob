import { axiosClient } from '../../config/AxiosClient';
import * as types from './action_type';

// Fetch Notifications
export const fetchNotifications = (userId) => async (dispatch) => {
  try {
    dispatch({ type: types.NOTIFICATION_FETCH_REQUEST });

    const response = await axiosClient.post('/notifications/list', {
      user_id: userId,
    });

    if (response.data.success) {
      dispatch({
        type: types.NOTIFICATION_FETCH_SUCCESS,
        payload: response.data.data || [],
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.NOTIFICATION_FETCH_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lỗi tải thông báo';
    dispatch({
      type: types.NOTIFICATION_FETCH_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Mark Notification as Read
export const markNotificationAsRead = (userId, notificationId) => async (dispatch) => {
  try {
    dispatch({ type: types.NOTIFICATION_MARK_READ_REQUEST });

    const response = await axiosClient.post('/notifications/mark-read', {
      user_id: userId,
      notification_id: notificationId,
    });

    if (response.data.success) {
      dispatch({
        type: types.NOTIFICATION_MARK_READ_SUCCESS,
        payload: notificationId,
      });
      return { success: true };
    } else {
      dispatch({
        type: types.NOTIFICATION_MARK_READ_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lỗi đánh dấu đã đọc';
    dispatch({
      type: types.NOTIFICATION_MARK_READ_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Delete Notification
export const deleteNotification = (userId, notificationId) => async (dispatch) => {
  try {
    dispatch({ type: types.NOTIFICATION_DELETE_REQUEST });

    const response = await axiosClient.post('/notifications/delete', {
      user_id: userId,
      notification_id: notificationId,
    });

    if (response.data.success) {
      dispatch({
        type: types.NOTIFICATION_DELETE_SUCCESS,
        payload: notificationId,
      });
      return { success: true };
    } else {
      dispatch({
        type: types.NOTIFICATION_DELETE_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lỗi xóa thông báo';
    dispatch({
      type: types.NOTIFICATION_DELETE_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Set Local Notifications (for UI state)
export const setLocalNotifications = (notifications) => (dispatch) => {
  dispatch({
    type: types.NOTIFICATION_SET_LOCAL,
    payload: notifications,
  });
};
