import useProjectStore from "../store/project";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useLocation } from "react-router-dom";
import SideBar from "../component/Sidebar";
import { BsCircleFill, BsPersonFillGear } from "react-icons/bs";
import { IoCalendarNumber } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";


function ProjectPage() {
    const location = useLocation();
    const { projects, isLoading, isError, loadProject} = useProjectStore();
    const { project } = location.state;

    console.log("Recieved priject: ");
    console.log(project);


    if (isLoading) {
        return <LoadingPage/>;
    }

    if (isError) {
        return <ErrorPage/>;
    }

    // useEffect(()=>{
    //     loadProject(id);
       
    //     console.log("Project page fetching");
    //     console.log(projects);
    //     //console.log("Project page first fetching");
    //     //console.log(projects[0]);
    //     //console.log("Project name:" + projects[0].name);

    // }, [projects, id, loadProject]);

    return (
        <>
            <div className=" w-screen h-screen flex justify-center bg-rad text-white">
                <div className="w-1/12">
                    <SideBar/>
                </div>
                <div className=" w-3/4 flex flex-col gap-10">
                    <div>
                        <div className=" w-auto flex items-center gap-20 pt-10">
                            <h1 className="font-extrabold text-5xl">{project.name}</h1>
                            <div className=" flex justify-center items-center bg-custom-blue w-1/6 h-10 rounded-lg">
                                <p>View join requests</p>
                            </div>
                            <IoMdSettings className=" text-4xl"/>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-5">
                        <div className="flex gap-16">
                            <div className="flex justify-center text-2xl gap-2">
                                <BsPersonFillGear className="text-3xl"/>
                                <p className="font-light">Project owner: </p>
                                <p className="font-light">{project.owner.name}</p>
                            </div>
                            <div className="flex justify-center text-2xl gap-2">
                                <IoCalendarNumber className="text-3xl"/>
                                <p className="font-light">{project.startDate.split("T")[0]}</p>
                            </div>
                            
                        </div>
                        <div className="flex items-center gap-16">
                                {project.status ? 
                                <div className="flex justify-center items-center gap-1">
                                    <BsCircleFill className="text-xs text-custom-green"/> 
                                    <p className="font-light">Active</p>
                                </div> : 
                                <div className="flex justify-center items-center gap-1">
                                    <BsCircleFill className="text-xs text-red-500"/> 
                                    <p className="font-light">Not Active</p>
                                </div>
                                }
                                <div className=" flex justify-center items-center gap-1">
                                    <FaGithub className="text-xl"/>
                                    { project.githubLink ?
                                        <p className="font-light">{project.githubLink}</p>:
                                        <p className="font-light">Undefined</p>
                                    }
                                
                                </div>
                                <div className=" flex justify-center items-center gap-1">
                                    <RiTeamFill text-1xl/>
                                    <p>Current team size {project.participantsNumber}/{project.maxParticipantsNumber}</p>
                                </div>
                        </div>
                    </div>
                    <div className=" w-2/3 flex flex-col gap-5">
                        <h3 className="font-extrabold text-2xl">About:</h3>
                        <p>{project.description}</p>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default ProjectPage;