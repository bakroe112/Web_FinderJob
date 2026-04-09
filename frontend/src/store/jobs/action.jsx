import { axiosClient } from '../../config/AxiosClient';
import * as types from './action_type';

// ============== JOB FIELDS ==============

// Get All Job Fields
export const getJobFields = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/job-fields');
    
    if (response.data.success) {
      return { success: true, data: response.data.data || [] };
    } else {
      return { success: false, message: 'Lấy lĩnh vực thất bại' };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lỗi khi lấy lĩnh vực';
    return { success: false, message };
  }
};

// ============== CANDIDATE ACTIONS ==============

// Search Jobs
export const searchJobs = (filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.JOBS_SEARCH_REQUEST });

    const response = await axiosClient.post('/jobs/search', filters);

    if (response.data.success) {
      dispatch({
        type: types.JOBS_SEARCH_SUCCESS,
        payload: {
          jobs: response.data.data,
          pagination: response.data.pagination,
        },
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.JOBS_SEARCH_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Tìm kiếm việc làm thất bại';
    dispatch({
      type: types.JOBS_SEARCH_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Latest Jobs
export const getLatestJobs = (limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.JOBS_GET_LATEST_REQUEST });

    const response = await axiosClient.get(`/jobs/latest?limit=${limit}`);

    if (response.data.success) {
      dispatch({
        type: types.JOBS_GET_LATEST_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.JOBS_GET_LATEST_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy việc làm mới nhất thất bại';
    dispatch({
      type: types.JOBS_GET_LATEST_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Job Detail (Candidate)
export const getJobDetail = (jobId, userId) => async (dispatch) => {
  try {
    dispatch({ type: types.JOBS_GET_DETAIL_REQUEST });

    const url = userId 
      ? `/jobs/detail/${jobId}?user_id=${userId}`
      : `/jobs/detail/${jobId}`;
    
    const response = await axiosClient.get(url);

    if (response.data.success) {
      dispatch({
        type: types.JOBS_GET_DETAIL_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.JOBS_GET_DETAIL_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy chi tiết việc làm thất bại';
    dispatch({
      type: types.JOBS_GET_DETAIL_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Filter Options
export const getFilterOptions = () => async (dispatch) => {
  try {
    dispatch({ type: types.JOBS_GET_FILTER_OPTIONS_REQUEST });

    const response = await axiosClient.get('/jobs/filter-options');

    if (response.data.success) {
      dispatch({
        type: types.JOBS_GET_FILTER_OPTIONS_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.JOBS_GET_FILTER_OPTIONS_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy filter options thất bại';
    dispatch({
      type: types.JOBS_GET_FILTER_OPTIONS_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Saved Jobs
export const getSavedJobs = (userId) => async (dispatch) => {
  try {
    dispatch({ type: types.JOBS_GET_SAVED_REQUEST });

    const response = await axiosClient.post('/jobs/saved', { user_id: userId });

    if (response.data.success) {
      dispatch({
        type: types.JOBS_GET_SAVED_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.JOBS_GET_SAVED_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy việc làm đã lưu thất bại';
    dispatch({
      type: types.JOBS_GET_SAVED_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Toggle Saved Job
export const toggleSavedJob = (userId, jobId) => async (dispatch) => {
  try {
    dispatch({ type: types.JOBS_TOGGLE_SAVED_REQUEST });

    const response = await axiosClient.post('/jobs/toggle-saved', {
      user_id: userId,
      job_id: jobId,
    });

    if (response.data.success) {
      dispatch({
        type: types.JOBS_TOGGLE_SAVED_SUCCESS,
        payload: { jobId, isSaved: response.data.data.is_saved },
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.JOBS_TOGGLE_SAVED_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Toggle saved thất bại';
    dispatch({
      type: types.JOBS_TOGGLE_SAVED_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// ============== RECRUITER ACTIONS ==============

// Get Recruiter's Job List
export const getRecruiterJobs = (recruiterId, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_JOBS_LIST_REQUEST });

    const response = await axiosClient.post('/recruiter/jobs/list', {
      recruiter_id: recruiterId,
      page,
      limit,
    });

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_JOBS_LIST_SUCCESS,
        payload: {
          jobs: response.data.data,
          pagination: response.data.pagination,
        },
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_JOBS_LIST_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy danh sách việc làm thất bại';
    dispatch({
      type: types.RECRUITER_JOBS_LIST_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Recruiter's Job Detail
export const getRecruiterJobDetail = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_JOB_DETAIL_REQUEST });

    const response = await axiosClient.get(`/recruiter/jobs/detail/${jobId}`);

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_JOB_DETAIL_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_JOB_DETAIL_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy chi tiết việc làm thất bại';
    dispatch({
      type: types.RECRUITER_JOB_DETAIL_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Create Job
export const createJob = (jobData) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_JOB_CREATE_REQUEST });

    const response = await axiosClient.post('/recruiter/jobs/create', jobData);

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_JOB_CREATE_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_JOB_CREATE_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Tạo việc làm thất bại';
    dispatch({
      type: types.RECRUITER_JOB_CREATE_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Update Job
export const updateJob = (jobId, jobData) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_JOB_UPDATE_REQUEST });

    const response = await axiosClient.put(`/recruiter/jobs/update/${jobId}`, jobData);

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_JOB_UPDATE_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_JOB_UPDATE_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Cập nhật việc làm thất bại';
    dispatch({
      type: types.RECRUITER_JOB_UPDATE_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Delete Job
export const deleteJob = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_JOB_DELETE_REQUEST });

    const response = await axiosClient.delete(`/recruiter/jobs/delete/${jobId}`);

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_JOB_DELETE_SUCCESS,
        payload: jobId,
      });
      return { success: true };
    } else {
      dispatch({
        type: types.RECRUITER_JOB_DELETE_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Xóa việc làm thất bại';
    dispatch({
      type: types.RECRUITER_JOB_DELETE_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Clear Actions
export const clearJobDetail = () => ({
  type: types.CLEAR_JOB_DETAIL,
});

export const clearJobsError = () => ({
  type: types.CLEAR_JOBS_ERROR,
});

export const clearJobsMessage = () => ({
  type: types.CLEAR_JOBS_MESSAGE,
});
