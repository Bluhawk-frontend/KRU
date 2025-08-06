// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g., http://127.0.0.1:8000

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor to add access token to requests
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('access_token');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor to handle 401 errors and refresh token
// api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if error is 401 and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Mark as retried
//       const refreshToken = localStorage.getItem('refresh_token');

//       if (refreshToken) {
//         try {
//           // Call RefreshTokenView API
//           const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
//             refresh: refreshToken,
//           });

//           const newAccessToken = response.data.access;
//           localStorage.setItem('access_token', newAccessToken); // Update access token

//           // Update the original request with the new access token
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest); // Retry the original request
//         } catch (refreshError) {
//           console.error('Refresh Token Error:', refreshError.response?.data, refreshError.message);
//           // Clear tokens and redirect to login if refresh fails
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       } else {
//         // No refresh token available, redirect to login
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;