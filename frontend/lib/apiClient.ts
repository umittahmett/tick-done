import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: any) => void)[] = [];

function onRefreshed() {
  refreshSubscribers.forEach(callback => callback(null));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: any) => void) {
  refreshSubscribers.push(callback);
}

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthError = (status === 401 || status === 403);

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axiosClient.post('/auth/refresh-token');
          isRefreshing = false;
          onRefreshed();
          return axiosClient(originalRequest);

        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(refreshError);
        }
      }
      
      return new Promise((resolve, reject) => {
        addRefreshSubscriber(() => {
          axiosClient(originalRequest)
            .then(resolve)
            .catch(reject);
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;