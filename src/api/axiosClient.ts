import axios from "axios";

const username = process.env.REACT_APP_ESPOCRM_USERNAME;
const password = process.env.REACT_APP_ESPOCRM_PASSWORD;
const token = btoa(`${username}:${password}`);

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_ESPOCRM_URL,
  headers: {
    "Espo-Authorization": token,
    "Content-Type": "application/json",
  },
});

export default axiosClient;