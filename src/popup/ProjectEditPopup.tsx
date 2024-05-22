import { AnimatePresence, motion } from "framer-motion";
import useProjectStore from "../store/project";
import Project from "../model/Project";
import ProjectEditForm from "../form/ProjectEditForm";

enum ProjectLevel {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

type ProjectEditFormInput = {
    name: string;
    description: string;
    status: boolean;
    level: ProjectLevel;
    gitRepository: string;
    maxParticipantsNumber: number;
}

interface ProjectEditPopupProps {
    onClose: () => void;
    onSave: () => void;
}

function ProjectEditPopup({ onClose, onSave }: ProjectEditPopupProps) {
    const { project, updateProject, addSkills, removeSkills, loadProject } = useProjectStore();

    const handleSave = async (data: ProjectEditFormInput, skillsToAdd: number[], skillsToDelete: number[]) => {
        if (!project) {
            return;
        }

        const projectData: Project = {
            id: project.id,
            name: data.name,
            description: data.description,
            status: data.status,
            participantsNumber: project.participantsNumber,
            maxParticipantsNumber: data.maxParticipantsNumber,
            startDate: project.startDate,
            gitRepository: data.gitRepository,
            projectLevel: data.level,
            owner: project.owner,
            skills: []
        };

        await updateProject(projectData);

        if (skillsToAdd.length !== 0) {
            await addSkills(skillsToAdd);
        }

        if (skillsToDelete.length !== 0) {
            await removeSkills(skillsToDelete);
        }

        await loadProject(project.id);  // Reload project to get the updated data

        onSave();
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-3/4 h-5/6 bg-custom-light-gray 
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-white z-10
                        flex flex-col justify-between items-start">
                <div className="w-full mt-5">
                    <h1 className="font-bold text-4xl mx-5">Edit Profile</h1>
                    <hr className="w-full border-1 border-white my-5"/>
                </div>

                <div className="w-full h-full px-5">
                    <ProjectEditForm onClose={onClose} onSave={handleSave}/>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProjectEditPopup;