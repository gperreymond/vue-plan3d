import apiClient from "../plugins/axios";

export default {
  get(id) {
    return apiClient.get(`/projects/${id}?populate=walls`);
  },
};