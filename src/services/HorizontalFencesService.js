import apiClient from "../plugins/axios";

export default {
  get(id) {
    return apiClient.get(`/horizontalFences/${id}`);
  },
  update(id, data) {
    return apiClient.put(`/horizontalFences/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/horizontalFences/${id}`);
  },
};
