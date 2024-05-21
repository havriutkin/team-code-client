import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../store/user";
import SideBar from "../component/Sidebar";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import Button from "../component/Button";
import ProfileEditForm from "../component/ProfileEditPopup";
import { motion } from "framer-motion";
import SkillList from "../component/SkillList"; 
import ProjectList from "../component/ProjectList";
import useProjectStore from "../store/project";
import useAuthStore from "../store/auth";
import NewUserPopup from "../component/NewUserPopup";

// TODO: Add LogOut Button

function Profile(){
    const location = useLocation();
    const { email, newUserTip } = location.state;
    const [ isTipDisplayed, setIsTipDisplayed ] = useState<boolean>(newUserTip || false);
    const { fetchPrincipal, logout } = useAuthStore();
    const { user, loadUser, isLoading, isError, isOwner } = useUserStore();
    const { projects, loadProjectsByUserId } = useProjectStore();
    const [ isEditing, setIsEditing ] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = () => {
        logout();
        navigate('/');
    }

    useEffect(() => {
        if (!email) {
            return;
        }

        const load = async () => {
            await fetchPrincipal();
            await loadUser(email);
        }
        load();
    }, [email, loadUser, fetchPrincipal]);


    useEffect(() => {
        if (user) {
            console.log(user);
            loadProjectsByUserId(user.id);
        }
    }, [user, loadProjectsByUserId]);

    const onEditFormSave = () => {
        setIsEditing(false);
    }

    if (isLoading || !user) {
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
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-3/4 h-full p-5 flex flex-col items-start gap-10">
                <div className="w-full flex justify-between items-center">
                    <div className="w-1/6 flex justify-start items-center">
                        <BsPersonCircle className="text-6xl"/>
                    </div>

                    <div className="w-5/6 h-full flex flex-col justify-between items-start gap-3">
                        <div className="w-3/4 flex justify-between items-center">
                            <h1 className="font-extrabold text-6xl">{user.name}</h1>
                            {isOwner && <Button text="Edit" 
                                            className="w-24 h-3/4 rounded-lg text-xl bg-custom-blue transition-all 
                                                        hover:scale-105 active:scale-95" 
                                            onClick={() => setIsEditing(true)}/>}
                            {isOwner && <Button text="Log Out" 
                                            className="w-24 h-3/4 rounded-lg text-xl bg-custom-blue transition-all 
                                            hover:scale-105 active:scale-95" 
                                            onClick={handleLogOut}/>}
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
                        <SkillList skills={user.skills} isEdit={false}/>
                    </div>
                </div>

                <div className="w-full h-auto flex flex-col justify-between items-start gap-5">
                    <div className="w-full min-h-20 h-auto flex flex-col gap-2">
                        <h2 className="font-bold text-3xl">About</h2>
                        <p className=" w-5/6 text-lg font-light min-h-16 h-auto">{user.bio || "No bio"}</p>
                    </div>
                    <div className="w-full h-auto min-h-20 flex flex-col">
                        <h2 className="font-bold text-3xl mb-5">Recent Projects</h2>
                        <div>
                            <ProjectList projects={projects.slice(0, 3)} className="flex h-auto mb-5"/>
                        </div>
                    </div>
                </div>
                {isTipDisplayed && <NewUserPopup onClose={() => setIsTipDisplayed(false)} />}
                {isEditing && <ProfileEditForm onClose={() => setIsEditing(false)} onSave={onEditFormSave}/>}
            </motion.div>
        </div>
    );
}

export default Profile;