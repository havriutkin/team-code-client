import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useUserStore from "../store/user";
import SideBar from "../component/Sidebar";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import useAuthStore from "../store/auth";
import Button from "../component/Button";
import ProfileEditForm from "../component/ProfileEditPopup";
import { motion, useResetProjection } from "framer-motion";
import SkillList from "../component/SkillList"; 
import ProjectList from "../component/ProjectList";
import useProjectStore from "../store/project";

function Profile(){
    const location = useLocation();
    const { email, newUserTip } = location.state;
    const { user, loadUser, isLoading, isError} = useUserStore();
    const [isOwner, setIsOwner] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const { fetchPrincipal } = useAuthStore();
    const { projects, loadProjectsByUserId } = useProjectStore();

    useEffect(() => {
        if (email) {
            fetchPrincipal().then((principal) => {
                if (!principal) {
                    return;
                }
                
                loadUser(email).then(() => {
                    if(user.id === principal?.id) {
                        setIsOwner(true);
                    } else {
                        setIsOwner(false)
                    }
                    loadProjectsByUserId(user.id);
                });
                
            });
        }
    }, [email, loadUser, fetchPrincipal, user.id]);

    const onEditFormSave = () => {
        setIsEditing(false);
    }

    if (isLoading) {
        return <LoadingPage/>;
    }

    if (isError) {
        return <ErrorPage/>;
    }

    return (
        <div className="w-full h-full bg-dark-bg font-sans text-white flex justify-center">
            <div className="w-1/12">
                <SideBar/>
            </div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-3/4 p-5 flex flex-col items-start gap-10">
                <div className="w-full h-1/5 flex justify-end items-center ">
                    <div className="w-1/6 h-full flex justify-start items-center">
                        <BsPersonCircle className="text-6xl"/>
                    </div>
                    <div className="w-5/6 h-full flex flex-col justify-between">
                        <div className="min-w-1/2 max-w-3/4 flex justify-stretch gap-10 items-center">
                            <h1 className="font-extrabold text-6xl">{user.name}</h1>
                            {isOwner && <Button text="Edit" 
                                            className="w-24 h-3/4 rounded-lg text-2xl bg-custom-blue transition-all 
                                                        hover:scale-105 active:scale-95" 
                                            onClick={() => setIsEditing(true)}/>}
                        </div>
                        <div className="w-full flex justify-between my-2">
                            <div className="w-1/3 flex justify-start items-center gap-2">
                                <MdEmail className="text-2xl"/>
                                <p>{user.email}</p>
                            </div>
                            <div className="w-1/3 flex justify-start items-center gap-2">
                                <FaGithub className="text-2xl"/>
                                <p>{user.githubLink || "No git hub link"}</p>
                            </div>
                            <div className="w-1/3 flex justify-start items-center gap-2">
                                <SiLevelsdotfyi className="text-2xl"/>
                                <p>{user.experience || "Experience not specified"}</p>
                            </div>
                        </div>
                        <SkillList skills={user.skills} isEdit={false} elementsPosition="flex-wrap justify-stretch"/>
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col justify-between items-start gap-5">
                    <div className="w-full min-h-20 h-auto flex flex-col">
                        <h2 className="font-bold text-3xl">About</h2>
                        <p className=" w-5/6 text-lg font-light min-h-16 h-auto">{user.bio || "No bio"}</p>
                    </div>
                    <div className="w-full h-auto min-h-20 flex flex-col">
                        <h2 className="font-bold text-3xl">Recent Projects</h2>
                        <div>
                            <ProjectList projects={projects} className=" flex w-5/6 h-auto min-h-40"/>
                        </div>
                    </div>
                </div>
                {newUserTip && <p>Welcome to TeamCode! We're excited to have you on board.</p>}
                {isEditing && <ProfileEditForm onClose={() => setIsEditing(false)} onSave={onEditFormSave}/>}
            </motion.div>
        </div>
    );
}

export default Profile;