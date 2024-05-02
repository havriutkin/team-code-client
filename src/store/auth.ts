import { create } from "zustand";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface Principal {
    id: number;
    email: string;
}

interface AuthState {
    principal: Principal | null;
    token: string;
    isLoading: boolean;
    error: string;
}

interface AuthActions {
    fetchPrincipal: () => Promise<Principal | null>;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    token: localStorage.getItem("token") || "",
    principal: null,
    isLoading: false,
    error: "",

    fetchPrincipal: async () => {
        const token = get().token;
        if (!token) {
            return null;
        }
        
        if (get().principal) {
            return get().principal
        }
        
        const response = await axios.get(`${ENDPOINT}/auth/user`, {
            headers: {
                Authorization: `Bearer ${get().token}`
            }
        });

        if (response.status === 200) {
            const principal = {id: response.data.userId, ...response.data} as Principal;
            set({ principal })
            return principal;
        } else {
            return null;
        }
    },

    register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${ENDPOINT}/auth/register`, { name: username, email, password });
            if (response.status === 200) {
                const token = response.data.token;
                set({ token });
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
                set({ token });
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
        set({ principal: null, token: "", error: "" });
        localStorage.removeItem("token");
    },
}));

export default useAuthStore;
