import Project from "../model/Project";
import ProjectView from "./ProjectView";

interface ProjectListProps {
    projects?: Project[];
    className?: string;
}

function ProjectList({ projects, className}: ProjectListProps ) {

    return(
        <div className={`${className}`}>
            { projects && projects.length > 0 ?
                <ul className="w-full h-full flex flex-col gap-4 justify-around">
                    {projects.map((project, index) => {
                        return (
                            <li key={index} className="flex flex-col w-auto h-full">
                                <ProjectView project={project} className="border-2 border-custom-light-gray w-3/4 
                                                        rounded-lg shadow-md shadow-custom-light-gray
                                                        transition-all hover:scale-105"/>
                            </li>
                        );
                    })}
                </ul>
                : <p className="w-full flex justify-center items-center">No projects</p>
            }
        </div>
    );
}

export default ProjectList;