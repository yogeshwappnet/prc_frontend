import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useNotification from './hooks/useNotification';

const api = axios.create({
  baseURL: 'http://projects.wappnet.us:3001/',
});

const useNavigationInterceptor = () => {
  const navigate = useNavigate();
  const { showLoading } = useNotification();
 

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      showLoading(true);
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      showLoading(false);
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      showLoading(false);
      return response;
    },
    (error) => {
      showLoading(false);
      if (error.response.status === 401) {
        // Redirect to the login page
        localStorage.clear();
        setTimeout(() => {
          navigate('/');
        }, 500);
      }
      console.error('Response interceptor error:', error);
      return Promise.reject(error);
    }
  );
};

export { useNavigationInterceptor };
export default api;