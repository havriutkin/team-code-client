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
    updateUser: (data: User) => Promise<void>; 
    addSkills: (skillIds: number[]) => Promise<void>;
    removeSkills: (skillIds: number[]) => Promise<void>;
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

const updateUser = async (data: User, token: string): Promise<User> => {
    const response = await axios.put(`${ENDPOINT}/user/${useAuthStore.getState().principal?.id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 200) {
        return response.data as User;
    } else {
        throw new Error("Error updating user");
    }
};

const postSkills = async (userId: number, skillIds: number[], token: string): Promise<void> => {
    const response = await axios.post(`${ENDPOINT}/user/${userId}/skills`, {
        skillIds
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Error adding skill");
    }

    return;
};

const deleteSkills = async (userId: number, skillIds: number[], token: string): Promise<void> => {
    const response = await axios.delete(`${ENDPOINT}/user/${userId}/skills}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            skillIds
        }
    });

    if (response.status !== 200) {
        throw new Error("Error removing skill");
    }

    return;
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
            updateUser(data, token).then((user) => {
                set({ user, isLoading: false });
            });
        } catch (error) {
            set({ isError: true, isLoading: false});
            console.error("Error updating user:", error);
        }
    },
    
    addSkills: async (skillIds: number[]) => {
        set({ isError: false, isLoading: true });

        const token = useAuthStore.getState().token;
        const userId = useAuthStore.getState().principal?.id;

        if (!userId) {
            set({ isError: true, isLoading: false });
            return;
        }

        try {
            postSkills(userId, skillIds, token);
        } catch (error) {
            set({ isError: true, isLoading: false });
            console.error("Error adding skill:", error);
        }
    },

    removeSkills: async (skillIds: number[]) => {
        set({ isError: false, isLoading: true });

        const token = useAuthStore.getState().token;
        const userId = useAuthStore.getState().principal?.id;

        if (!userId) {
            set({ isError: true, isLoading: false });
            return;
        }

        try {
            deleteSkills(userId, skillIds, token);
        } catch (error) {
            set({ isError: true, isLoading: false });
            console.error("Error removing skill:", error);
        }
    }
}));

export default useUserStore;
