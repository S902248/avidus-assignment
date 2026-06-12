import axiosInstance from './axiosInstance';

export const getUsersApi = () => axiosInstance.get('/admin/users');
export const createUserApi = (data) => axiosInstance.post('/admin/users', data);
export const deleteUserApi = (id) => axiosInstance.delete(`/admin/users/${id}`);
export const updateUserStatusApi = (id, status) => axiosInstance.patch(`/admin/users/${id}/status`, { status });
export const updateUserPasswordApi = (id, password) => axiosInstance.patch(`/admin/users/${id}/password`, { password });

export const getAllTasksApi = () => axiosInstance.get('/admin/tasks');
export const deleteAnyTaskApi = (id) => axiosInstance.delete(`/admin/tasks/${id}`);

export const getActivityLogsApi = () => axiosInstance.get('/admin/activity-logs');
export const getAnalyticsApi = () => axiosInstance.get('/admin/analytics');
