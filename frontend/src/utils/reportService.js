import apiClient from "./apiClient";

export const getLocationHdSummary = (params) => {
  return apiClient.get("/reports/location-hd-summary", { params });
};
