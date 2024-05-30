import useProjectStore from "../store/project";
import ErrorPage from "./ErrorPage";
import { useNavigate } from "react-router-dom";
import SideBar from "../component/Sidebar";
import { BsCircleFill, BsPersonFillGear } from "react-icons/bs";
import { IoCalendarNumber } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { useEffect, useState } from "react";
import useAuthStore from "../store/auth";
import Button from "../component/Button";
import ProjectEditPopup from "../popup/ProjectEditPopup";
import { SiLevelsdotfyi } from "react-icons/si";
import SkillList from "../component/SkillList";
import ProjectParticipantsPopup from "../popup/ProjectParticipantsPopup";
import useRequestStore from "../store/request";
import useUserStore from "../store/user";
import SuccessPopup from "../popup/SuccessPopup";
import GirlImage from "/AnimeGirl.png";
import Loading from "../component/Loading";

function ProjectPage() {
    const { project, isLoading, isError, isOwner, isMember, removeParticipant, loadProject} = useProjectStore();
    const { loadUser } = useUserStore();
    const { principal } = useAuthStore();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isParticipantDisplayed, setIsParticipantDisplayed] = useState(false);
    const { sendJoinRequest, isRequestExists } = useRequestStore();
    const [isRequestSended, setIsRequestSended] = useState(false);
    const [isSuccessMessageDisplayed, setIsSuccessMessageDisplayed] = useState(false);

    const handleLeaveProject = async () => {
        if (!principal || !project) {
            return;
        }

        await removeParticipant(principal.id);
        navigate("/profile", {state: {email: principal.email }});
    }
    
    const handleOwnerClick = async () => {
        if (!project) {
            return;
        }

        await loadUser(project?.owner.email);
        navigate("/profile");
    }

    const handleSendJoinRequest = async () => {
        if (!project || !principal) {
            return;
        }

        await sendJoinRequest(project.id, principal.id);
        setIsRequestSended(true);
        setIsSuccessMessageDisplayed(true);
    }

    useEffect(() => {
        if(!project) {
            return;
        }

        //loadProject(project.id);
        if(!principal) {
            setIsRequestSended(false);
            return;
        } else {
            isRequestExists(project.id, principal.id).then((isRequestSended) => {
                console.log(isRequestSended);
                setIsRequestSended(isRequestSended)
            });
        }
    }, [project, principal, loadProject, isRequestExists]);

    if (isError) {
        return <ErrorPage/>;
    }

    return (
        <div className="w-screen h-screen overflow-y-scroll scrollbar-thin scrollbar-track-custom-blue 
                    bg-dark-bg font-sans text-white flex justify-center relative">
            <div className="w-1/12">
                <SideBar/>
            </div>
            <div className={`w-3/4 flex flex-col items-start 
                ${isSuccessMessageDisplayed || isParticipantDisplayed || isEditing ? "blur-md" : ""}`}>
                {  
                    isLoading ? 
                    <Loading size="xl"/>
                    :
                    <>
                    <div className="w-5/6 h-1/3 flex flex-col items-start justify-evenly">
                        <div className="w-full flex items-center justify-between">
                            <h1 className="font-extrabold text-5xl">{project?.name}</h1>
                            <div className="w-1/2">
                                {
                                    isOwner ?
                                    <div className="w-full flex items-center justify-around">
                                        <Button text="View Join Requests" 
                                                className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                    hover:scale-105 active:scale-95" 
                                                onClick={()=>{navigate("/request")}}/>
                                        <Button text="View Participants" 
                                                className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                    hover:scale-105 active:scale-95" 
                                                onClick={()=>{setIsParticipantDisplayed(true)}}/>
                                        <IoMdSettings className="text-3xl transition-all hover:scale-110 active:scale-95"
                                                onClick={() => {setIsEditing(true)}}/>
                                    </div>
                                    :
                                    <div>
                                        {
                                            isMember && project?.status ? 
                                            <Button text="Leave Project" 
                                                    className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                        hover:scale-105 active:scale-95" 
                                                    onClick={handleLeaveProject}/>
                                            :
                                            !isRequestSended && project?.status &&
                                                <Button text="Send Join Request" 
                                                    className="h-3/4 p-3 rounded-lg bg-custom-blue transition-all 
                                                        hover:scale-105 active:scale-95" 
                                                    onClick={handleSendJoinRequest}/>
                                            
                                        }    
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="w-full h-1/2 flex flex-col items-start justify-evenly">
                            <div className="w-3/4 flex items-center justify-between">
                                <div className="flex justify-center text-xl gap-2">
                                    <BsPersonFillGear className="text-3xl"/>
                                    <p className="font-light">Project owner: </p>
                                    <p className="font-light underline
                                                cursor-pointer transition-all hover:scale-105 active:scale-95"
                                        onClick={handleOwnerClick}>
                                            {project?.owner.name}
                                    </p>
                                </div>
                                <div className="flex justify-center text-xl gap-2">
                                    <IoCalendarNumber className="text-3xl"/>
                                    <p className="font-light">{project?.startDate.toString().split("T")[0]}</p>
                                </div>
                                <div className="flex justify-start items-center gap-2">
                                    <SiLevelsdotfyi className="text-3xl"/>
                                    <p>{project?.projectLevel || "Project Level not specified"}</p>
                                </div>
                            </div>
                            <div className="w-3/4 flex items-center justify-between">
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
                            <SkillList skills={project?.skills || []} isEdit={false}/>
                        </div>
                    </div>
                    <div className=" w-2/3 flex flex-col gap-5">
                        <h3 className="font-extrabold text-2xl">About:</h3>
                        <p>{project?.description}</p>
                    </div>
                    </>
                }
            </div>
            <img src={GirlImage} width={300} 
                className={`absolute bottom-0 right-20 
                        ${isSuccessMessageDisplayed || isParticipantDisplayed || isEditing ? "blur-md" : ""}`}>            
            </img>
            {isEditing && <ProjectEditPopup onClose={()=>{setIsEditing(false)}} 
                                            onSave={() => {setIsEditing(false)}}/>}
            {isParticipantDisplayed && <ProjectParticipantsPopup onClose={()=>{setIsParticipantDisplayed(false)}}/>}
            {isSuccessMessageDisplayed && <SuccessPopup onClose={() => {setIsSuccessMessageDisplayed(false)} }/>}
        </div>
    );
}

export default ProjectPage;