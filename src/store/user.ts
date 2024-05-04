import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./auth";
import User from "../model/UserModel";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface UserState {
    user: User;
    isLoading: boolean;
    isError: boolean;
}

interface UserActions {
    loadUser: (email: string) => Promise<void>;
    updateUser: (data: User) => Promise<void>; // Update the type here
    
}

const fetchUser = async (email: string): Promise<User> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/user/email/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        return response.data as User;
    } else {
        throw new Error("Error fetching user");
    }
}

const useUserStore = create<UserState & UserActions>((set) => ({
    user: {} as User,
    isLoading: false,
    isError: false,

    loadUser: async (email: string) => {
        set({ isError: false, isLoading: true });

        if (!email) {
            set({ isError: true, isLoading: false});
            return;
        }

        fetchUser(email).then((user) => {
            set({ user, isLoading: false });
        }).catch(() => {
            set({ isError: true, isLoading: false });
        });
    },

    updateUser: async (data: User) => {
        set({ isError: false, isLoading: true });
    
        const token = useAuthStore.getState().token;

        try {
            const response = await axios.put(`${ENDPOINT}/user/${useAuthStore.getState().principal?.id}`, data, { // Use data directly
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                fetchUser(response.data.email);
                set({ isLoading: false , user: response.data});
                
            } else {
                set({ isError: true, isLoading: false});
                throw new Error("Error updating user");
            }
        } catch (error) {
            set({ isError: true });
            console.error("Error updating user:", error);
            throw new Error("Error updating user");
        }
    }
    
}));

export default useUserStore;
