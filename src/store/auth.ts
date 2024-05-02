import { create } from "zustand";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface AuthState {
    email: string;
    token: string;
    isLoading: boolean;
    error: string;
}

interface AuthActions {
    setEmail: (email: string) => void;
    getToken: () => string;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    email: "",
    token: localStorage.getItem("token") || "",
    isLoading: false,
    error: "",

    setEmail: (email: string) => set({ email }),

    getToken: () => get().token,

    register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${ENDPOINT}/auth/register`, { name: username, email, password });
            if (response.status === 200) {
                const token = response.data.token;
                set({ email, token });
                localStorage.setItem("token", token);
            } else {
                set({ error: "Registration failed" });
            }
        } catch (error) {
            console.error(error);
            set({ error: "An error occurred during registration" });
        }
        set({ isLoading: false });
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${ENDPOINT}/auth/login`, { email, password });
            if (response.status === 200) {
                const token = response.data.token;
                set({ email, token });
                localStorage.setItem("token", token);
            } else {
                set({ error: "Login failed" });
            }
        } catch (error) {
            console.error(error);
            set({ error: "An error occurred during login" });
        }
        set({ isLoading: false });
    },

    logout: () => {
        set({ email: "", token: "", error: "" });
        localStorage.removeItem("token");
    },
}));

export default useAuthStore;
