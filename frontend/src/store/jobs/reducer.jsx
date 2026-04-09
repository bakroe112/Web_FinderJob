import * as types from './action_type';

const initialState = {
  // Candidate
  jobs: [],
  latestJobs: [],
  savedJobs: [],
  jobDetail: null,
  filterOptions: null,
  pagination: null,
  
  // Recruiter
  recruiterJobs: [],
  recruiterJobDetail: null,
  recruiterPagination: null,
  
  // Common
  loading: false,
  error: null,
  message: null,
};

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Search Jobs
    case types.JOBS_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.JOBS_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        jobs: action.payload.jobs,
        pagination: action.payload.pagination,
        error: null,
      };
    case types.JOBS_SEARCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Latest Jobs
    case types.JOBS_GET_LATEST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.JOBS_GET_LATEST_SUCCESS:
      return {
        ...state,
        loading: false,
        latestJobs: action.payload,
        error: null,
      };
    case types.JOBS_GET_LATEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Job Detail
    case types.JOBS_GET_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.JOBS_GET_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        jobDetail: action.payload,
        error: null,
      };
    case types.JOBS_GET_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Filter Options
    case types.JOBS_GET_FILTER_OPTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.JOBS_GET_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        filterOptions: action.payload,
        error: null,
      };
    case types.JOBS_GET_FILTER_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Saved Jobs
    case types.JOBS_GET_SAVED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.JOBS_GET_SAVED_SUCCESS:
      return {
        ...state,
        loading: false,
        savedJobs: action.payload,
        error: null,
      };
    case types.JOBS_GET_SAVED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Toggle Saved Job
    case types.JOBS_TOGGLE_SAVED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.JOBS_TOGGLE_SAVED_SUCCESS: {
      const { jobId, isSaved } = action.payload;
      return {
        ...state,
        loading: false,
        savedJobs: isSaved
          ? state.savedJobs
          : state.savedJobs.filter((job) => job.id !== jobId),
        error: null,
      };
    }
    case types.JOBS_TOGGLE_SAVED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Jobs List
    case types.RECRUITER_JOBS_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_JOBS_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        recruiterJobs: action.payload.jobs,
        recruiterPagination: action.payload.pagination,
        error: null,
      };
    case types.RECRUITER_JOBS_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Job Detail
    case types.RECRUITER_JOB_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_JOB_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        recruiterJobDetail: action.payload,
        error: null,
      };
    case types.RECRUITER_JOB_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Create Job
    case types.RECRUITER_JOB_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_JOB_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        recruiterJobs: [action.payload, ...state.recruiterJobs],
        message: 'Tạo việc làm thành công',
        error: null,
      };
    case types.RECRUITER_JOB_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Update Job
    case types.RECRUITER_JOB_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_JOB_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        recruiterJobs: state.recruiterJobs.map((job) =>
          job.id === action.payload.id ? action.payload : job
        ),
        recruiterJobDetail: action.payload,
        message: 'Cập nhật việc làm thành công',
        error: null,
      };
    case types.RECRUITER_JOB_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Recruiter - Delete Job
    case types.RECRUITER_JOB_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.RECRUITER_JOB_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        recruiterJobs: state.recruiterJobs.filter((job) => job.id !== action.payload),
        message: 'Xóa việc làm thành công',
        error: null,
      };
    case types.RECRUITER_JOB_DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Clear
    case types.CLEAR_JOB_DETAIL:
      return {
        ...state,
        jobDetail: null,
        recruiterJobDetail: null,
      };
    case types.CLEAR_JOBS_ERROR:
      return {
        ...state,
        error: null,
      };
    case types.CLEAR_JOBS_MESSAGE:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

export default jobsReducer;
