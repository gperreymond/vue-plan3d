import apiClient from "../plugins/axios";

export default {
  get(id) {
    return apiClient.get(`/grounds/${id}`);
  },
  update(id, data) {
    return apiClient.put(`/grounds/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/grounds/${id}`);
  },
};
