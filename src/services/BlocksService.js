import apiClient from "../plugins/axios";

export default {
  create() {
    return apiClient.post(`/blocks`);
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
