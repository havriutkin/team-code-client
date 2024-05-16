import Project from "../model/Project";
import { BsCircleFill } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import SkillList from "./SkillList";

interface ProjectViewProps {
    project: Project;
    className?: string;
}


function ProjectView({project, className} : ProjectViewProps) {
    return (
        <div className={className}>
            <div className=" bg-custom-blue w-1/4 h-1/4 flex flex-col justify-center items-center rounded-tl-lg rounded-br-lg -translate-x-2.5 -translate-y-0.5">
                <p>{project.name}</p>
            </div>
            <p className="my-1 line-clamp-3">{project.description}</p>
            <SkillList skills={project.skills} isEdit={false} className=" flex w-auto h-full overflow-x-scroll scrollbar-none" elementsPosition="flex w-auto"/>
            <div className="flex justify-start items-end gap-4 my-1">
                {project.status ? 
                    <div className="flex items-center gap-1">
                        <BsCircleFill className=" text-sm text-custom-green"/> 
                        <p>Active</p>
                    </div> : 
                    <div className="flex items-center gap-1">
                        <BsCircleFill className="text-red-500"/> 
                        <p>Not Active</p>
                    </div>
                }
                
                <div className="flex items-center gap-1">
                    <FaPeopleGroup/>
                    <p>{project.participantsNumber}</p>
                </div>
            </div>
        </div>
    );
}

export default ProjectView;