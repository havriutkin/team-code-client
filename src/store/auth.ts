import { create } from "zustand";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface AuthState {
    email: string;
    token: string;
    isLoading: boolean;
}

interface AuthAction {
    setEmail: (email: string) => void;
    getToken: () => string;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const register = async (username: string, email: string, password: string): Promise<string> => {
    const user = {
        "name": username,
        "email": email,
        "password": password,
    }

    const response = await axios.post(`${ENDPOINT}/auth/register`, user);
    if (response.status === 200) {
        return response.data.token as string;
    }
    return "";
}

const login = async (email: string, password: string): Promise<string> => {
    const response = await axios.post(`${ENDPOINT}/auth/login`, { email, password });
    if (response.status === 200) {
        return response.data.token as string;
    }
    return "";
}

const useAuthStore = create<AuthState & AuthAction>((set, get) => ({
    email: "",
    token: "",
    isLoading: false,

    setEmail: (email: string) => set({ email }),

    getToken: () => {
        return get().token;
    },

    register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        const token = await register(username, email, password);
        if (token) {
            set({ email, token });
        }
        set({ isLoading: false });
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        const token = await login(email, password);
        if (token) {
            set({ email, token });
        }
        set({ isLoading: false });
    },

    logout: () => set({ email: "", token: "" }),
}));

export default useAuthStore;
