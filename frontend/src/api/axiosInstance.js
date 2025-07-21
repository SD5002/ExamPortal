import axios from "axios";


const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, 
});

export default axiosInstance;
