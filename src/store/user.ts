import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./auth";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface User {
    id: number;
    name: string;
    email: string;
    experience: string;
    bio: string;
    gitHubLink: string;
    skills: string[];
}

interface UserState {
    user: User;
    isLoading: boolean;
    isError: boolean;
}

interface UserActions {
    loadUser: (email: string) => Promise<void>;
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
    }
}));

export default useUserStore;