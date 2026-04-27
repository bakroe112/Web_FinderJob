import * as types from './action_type';

const initialState = {
  // Candidate
  applications: [],
  appliedJobs: {},
  pagination: null,
  
  // Recruiter
  recruiterApplications: [],
  jobApplications: [],
  applicationDetail: null,
  recruiterPagination: null,
  
  // Common
  loading: false,
  error: null,
  message: null,
};

const applicationsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Apply Job
    case types.APPLICATION_APPLY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.APPLICATION_APPLY_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: [action.payload, ...state.applications],
        message: 'Ứng tuyển thành công',
        error: null,
      };
    case types.APPLICATION_APPLY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Applied Jobs List
    case types.APPLICATION_GET_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.APPLICATION_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: action.payload.applications,
        pagination: action.payload.pagination,
        error: null,
      };
    case types.APPLICATION_GET_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Check Applied
    case types.APPLICATION_CHECK_APPLIED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.APPLICATION_CHECK_APPLIED_SUCCESS:
      return {
        ...state,
        loading: false,
        appliedJobs: {
          ...state.appliedJobs,
          [action.payload.jobId]: action.payload.isApplied,
        },
        error: null,
      };
    case types.APPLICATION_CHECK_APPLIED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Cancel Application
    case types.APPLICATION_CANCEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.APPLICATION_CANCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: state.applications.filter(
          (app) => app.id !== action.payload
        ),
        message: 'Hủy ứng tuyển thành công',
        error: null,
      };
    case types.APPLICATION_CANCEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Get All Applications
    case types.RECRUITER_APPLICATION_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        recruiterApplications: action.payload.applications,
        recruiterPagination: action.payload.pagination,
        error: null,
      };
    case types.RECRUITER_APPLICATION_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Get Job Applications
    case types.RECRUITER_APPLICATION_JOB_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_APPLICATION_JOB_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        jobApplications: action.payload.applications,
        recruiterPagination: action.payload.pagination,
        error: null,
      };
    case types.RECRUITER_APPLICATION_JOB_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Get Application Detail
    case types.RECRUITER_APPLICATION_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_APPLICATION_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        applicationDetail: action.payload,
        error: null,
      };
    case types.RECRUITER_APPLICATION_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Update Status
    case types.RECRUITER_APPLICATION_UPDATE_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_APPLICATION_UPDATE_STATUS_SUCCESS: {
      const { applicationId, status } = action.payload;
      return {
        ...state,
        loading: false,
        recruiterApplications: state.recruiterApplications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        ),
        jobApplications: state.jobApplications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        ),
        applicationDetail: state.applicationDetail?.id === applicationId
          ? { ...state.applicationDetail, status }
          : state.applicationDetail,
        message: 'Cập nhật trạng thái thành công',
        error: null,
      };
    }
    case types.RECRUITER_APPLICATION_UPDATE_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Clear
    case types.CLEAR_APPLICATION_ERROR:
      return {
        ...state,
        error: null,
      };
    case types.CLEAR_APPLICATION_MESSAGE:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

export default applicationsReducer;
