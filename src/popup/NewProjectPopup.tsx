import { AnimatePresence, motion } from "framer-motion";
import useProjectStore from "../store/project";
import Project from "../model/Project";
import CreateProjectForm from "../form/CreateProjectForm";
import useUserStore from "../store/user";


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

function NewProjectPopup({ onClose, onSave }: ProjectEditPopupProps) {
    const {  addSkills,  createProject} = useProjectStore();
    const { user } = useUserStore();

    const handleSave = async (data: ProjectEditFormInput, skillsToAdd: number[], skillsToDelete: number[]) => {
            if(!user){return;}

            const projectData: Project = {
                id: 0, 
                name: data.name,
                description: data.description,
                status: data.status,
                participantsNumber: 1,  
                maxParticipantsNumber: data.maxParticipantsNumber,
                startDate: new Date(),  
                gitRepository: data.gitRepository,
                projectLevel: data.level,
                owner: user,  
                skills: []
            };

            createProject(projectData).then(() => {
                if (skillsToAdd.length !== 0) {
                    addSkills(skillsToAdd);
                }
            });
            onSave();
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-3/4 h-5/6 bg-custom-light-gray 
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-white z-30
                        flex flex-col justify-between items-start">
                <div className="w-full mt-5">
                    <h1 className="font-bold text-4xl mx-5">Create Project</h1>
                    <hr className="w-full border-1 border-white my-5"/>
                </div>

                <div className="w-full h-full px-5">
                    <CreateProjectForm onClose={onClose} onSave={handleSave}/>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default NewProjectPopup;