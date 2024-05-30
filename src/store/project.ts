import { create } from "zustand";
import { persist } from "zustand/middleware";
import Project from "../model/Project";
import useAuthStore from "./auth";
import axios from "axios";
import ProjectFilter from "../model/ProjectFilter";
import qs from "qs";

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
    loadProjectsByUserId: (userId: number) => Promise<void>;
    loadProjectsByMemberId: (memberId: number) => Promise<void>;
    loadProjectsByOwnerId: (ownerOd: number) => Promise<void>;
    loadProjectsByFilter: (projectFilter: ProjectFilter) => Promise<void>
    updateProject: (data: Project) => Promise<void>; 
    addSkills: (skillIds: number[]) => Promise<void>;
    removeSkills: (skillIds: number[]) => Promise<void>;
    removeParticipants: (userId: number[]) => Promise<void>;
    removeParticipant: (userId: number) => Promise<void>;
    createProject: (project: Project) => Promise<void>;
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
    try {
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
    } catch (error) {
        console.log(`Error loading projects by member id: ${error}`)
        return []
    }
}

const fetchProjectsByOwnerId = async (ownerId: number): Promise<Project[]> => {
    const token = useAuthStore.getState().token;

    try {
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
    } catch (error) {
        console.log(`Error loading projects by owner id: ${error}`)
        return [];
    }
}

const fetchProjectsByUserId = async (userId: number): Promise<Project[]> => {
    // Fetch projects where the user is either the owner or a member
    const projectsByMember = await fetchProjectsByMemberId(userId);
    const projectsByOwner = await fetchProjectsByOwnerId(userId);
    
    return [...projectsByOwner, ...projectsByMember];
}

const fetchProjectsByFilter = async (projectFilter: ProjectFilter): Promise<Project[]> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ENDPOINT}/project/filter`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: projectFilter,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        }
    });

    if (response.status === 200) {
        return response.data as Project[];
    } else {
        throw new Error("Error fetching projects by filter");
    }
}

const isMember = async (projectId: number, userId: number): Promise<boolean> => {
    const projects = await fetchProjectsByMemberId(userId);
    const projectIds = projects.map(p => p.id);
    return projectIds.includes(projectId);
}

const deleteParticipant = async (projectId: number, userId: number): Promise<void> => {
    const token = useAuthStore.getState().token;
    const response = await axios.delete(`${ENDPOINT}/project/${projectId}/participant/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Error deleting participant");
    }
}

const deleteParticipants = async (projectId: number, userIds: number[]): Promise<void> => {
    const token = useAuthStore.getState().token;
    const response = await axios.delete(`${ENDPOINT}/project/${projectId}/participants`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: userIds
    });

    if (response.status !== 200) {
        throw new Error("Error deleting participants");
    }

}

const postSkills = async (projectId: number, skillIds: number[]): Promise<void> => {
    const token = useAuthStore.getState().token;
    const response = await axios.post(`${ENDPOINT}/project/${projectId}/skills`, skillIds, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Error adding skills");
    }
}

const deleteSkills = async (projectId: number, skillIds: number[]): Promise<void> => {
    const token = useAuthStore.getState().token;
    const response = await axios.delete(`${ENDPOINT}/project/${projectId}/skills`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: skillIds
    });

    if (response.status !== 200) {
        throw new Error("Error deleting skills");
    }
}

const putProject = async (data: Project): Promise<void> => {
    const token = useAuthStore.getState().token;
    const response = await axios.put(`${ENDPOINT}/project/${data.id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw new Error("Error updating project");
    }
}

const createProject = async (data: Project): Promise<Project> => {
    const token = useAuthStore.getState().token;
    const response = await axios.post(`${ENDPOINT}/project`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 201) {
        return response.data as Project;
    } else {
        throw new Error("Error creating project");
    }
}

/*
TODO: Move isOwner and isMember functionality to useEffect inside components
*/

const useProjectStore = create<ProjectState & ProjectActions>()(
    persist(
        (set) => ({
            projects: [] as Project[],
            project: null,
            isLoading: false,
            isError: false,
            isOwner: false,
            isMember: false,

            loadProject: async (id: number) => {
                console.log("Loading project:", id);
                set({ project: null, isError: false, isLoading: true, isOwner: false })
                
                if (!id) {
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
            },

            loadProjectsByFilter: async (projectFilter: ProjectFilter) => {
                set({ projects: [], isLoading: true, isError: false });

                try {
                    const data = await fetchProjectsByFilter(projectFilter);
                    set({ projects: data, isLoading: false, isError: false });
                } catch (error) {
                    set({ projects: [], isLoading: false, isError: false });
                    console.error("Error loading projects by filter:", error);
                }

                console.log(`Projects: ${useProjectStore.getState().projects}`)
            },
            
            removeParticipant: async (userId: number) => {
                set({ isError: false, isLoading: true });

                const projectId = useProjectStore.getState().project?.id;
                if (!projectId) {
                    set({ isError: true, isLoading: false });
                    return;
                }

                try {
                    await deleteParticipant(projectId, userId);
                    set({ isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error removing participant:", error);
                }
            },

            removeParticipants: async (userIds: number[]) => {
                set({ isError: false, isLoading: true });

                const projectId = useProjectStore.getState().project?.id;
                if (!projectId) {
                    set({ isError: true, isLoading: false });
                    return;
                }

                try {
                    await deleteParticipants(projectId, userIds);
                    set({ isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error removing participants:", error);
                }
            },

            updateProject: async (data: Project) => {
                set({ isError: false, isLoading: true });

                try {
                    await putProject(data);
                    set({ isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error updating project:", error);
                }
            },

            addSkills: async (skillIds: number[]) => {
                set({ isError: false, isLoading: true });

                const projectId = useProjectStore.getState().project?.id;
                if (!projectId) {
                    set({ isError: true, isLoading: false });
                    return;
                }

                try {
                    await postSkills(projectId, skillIds);
                    set({ isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error adding skills:", error);
                }
            },

            removeSkills: async (skillIds: number[]) => {
                set({ isError: false, isLoading: true });

                const projectId = useProjectStore.getState().project?.id;
                if (!projectId) {
                    set({ isError: true, isLoading: false });
                    return;
                }

                try {
                    await deleteSkills(projectId, skillIds);
                    set({ isLoading: false });
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error removing skills:", error);
                }
            },

            createProject: async (project: Project) => {
                set({ isError: false, isLoading: true });

                if (!project) {
                    set({ isError: true, isLoading: false });
                    return;
                }

                try {
                    const newProject = await createProject(project);
                    set((state) => ({ 
                        project: newProject, 
                        projects: [ ...state.projects, newProject ], 
                        isLoading: false 
                    }));
                } catch (error) {
                    set({ isError: true, isLoading: false });
                    console.error("Error creating project");
                }
            }
        }),
        {
            name: 'project-store', 
            getStorage: () => localStorage,
            partialize: (state) => ({ project: state.project, projects: state.projects, isOwner: state.isOwner, isMember: state.isMember }),
        } 
    )
);

export default useProjectStore;