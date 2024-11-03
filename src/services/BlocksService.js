import apiClient from "../plugins/axios";

export default {
  create(projectId) {
    return apiClient.post(`/blocks`, { name: "New Block...", projectId });
  },
  get(id) {
    return apiClient.get(`/blocks/${id}`);
  },
  update(id, data) {
    return apiClient.put(`/blocks/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/blocks/${id}`);
  },
};
