import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

const API_URL = "http://localhost:8000/api";

export const fetchConsultations = async () => {
    const response = await fetch(`${API_URL}/consultations/`, { headers: authHeaders() });
    return response.json();
};

export const fetchConsultationDetails = async (consultationId) => {
    const response = await fetch(`${API_URL}/consultations/${consultationId}/`, { headers: authHeaders() });
    return response.json();
};

export const updateConsultation = async (consultationId, data) => {
    const response = await fetch(`${API_URL}/consultations/${consultationId}/`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});


export default api