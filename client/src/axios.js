import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://social-media-api-portfolio-01-cozj.onrender.com/api/",
  withCredentials: true,
  headers: {
    authorization: localStorage.getItem('accessToken'),
  },
});