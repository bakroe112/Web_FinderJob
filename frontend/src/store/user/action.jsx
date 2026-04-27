import { axiosClient } from '../../config/AxiosClient';
import * as types from './action_type';

// Login Action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_LOGIN_REQUEST });

    const response = await axiosClient.post('/auth/login', { email, password });

    if (response.data.success) {
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      dispatch({
        type: types.USER_LOGIN_SUCCESS,
        payload: userData,
      });

      return { success: true, data: userData };
    } else {
      dispatch({
        type: types.USER_LOGIN_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message, is_blocked: response.data.is_blocked || false };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Đăng nhập thất bại';
    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Register Action
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_REGISTER_REQUEST });

    const response = await axiosClient.post('/auth/register', userData);

    if (response.data.success) {
      dispatch({
        type: types.USER_REGISTER_SUCCESS,
        payload: response.data.message,
      });
      return { success: true, message: response.data.message };
    } else {
      dispatch({
        type: types.USER_REGISTER_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Đăng ký thất bại';
    dispatch({
      type: types.USER_REGISTER_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch({ type: types.USER_LOGOUT });
};

// Get User Profile Action
export const getUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_GET_PROFILE_REQUEST });

    const response = await axiosClient.post('/users/get', { user_id: userId });

    if (response.data.success) {
      dispatch({
        type: types.USER_GET_PROFILE_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.USER_GET_PROFILE_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy thông tin thất bại';
    dispatch({
      type: types.USER_GET_PROFILE_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Update Avatar Action
export const updateAvatar = (userId, avatarUrl) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_UPDATE_AVATAR_REQUEST });

    const response = await axiosClient.post('/users/avatar', {
      user_id: userId,
      avatar_url: avatarUrl,
    });

    if (response.data.success) {
      dispatch({
        type: types.USER_UPDATE_AVATAR_SUCCESS,
        payload: avatarUrl,
      });
      return { success: true };
    } else {
      dispatch({
        type: types.USER_UPDATE_AVATAR_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Cập nhật avatar thất bại';
    dispatch({
      type: types.USER_UPDATE_AVATAR_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Change Password Action
export const changePassword = (userId, oldPassword, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_CHANGE_PASSWORD_REQUEST });

    const response = await axiosClient.post("/users/change-password", {
      user_id: userId,
      current_password: oldPassword,
      new_password: newPassword,
    });

    if (response.data.success) {
      dispatch({
        type: types.USER_CHANGE_PASSWORD_SUCCESS,
        payload: response.data.message,
      });
      return { success: true, message: response.data.message };
    } else {
      dispatch({
        type: types.USER_CHANGE_PASSWORD_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
    dispatch({
      type: types.USER_CHANGE_PASSWORD_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Clear Error Action
export const clearUserError = () => ({
  type: types.CLEAR_USER_ERROR,
});

// Clear Message Action
export const clearUserMessage = () => ({
  type: types.CLEAR_USER_MESSAGE,
});
