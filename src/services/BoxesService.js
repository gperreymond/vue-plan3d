import apiClient from "../plugins/axios";

export default {
  create(projectId) {
    return apiClient.post(`/boxes`, { name: "New Box...", projectId });
  },
  get(id) {
    return apiClient.get(`/boxes/${id}`);
  },
  update(id, data) {
    return apiClient.put(`/boxes/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/boxes/${id}`);
  },
};
