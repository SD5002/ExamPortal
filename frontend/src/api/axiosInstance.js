import axios from "axios";


const baseURL = "https://gta-backend-a5ud.onrender.com";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, 
});

export default axiosInstance;
