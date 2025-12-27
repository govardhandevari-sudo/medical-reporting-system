
import axios from 'axios';
import { message } from 'antd';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //'http://localhost:5000/api',
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message || 'Unexpected server error';

    switch (status) {
      case 400:
        message.error('Bad Request: ' + serverMessage);
        break;
      case 401:
        message.warning('Unauthorized access. Please log in again.');
        break;
      case 404:
        message.warning('API endpoint not found.');
        break;
      case 500:
        message.error('Internal Server Error: ' + serverMessage);
        break;
      default:
        message.error('Network Error: ' + (error.message || 'Please try again.'));
    }

    console.error('[API ERROR]', error);
    return Promise.reject(error);
  }
);

export default apiClient;
