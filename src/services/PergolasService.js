import apiClient from "../plugins/axios";

export default {
  create(projectId) {
    return apiClient.post(`/pergolas`, { name: "New Pergola...", projectId });
  },
  get(id) {
    return apiClient.get(`/pergolas/${id}`);
  },
  update(id, data) {
    return apiClient.put(`/pergolas/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/pergolas/${id}`);
  },
};
