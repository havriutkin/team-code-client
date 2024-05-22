import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios, { AxiosRequestConfig } from "axios";
import useAuthStore from "./auth";
import User from "../model/UserModel";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface UserState {
    user: User | null;
    users: User[];
    isOwner: boolean;
    isLoading: boolean;
    isError: boolean;
}

interface UserActions {
    loadUser: (email: string) => Promise<void>;
    updateUser: (data: User) => Promise<void>;
    addSkills: (skillIds: number[]) => Promise<void>;
    removeSkills: (skillIds: number[]) => Promise<void>;
}

type State = UserState & UserActions;

const fetchUser = async (email: string): Promise<User> => {
    const token = useAuthStore.getState().token;

    if (!token) {
        throw new Error("No token found");
    }

    const response = await axios.get(`${ENDPOINT}/user/email/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return response.data as User;
    } else {
        throw new Error("Error fetching user");
    }
};

const updateUser = async (data: User, token: string): Promise<User> => {
    const response = await axios.put(`${ENDPOINT}/user/${useAuthStore.getState().principal?.id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.status === 200) {
        return response.data as User;
    } else {
        throw new Error("Error updating user");
    }
};

const postSkills = async (userId: number, skillIds: number[], token: string): Promise<void> => {
    const response = await axios.post(`${ENDPOINT}/user/${userId}/skills`, skillIds, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status !== 200) {
        throw new Error("Error adding skill");
    }

    return;
};

const deleteSkills = async (userId: number, skillIds: number[], token: string): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: skillIds,
    };

    const response = await axios.delete(`${ENDPOINT}/user/${userId}/skills`, requestConfig);

    if (response.status !== 200) {
        throw new Error("Error removing skill");
    }

    return;
};

/*
TODO: Move isOwner and isMember functionality to useEffect inside components
*/

const useUserStore = create<State>()(
    persist(
        (set) => ({
            user: null,
            users: [] as User[],
            isOwner: false,
            isLoading: false,
            isError: false,

            loadUser: async (email: string) => {
                set({ user: null, isError: false, isLoading: true, isOwner: false });
                
                try {
                    const user = await fetchUser(email);
                    const principalId = useAuthStore.getState().principal?.id;
                    set({ user, isLoading: false, isOwner: user.id === principalId });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error fetching user:", error);
                }
            },

            updateUser: async (data: User) => {
                set({ isError: false, isLoading: true });

                const token = useAuthStore.getState().token;

                try {
                    const user = await updateUser(data, token);
                    set({ user, isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
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
                    await postSkills(userId, skillIds, token);
                    set({ isLoading: false });
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
                    await deleteSkills(userId, skillIds, token);
                    set({ isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error removing skill:", error);
                }
            },
        }),
        {
            name: 'user-store', 
            getStorage: () => localStorage,
        } 
    )
);

export default useUserStore;
