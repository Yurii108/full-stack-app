import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
});

instance.interceptors.request.use((confirm) => {
  confirm.headers.Authorization = window.localStorage.getItem("token");
  return confirm;
});

export default instance;
