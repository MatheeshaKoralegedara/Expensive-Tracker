import axios from "axios";

const getDefaultApiUrl = () => {
    if (typeof window === "undefined") {
        return "http://localhost:8080/api";
    }

    const { protocol, hostname } = window.location;

    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
        return `${protocol}//${hostname}:8080/api`;
    }

    return "http://localhost:8080/api";
};

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || getDefaultApiUrl()
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.assign("/");
        }

        return Promise.reject(error);
    }
);

export default api;
