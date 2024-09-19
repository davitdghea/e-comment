import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
});

instance.interceptors.request.use(
  function (config) {
    let localStorageData = window.localStorage.getItem('persist:shop/user');
    if (localStorageData) {
      localStorageData = JSON.parse(localStorageData);
      const accessToken = JSON.parse(localStorageData?.token || 'null');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error.response?.data);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error.response?.data || error.message);
  }
);

export default instance;
