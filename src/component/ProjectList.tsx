import Project from "../model/Project";
import ProjectView from "./ProjectView";

interface ProjectListProps {
    projects?: Project[];
    className?: string;
}

function ProjectList({ projects, className}: ProjectListProps ) {
    return(
        <div className={className}>
            { projects && projects.length > 0 ?
                <ul className="w-full h-full flex flex-col gap-4 ">
                    {projects.map((project, index) => {
                        return (
                            <li key={index} className="flex w-full h-full">
                                <ProjectView project={project} className="border-2 border-custom-light-gray w-full h-36 rounded-lg shadow-md shadow-custom-light-gray pl-2"/>
                            </li>
                        );
                    })}
                </ul>
                : <p>No skills</p>
            }
        </div>
    );
}

export default ProjectList;