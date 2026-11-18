import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiURL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;