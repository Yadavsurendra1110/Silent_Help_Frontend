// services/api.js
// Axios instance that automatically attaches the Firebase ID token to every request
import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
});

// Attach Bearer token before each request
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        // const token = await user.getIdToken();
const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 — force logout on token expiry / invalid session
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            await auth.signOut();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;
