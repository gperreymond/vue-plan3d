import apiClient from "../plugins/axios";

export default {
  get(id) {
    return apiClient.get(`/walls/${id}`);
  },
  update(id, data) {
    console.log(data);
    return apiClient.put(`/walls/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/walls/${id}`);
  },
};
