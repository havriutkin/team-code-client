import { IoIosNotificationsOutline } from "react-icons/io";
import { GoProjectRoadmap } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { BsPersonCircle } from "react-icons/bs";
import TeamCodeLogo from '/TeamCodeLogo.png'
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/auth";
import useUserStore from "../store/user";
import useProjectStore from "../store/project";
import ProjectFilter from "../model/ProjectFilter";
import { useState } from "react";
import NotificationsPopup from "../popup/NotificationsPopup";

/*
TODO: fix navigating to profile page
*/

function SideBar() {
    const { principal } = useAuthStore();
    const navigate = useNavigate();
    const { loadUser } = useUserStore();
    const { loadProjectsByUserId, loadProjectsByFilter } = useProjectStore();
    const [isNotificationsDisplayed, setIsNotificationsDisplayed] = useState<boolean>(false);

    const handleProfileClick = async () => {
        if (!principal) return;

        await loadUser(principal?.email);
        navigate("/profile");
    }

    const handleProjectsClick = async () => {
        if (!principal) return;

        await loadProjectsByUserId(principal.id);
        navigate("/my-projects");
    }

    const handleSearchClick = async () => {
        const projectFilter: ProjectFilter = {
            name: null,
            projectLevel: null,
            skills: null
        }
        await loadProjectsByFilter(projectFilter);
        
        navigate("/search");
    }

    const handleNotificationsClick = () => {
        setIsNotificationsDisplayed(!isNotificationsDisplayed);
    }

    return (
        <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="z-10 w-1/12 h-screen left-0 fixed bg-custom-light-gray rounded-r-3xl">
            <div className="w-full h-1/6 bg-custom-blue flex justify-center items-center 
                            rounded-tr-3xl">
                <img src={TeamCodeLogo} alt="TeamCodeLogo" className="w-1/2 h-1/2 transition-all hover:scale-110 active:scale-90"
                                                            onClick={() => {navigate('/')}}/>
            </div>
            <div className="w-full h-4/6 flex flex-col justify-end items-center">
                <IoIosNotificationsOutline className="m-5 text-4xl hover:scale-110"
                            onClick={handleNotificationsClick}/>
                <GoProjectRoadmap className="m-5 text-4xl hover:scale-110"
                            onClick={handleProjectsClick}/>
                <CiSearch className="m-5 text-4xl hover:scale-110" 
                            onClick={handleSearchClick}/>
            </div>
            <div className="w-full h-1/6 border-t-2 border-white flex justify-center items-center">
                <BsPersonCircle className="text-6xl transition-all hover:scale-110" onClick={handleProfileClick}/>
            </div>

            {isNotificationsDisplayed && <NotificationsPopup/>}
        </motion.div>
    );
}

export default SideBar;