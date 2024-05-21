import { create } from "zustand";
import Project from "../model/Project";
import useAuthStore from "./auth";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface ProjectState{
    projects: Project[];
    project: Project | null;
    isLoading: boolean;
    isError: boolean;
    isOwner: boolean;
    isMember: boolean;
}

interface ProjectActions {
    loadProject: (id: number) => Promise<void>;
    loadProjectsByUserId: (userId: number) => Promise<void>
    loadProjectsByMemberId: (memberId: number) => Promise<void>
    loadProjectsByOwnerId: (ownerOd: number) => Promise<void>
    //loadProjectsByFilter: (projectFilter: ProjectFilter) => Promise<void>
    //updateProject: (data: Project) => Promise<void>; 
    //addSkills: (skillIds: number[]) => Promise<void>;
    //removeSkills: (skillIds: number[]) => Promise<void>;
    //addParticipant: (userId: number) => Promise<void>;
    //removeParticipant: (userId: number) => Promise<void>;
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

const fetchProjectsByMemberId = async (memberId: number): Promise<Project[]> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/project/member/${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        return response.data as Project[];
    } else {
        return [];
    }
}

const fetchProjectsByOwnerId = async (ownerId: number): Promise<Project[]> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/project/owner/${ownerId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        return response.data as Project[];
    } else {
        return [];
    }
}

const fetchProjectsByUserId = async (userId: number): Promise<Project[]> => {
    // Fetch projects where the user is either the owner or a member
    const projectsByMember = await fetchProjectsByMemberId(userId);
    const projectsByOwner = await fetchProjectsByOwnerId(userId);

    const uniqueProjects = projectsByMember.filter(p => !projectsByOwner.map(p => p.id).includes(p.id));
    
    return [...projectsByOwner, ...uniqueProjects];
}

const isMember = async (projectId: number, userId: number): Promise<boolean> => {
    const projects = await fetchProjectsByMemberId(userId);
    const projectIds = projects.map(p => p.id);
    return projectIds.includes(projectId);
}

const useProjectStore = create<ProjectState & ProjectActions>((set) => ({
    projects: [] as Project[],
    project: null,
    isLoading: false,
    isError: false,
    isOwner: false,
    isMember: false,

    loadProject: async (id: number) => {
        set({ project: null, isError: false, isLoading: true, isOwner: false })
        
        if (!id) {
            set({ isError: true, isLoading: false, isOwner: false});
            return;
        }

        try {
            const principalId = useAuthStore.getState().principal?.id;
            const data = await fetchProject(id);

            let member = false;
            if (principalId) {
                member = await isMember(id, principalId);
            }

            set({
                project: data,
                isLoading: false,
                isError: false,
                isOwner:  principalId === data.owner.id,
                isMember: member
            });
        } catch (error) {
            set({ isError: true, isLoading: false, isOwner: false });
            console.error("Error loading project:", error);
        }
    },

    loadProjectsByUserId: async (userId: number) => {
        set({ projects: [], isLoading: true, isError: false });

        if (!userId) {
            set({ projects: [], isLoading: false, isError: true });
            return;
        }

        try {
            const data = await fetchProjectsByUserId(userId);
            set({ projects: data, isLoading: false, isError: false });
        } catch (error) {
            set({ projects: [], isLoading: false, isError: true });
            console.error("Error loading projects:", error);
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
        } else {
            set({projects: []})
        }
    },

    loadProjectsByMemberId: async (memberId: number) => {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${ENDPOINT}/project/member/${memberId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        if (response.status === 200) {
            set({projects: response.data});
        } else {
            set({projects: []})
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