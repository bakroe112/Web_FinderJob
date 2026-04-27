import { axiosClient } from '../../config/AxiosClient';
import * as types from './action_type';

// ============== CANDIDATE ACTIONS ==============

// Apply Job
export const applyJob = (applicationData) => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_APPLY_REQUEST });

    const response = await axiosClient.post('/applications/apply', applicationData);

    if (response.data.success) {
      dispatch({
        type: types.APPLICATION_APPLY_SUCCESS,
        payload: response.data.data,
      });
      
      // Cập nhật appliedJobs để button thay đổi thành "Đã ứng tuyển"
      dispatch({
        type: types.APPLICATION_CHECK_APPLIED_SUCCESS,
        payload: {
          jobId: applicationData.job_id,
          isApplied: true,
        },
      });
      
      return { success: true, message: 'Ứng tuyển thành công' };
    } else {
      dispatch({
        type: types.APPLICATION_APPLY_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Ứng tuyển thất bại';
    dispatch({
      type: types.APPLICATION_APPLY_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Applied Jobs List (Candidate)
export const getAppliedJobs = (userId, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_GET_LIST_REQUEST });

    const response = await axiosClient.post('/applications/list', {
      user_id: userId,
      page,
      limit,
    });

    if (response.data.success) {
      dispatch({
        type: types.APPLICATION_GET_LIST_SUCCESS,
        payload: {
          applications: response.data.data,
          pagination: response.data.pagination,
        },
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.APPLICATION_GET_LIST_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy danh sách ứng tuyển thất bại';
    dispatch({
      type: types.APPLICATION_GET_LIST_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Check if Applied
export const checkApplied = (userId, jobId) => async (dispatch) => {
  try {
    console.log('🔍 Kiểm tra applied - userId:', userId, 'jobId:', jobId);
    dispatch({ type: types.APPLICATION_CHECK_APPLIED_REQUEST });

    const response = await axiosClient.post('/applications/check', {
      user_id: userId,
      job_id: jobId,
    });

    console.log('📨 Backend response:', response.data);

    if (response.data.success) {
      console.log('✅ checkApplied success - is_applied:', response.data.is_applied);
      dispatch({
        type: types.APPLICATION_CHECK_APPLIED_SUCCESS,
        payload: { jobId, isApplied: response.data.is_applied },
      });
      return { success: true, data: response.data };
    } else {
      console.log('❌ checkApplied failed:', response.data.message);
      dispatch({
        type: types.APPLICATION_CHECK_APPLIED_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log('❌ checkApplied error:', error.message);
    const message = error.response?.data?.message || 'Kiểm tra ứng tuyển thất bại';
    dispatch({
      type: types.APPLICATION_CHECK_APPLIED_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Cancel Application
export const cancelApplication = (applicationId, userId) => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_CANCEL_REQUEST });

    const response = await axiosClient.post('/applications/cancel', {
      application_id: applicationId,
      user_id: userId,
    });

    if (response.data.success) {
      dispatch({
        type: types.APPLICATION_CANCEL_SUCCESS,
        payload: applicationId,
      });
      return { success: true, message: 'Hủy ứng tuyển thành công' };
    } else {
      dispatch({
        type: types.APPLICATION_CANCEL_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Hủy ứng tuyển thất bại';
    dispatch({
      type: types.APPLICATION_CANCEL_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// ============== RECRUITER ACTIONS ==============

// Get All Applications (Recruiter)
export const getAllApplications = (recruiterId, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_APPLICATION_LIST_REQUEST });

    const response = await axiosClient.post('/recruiter/applications/list', {
      recruiter_id: recruiterId,
      page,
      limit,
    });

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_APPLICATION_LIST_SUCCESS,
        payload: {
          applications: response.data.data,
          pagination: response.data.pagination,
        },
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_APPLICATION_LIST_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy danh sách đơn ứng tuyển thất bại';
    dispatch({
      type: types.RECRUITER_APPLICATION_LIST_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Applications by Job (Recruiter)
export const getJobApplications = (jobId, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_APPLICATION_JOB_LIST_REQUEST });

    const response = await axiosClient.post('/recruiter/applications/job', {
      job_id: jobId,
      page,
      limit,
    });

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_APPLICATION_JOB_LIST_SUCCESS,
        payload: {
          applications: response.data.data,
          pagination: response.data.pagination,
        },
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_APPLICATION_JOB_LIST_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy danh sách ứng viên thất bại';
    dispatch({
      type: types.RECRUITER_APPLICATION_JOB_LIST_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Get Application Detail (Recruiter)
export const getApplicationDetail = (applicationId) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_APPLICATION_DETAIL_REQUEST });

    const response = await axiosClient.get(`/recruiter/applications/detail/${applicationId}`);

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_APPLICATION_DETAIL_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      dispatch({
        type: types.RECRUITER_APPLICATION_DETAIL_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Lấy chi tiết đơn ứng tuyển thất bại';
    dispatch({
      type: types.RECRUITER_APPLICATION_DETAIL_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Update Application Status (Recruiter)
export const updateApplicationStatus = (recruiterId, applicationId, status) => async (dispatch) => {
  try {
    dispatch({ type: types.RECRUITER_APPLICATION_UPDATE_STATUS_REQUEST });

    const response = await axiosClient.post('/recruiter/applications/update-status', {
      recruiter_id: recruiterId,
      application_id: applicationId,
      status,
    });

    console.log('Update status response:', response.data);

    if (response.data.success) {
      dispatch({
        type: types.RECRUITER_APPLICATION_UPDATE_STATUS_SUCCESS,
        payload: { applicationId, status },
      });
      return { success: true, message: 'Cập nhật trạng thái thành công' };
    } else {
      dispatch({
        type: types.RECRUITER_APPLICATION_UPDATE_STATUS_FAILURE,
        payload: response.data.message,
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log('Update status error:', error);
    const message = error.response?.data?.message || 'Cập nhật trạng thái thất bại';
    dispatch({
      type: types.RECRUITER_APPLICATION_UPDATE_STATUS_FAILURE,
      payload: message,
    });
    return { success: false, message };
  }
};

// Clear Actions
export const clearApplicationError = () => ({
  type: types.CLEAR_APPLICATION_ERROR,
});

export const clearApplicationMessage = () => ({
  type: types.CLEAR_APPLICATION_MESSAGE,
});
