import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    isError: boolean;
}

interface AuthActions {
    fetchPrincipal: () => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            token: localStorage.getItem("token") || "",
            principal: null,
            isLoading: false,
            isError: false,

            fetchPrincipal: async () => {
                set({ principal: null, isLoading: true, isError: false });

                const token = get().token;
                if (!token) {
                    set({ isLoading: false, isError: true });
                }

                try {
                    const response = await axios.get(`${ENDPOINT}/auth/user`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        const principal = { id: response.data.userId, ...response.data } as Principal;
                        set({ principal, isLoading: false });
                    } else {
                        set({ isLoading: false, isError: true });
                    }
                } catch (error) {
                    console.error(error);
                    set({ isLoading: false, isError: true });
                }
            },

            register: async (username: string, email: string, password: string) => {
                localStorage.removeItem("token");
                set({ isLoading: true, isError: false });
                try {
                    const response = await axios.post(`${ENDPOINT}/auth/register`, { name: username, email, password });
                    if (response.status === 200) {
                        const token = response.data.token;
                        set({ token, isLoading: false });
                        localStorage.setItem("token", token);
                        get().fetchPrincipal();
                    } else {
                        set({ isLoading: false, isError: true });
                    }
                } catch (error) {
                    console.error(error);
                    set({ isLoading: false, isError: true });
                }
            },

            login: async (email: string, password: string) => {
                localStorage.removeItem("token");
                set({ isLoading: true, isError: false });
                try {
                    const response = await axios.post(`${ENDPOINT}/auth/login`, { email, password });
                    if (response.status === 200) {
                        const token = response.data.token;
                        set({ token, isLoading: false });
                        localStorage.setItem("token", token);
                        get().fetchPrincipal();
                    } else {
                        set({ isLoading: false, isError: true });
                        throw new Error("Login failed");
                    }
                } catch (error) {
                    console.error(error);
                    set({ isLoading: false, isError: true });
                    throw error;
                }
            },
            
            logout: () => {
                set({ principal: null, token: "", isLoading: false, isError: false });
                localStorage.removeItem("token");
            },
        }),
        {
            name: 'auth-store', 
            getStorage: () => localStorage, 
        } 
    )
);

export default useAuthStore;
