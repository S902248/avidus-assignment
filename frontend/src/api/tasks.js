import axiosInstance from './axiosInstance';

export const createTaskApi = (data) => axiosInstance.post('/tasks', data);
export const getTasksApi = () => axiosInstance.get('/tasks');
export const updateTaskApi = (id, data) => axiosInstance.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => axiosInstance.delete(`/tasks/${id}`);
