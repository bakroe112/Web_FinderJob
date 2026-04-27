import * as types from './action_type';

// Lấy user từ localStorage nếu có
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  profile: null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  message: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login
    case types.USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case types.USER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    // Register
    case types.USER_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        error: null,
      };
    case types.USER_REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Logout
    case types.USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        profile: null,
        error: null,
        message: null,
      };

    // Get Profile
    case types.USER_GET_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.USER_GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };
    case types.USER_GET_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Avatar
    case types.USER_UPDATE_AVATAR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.USER_UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        loading: false,
        user: state.user ? { ...state.user, avatar_url: action.payload } : null,
        error: null,
      };
    case types.USER_UPDATE_AVATAR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Change Password
    case types.USER_CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.USER_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        error: null,
      };
    case types.USER_CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Clear Error & Message
    case types.CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
      };
    case types.CLEAR_USER_MESSAGE:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

export default userReducer;
