import useProjectStore from "../store/project";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "../component/Sidebar";
import { BsCircleFill, BsPersonFillGear } from "react-icons/bs";
import { IoCalendarNumber } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import { useEffect } from "react";
import useAuthStore from "../store/auth";
import Button from "../component/Button";

function ProjectPage() {
    const location = useLocation();
    const { project, isLoading, isError, isOwner, isMember, loadProject, removeParticipant} = useProjectStore();
    const { projectId } = location.state;
    const { principal, fetchPrincipal } = useAuthStore();
    const navigate = useNavigate();

    const handleLeaveProject = async () => {
        if (!principal || !projectId) {
            return;
        }

        await removeParticipant(principal.id);
        navigate("/profile", {state: {email: principal.email }});
    }

    useEffect(()=>{
        loadProject(projectId);
    }, []);

    if (isLoading) {
        return <LoadingPage/>;
    }

    if (isError) {
        return <ErrorPage/>;
    }


    return (
        <div className="w-screen h-screen overflow-y-scroll scrollbar-thin scrollbar-track-custom-blue bg-dark-bg font-sans text-white flex justify-center">
            <div className="w-1/12">
                <SideBar/>
            </div>
            <div className="w-3/4 flex flex-col items-start">
                <div className="w-5/6 h-2/6 flex flex-col items-start justify-evenly">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="font-extrabold text-5xl">{project?.name}</h1>
                        <div className="w-1/2">
                            {
                                isOwner ?
                                <div className="w-full flex items-center justify-around">
                                    <Button text="View Join Requests" 
                                            className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                hover:scale-105 active:scale-95" 
                                            onClick={()=>{}}/>
                                    <Button text="View Participants" 
                                            className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                hover:scale-105 active:scale-95" 
                                            onClick={()=>{}}/>
                                    <IoMdSettings className="text-3xl transition-all hover:scale-110 active:scale-95"/>
                                </div>
                                :
                                <div>
                                    {
                                        isMember ? 
                                        <Button text="Leave Project" 
                                                className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                    hover:scale-105 active:scale-95" 
                                                onClick={handleLeaveProject}/>
                                        :
                                        <Button text="Send Join Request" 
                                                className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                    hover:scale-105 active:scale-95" 
                                                onClick={()=>{}}/>
                                    }    
                                </div>
                            }
                        </div>
                    </div>
                    <div className="w-full h-1/2 flex flex-col items-start justify-evenly">
                        <div className="w-1/2 flex items-center justify-between">
                            <div className="flex justify-center text-xl gap-2">
                                <BsPersonFillGear className="text-3xl"/>
                                <p className="font-light">Project owner: </p>
                                <p className="font-light">{project?.owner.name}</p>
                            </div>
                            <div className="flex justify-center text-xl gap-2">
                                <IoCalendarNumber className="text-3xl"/>
                                <p className="font-light">{project?.startDate.toString().split("T")[0]}</p>
                            </div>
                        </div>
                        <div className="w-2/3 flex items-center justify-between">
                                {project?.status ? 
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
                                    { project?.gitRepository ?
                                        <p className="font-light">{project.gitRepository}</p>:
                                        <p className="font-light">Undefined</p>
                                    }
                                
                                </div>
                                <div className=" flex justify-center items-center gap-1">
                                    <RiTeamFill className="text-1xl"/>
                                    <p>Current team size {project?.participantsNumber}/{project?.maxParticipantsNumber}</p>
                                </div>
                        </div>
                    </div>
                </div>
                <div className=" w-2/3 flex flex-col gap-5">
                    <h3 className="font-extrabold text-2xl">About:</h3>
                    <p>{project?.description}</p>
                </div>
                
            </div>
        </div>
    );
}

export default ProjectPage;