import apiClient from "../plugins/axios";

export default {
  create(projectId) {
    return apiClient.post(`/walls`, { name: "New Wall...", projectId });
  },
  get(id) {
    return apiClient.get(`/walls/${id}`);
  },
  update(id, data) {
    return apiClient.put(`/walls/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/walls/${id}`);
  },
};
