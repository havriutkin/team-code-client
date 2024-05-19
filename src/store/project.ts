import { create } from "zustand";
import Project from "../model/Project";
import useAuthStore from "./auth";
import axios from "axios";
import ProjectFilter from "../model/ProjectFilter";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface ProjectState{
    projects: Project[];
    isLoading: boolean;
    isError: boolean;
}

interface ProjectActions {
    loadProject: (id: number) => Promise<void>;
    loadProjectsByUserId: (userId: number) => Promise<Project[]>
    loadProjectsByOwnerId: (ownerOd: number) => Promise<Project[]>
    loadProjectsByFilter: (projectFilter: ProjectFilter) => Promise<Project[]>
    //updateProjec: (data: Project) => Promise<void>; 
    //addSkills: (skillIds: number[]) => Promise<void>;
    //removeSkills: (skillIds: number[]) => Promise<void>;
}

const fetchProject = async (id: number): Promise<Project> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/project/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        return response.data as Project;
    } else {
        throw new Error("Error fetching project");
    }
}

const updateProject = async (id: number, data: Project, token: string): Promise<Project> => {
    const response = await axios.put(`${ENDPOINT}/project/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 200) {
        return response.data as Project;
    } else {
        throw new Error("Error updating project");
    }
};


const useProjectStore = create<ProjectState & ProjectActions>((set) => ({
    projects: [] as Project[],
    isLoading: false,
    isError: false,

    loadProject: async (id: number) => {
        set({ isError: false, isLoading: true })
        
        if (!id) {
            set({ isError: true, isLoading: false});
            return;
        }


        fetchProject(id).then((data) => {
            set({
                projects: [data],
                isLoading: false,
                isError: false,
            });
        }).catch(() => {
            set({ isError: true, isLoading: false });
        });
    },

    loadProjectsByUserId: async (userId: number) => {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${ENDPOINT}/project/member/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        if (response.status === 200) { 
            set({projects: response.data});
            return response.data as Project[];
        } else {
            set({projects: []})
            return [];
        }
    },

    loadProjectsByOwnerId: async (ownerId: number) => {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${ENDPOINT}/project/owner/${ownerId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        if (response.status === 200) {
            set({projects: response.data});
            return response.data as Project[];
        } else {
            set({projects: []})
            return [];
        }
    },

    loadProjectsByFilter: async (projectFilter: ProjectFilter) => {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${ENDPOINT}/project/filter${projectFilter}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    
        if (response.status === 200) {
            set({projects: response.data});
            return response.data as Project[];
        } else {
            set({projects: []})
            return [];
        }
    }

    // updateProject: async (data: Project) => {
    //     set({ isError: false, isLoading: true });
    
    //     const token = useAuthStore.getState().token;

    //     try {
    //         updateProject(data.id, data, token).then((project) => {
    //             set({ project, isLoading: false });
    //         });
    //     } catch (error) {
    //         set({ isError: true, isLoading: false});
    //         console.error("Error updating user:", error);
    //     }
    // }

}))

export default useProjectStore;