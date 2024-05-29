import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./auth";
import axios from "axios";
import Notification from "../model/Notification";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface NotificationState {
    notifications: Notification[];
    isLoading: boolean;
    isError: boolean;
}

interface NotificationActions {
    loadNotifications: () => Promise<void>;
    markAsViewed: (id: number) => Promise<void>;
    deleteNotification: (id: number) => Promise<void>;
}

const fetchNotifications = async (userId: number) => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/notification/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch notifications");
    }

    return response.data as Notification[];
};

const markViewed = async (notification: Notification) => {
    const token = useAuthStore.getState().token;

    notification.viewed = true;

    const response = await axios.put(`${ENDPOINT}/notification/${notification.id}`, notification, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Failed to mark notification as viewed");
    }

    //console.log(response.data);
    return response.data as Notification;
}

const deleteNotification = async (id: number) => {
    const token = useAuthStore.getState().token;

    const response = await axios.delete(`${ENDPOINT}/notification/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Failed to delete notification");
    }
}

const useNotificationStore = create<NotificationState & NotificationActions>()(
    persist(
        (set) => ({
            notifications: [] as Notification[],
            isLoading: false,
            isError: false,

            loadNotifications: async () => {
                set({ isLoading: true });

                try {
                    const principal = useAuthStore.getState().principal;

                    if (!principal) {
                        throw new Error("User not authenticated");
                    }

                    const notifications = await fetchNotifications(principal.id);
                    set({ notifications, isLoading: false });
                } catch (error) {
                    console.error(error);
                    set({ notifications: [], isError: false, isLoading: false });
                }
            },

            markAsViewed: async (id: number) => {
                try {
                    const notification = useNotificationStore.getState().notifications.find(n => n.id === id);
                    if (!notification) {
                        throw new Error("Notification not found");
                    }

                    await markViewed(notification);
                } catch (error) {
                    console.error(error);
                }
            },

            deleteNotification: async (id: number) => {
                try {
                    await deleteNotification(id);
                    useNotificationStore.setState({ notifications: useNotificationStore.getState().notifications.filter(n => n.id !== id) });
                } catch (error) {
                    console.error(error);
                }
            }
        }),
        {
            name: "notification-store",
            getStorage: () => localStorage,
            partialize(state) {
                return { notifications: state.notifications };
            }
        }
    )
);

/*

*/

export default useNotificationStore;