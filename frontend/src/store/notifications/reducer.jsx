import * as types from './action_type';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NOTIFICATION_FETCH_REQUEST:
    case types.NOTIFICATION_MARK_READ_REQUEST:
    case types.NOTIFICATION_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.NOTIFICATION_FETCH_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        loading: false,
        error: null,
      };

    case types.NOTIFICATION_MARK_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, is_read: true } : notif
        ),
        loading: false,
        error: null,
      };

    case types.NOTIFICATION_DELETE_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
        loading: false,
        error: null,
      };

    case types.NOTIFICATION_SET_LOCAL:
      return {
        ...state,
        notifications: action.payload,
        loading: false,
        error: null,
      };

    case types.NOTIFICATION_FETCH_FAILURE:
    case types.NOTIFICATION_MARK_READ_FAILURE:
    case types.NOTIFICATION_DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notificationReducer;
