import { create } from "zustand";
import { persist } from "zustand/middleware";
import Request from "../model/RequestModel";
import useAuthStore from "./auth";
import axios from "axios";
import useUserStore from "./user";
import User from "../model/UserModel";
import useProjectStore from "./project";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface RequestState{
    requests: Request[];
    user: User | null;
    isLoading: boolean;
    isError: boolean;
}

interface RequestActions{
    loadRequestsByProjectId: (projectId: number) => Promise<void>;
    approveRequest: (request: Request) => Promise<void>;
    rejectRequest: (Request: Request) => Promise<void>;
    sendJoinRequest: (projectId: number, userId: number) => Promise<void>;
}

const fetchReuests = async (projectId: number): Promise<Request[]> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/request/project/${projectId}`, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    if(response.status === 200){
        console.log(response.data);
        return response.data as Request[];
    } else {
        throw new Error("Error fetching project");
    }
}

const useRequestStore = create<RequestState & RequestActions>()(
    
    persist(
        (set) => ({
            requests: [] as Request[],
            isLoading: false,
            isError: false,
            user: useUserStore.getState().user,

            loadRequestsByProjectId: async (projectId) => {
                set({ requests: [], isLoading: true, isError: false })

                if(!projectId){
                    return;
                }

                try{
                    const data = await fetchReuests(projectId); 
                    set({ requests: data, isLoading: false, isError: false })
                } catch(error) {
                    set({ requests: [], isLoading: false, isError: true })
                }
            },
            //TODO: maybe instead of request user requestId 
            approveRequest: async (request: Request): Promise<void> => {
                set({ isLoading: true, isError: false})
                const token = useAuthStore.getState().token;
                request.status = "APPROVED";
                const response = await axios.put(`${ENDPOINT}/request/${request.id}`, request, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    set({ isLoading:false , isError: false})
                } else {
                    set({ isLoading:false , isError: true})
                }
            },

            rejectRequest: async (request: Request): Promise<void> => {
                set({ isLoading: true, isError: false})
                const token = useAuthStore.getState().token;
                request.status = "REJECTED";
                const response = await axios.put(`${ENDPOINT}/request/${request.id}`, request, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    set({ isLoading:false , isError: false})
                } else {
                    set({ isLoading:false , isError: true})
                }
            },

            sendJoinRequest: async (projectId: number, userId: number): Promise<void> => {
                set({ isLoading: true, isError: false})
                const token = useAuthStore.getState().token;
                const user = useUserStore.getState().user; // Get the current user from the user store
                const project = useProjectStore.getState().project;
                
                if (!user) {
                    set({ isLoading: false, isError: true });
                    throw new Error("User not found");
                }

                if (!project) {
                    set({ isLoading: false, isError: true });
                    throw new Error("Project not found");
                }

                const request: Request = {
                    id: 0,
                    status: "PENDING",
                    requestDate: new Date(),
                    message: "Interested in sustainable technologies and would love to get involved.",
                    user: user,
                    project: project
                };
                
                try {
                    const response = await axios.post(`${ENDPOINT}/request`, request, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        set((state) => ({ requests: [...state.requests, response.data], isLoading: false, isError: false }));
                    } else {
                        set({ isLoading: false, isError: true });
                    }
                } catch (error) {
                    set({ isLoading: false, isError: true });
                    throw new Error("Error sending join request");
                }
            }
        }),
        {
            name: "requst-store",
            getStorage: () => localStorage,
            partialize: (state) => ({ requests: state.requests, isLoading: state.isLoading, isError: state.isError })
        }
    )
);

export default useRequestStore;
