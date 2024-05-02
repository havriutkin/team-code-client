import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./auth";

const { token } = useAuthStore.getState();
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
    if (!token) {
        return {} as User;
    }

    console.log("Fetching user");
    const response = await axios.get(`${ENDPOINT}/user/email/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        console.log(response.data);
        return response.data as User;
    } else {
        console.error(response.data);
        throw new Error("Error fetching user");
    }
}

const useUserStore = create<UserState & UserActions>((set) => ({
    user: {} as User,
    isLoading: false,
    isError: false,

    loadUser: async (email: string) => {
        set({ isLoading: true });

        if (!email || !token) {
            set({ isError: true });
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