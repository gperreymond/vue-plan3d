import apiClient from "../plugins/axios";

export default {
  get(id) {
    return apiClient.get(
      `/projects/${id}?populate=grounds,walls,blocks,horizontalFences`,
    );
  },
  update(id, data) {
    return apiClient.put(`/projects/${id}`, data);
  },
};
