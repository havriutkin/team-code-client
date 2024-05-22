import Project from "../model/Project";
import { BsCircleFill } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import SkillList from "./SkillList";
import { useNavigate } from "react-router-dom";
import useProjectStore from "../store/project";

interface ProjectViewProps {
    project: Project;
    className?: string;
}


function ProjectView({project, className} : ProjectViewProps) {
    const { loadProject } = useProjectStore();
    const navigate  = useNavigate();
    const pickProject = (id: number)=> {
        loadProject(id).then(() => navigate("/project"));
    }

    return (
        <div className={`h-40 ${className}`}  onClick={() => {pickProject(project.id)}}>
            <div className="bg-custom-blue min-w-1/4 w-fit h-1/4 px-3 flex flex-col justify-center items-center rounded-tl-md rounded-br-lg">
                <p className="text-xl font-bold cursor-pointer">{project.name}</p>
            </div>

            <div className="pl-4 h-3/4 flex flex-col items-start justify-center">
                <p className="text-lg">{project.description.slice(0, 100) + "..."}</p>
                <SkillList skills={project.skills.slice(0, 7)} isEdit={false} className="text-sm pr-3 py-3 flex w-auto scrollbar-none"/>
                <div className="text-xs flex justify-start items-end gap-4">
                    {project.status ? 
                        <div className="flex justify-center items-center gap-1">
                            <BsCircleFill className="text-xs text-custom-green"/> 
                            <p>Active</p>
                        </div> : 
                        <div className="flex items-center gap-1">
                            <BsCircleFill className="text-xs text-red-500"/> 
                            <p>Not Active</p>
                        </div>
                    }

                    <p>{project.projectLevel.charAt(0).toUpperCase() + project.projectLevel.slice(1).toLowerCase()}</p>
                    
                    <div className="flex items-center gap-1">
                        <FaPeopleGroup/>
                        <p>{project.participantsNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectView;