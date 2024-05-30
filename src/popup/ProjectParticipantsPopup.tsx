import { AnimatePresence, motion } from "framer-motion";
import Button from "../component/Button";
import useProjectStore from "../store/project";
import { useEffect, useState } from "react";
import useUserStore from "../store/user";
import LoadingPage from "../page/LoadingPage";
import { IoRemoveCircle } from "react-icons/io5";
import User from "../model/UserModel";
import { useNavigate } from "react-router-dom";

interface ProjectParticipantsPopupProps {
    onClose: () => void;
}

function ProjectParticipantsPopup({ onClose }: ProjectParticipantsPopupProps) {
    const { project, removeParticipants, loadProject } = useProjectStore();
    const { users, loadProjectMembers, isLoading, isError, loadUser } = useUserStore();
    const [usersToRemove, setUsersToRemove] = useState<number[]>([]);
    const navigate = useNavigate();

    const handleUserRemove = (userId: number) => {
        setUsersToRemove([...usersToRemove, userId]);
    }

    const handleSave = async () => {
        if (!project) {
            return;
        }

        if (usersToRemove.length === 0) {
            onClose();
            return;
        }

        await removeParticipants(usersToRemove);
        await loadProject(project.id);

        onClose();
    }

    const handleUserClick = async (user: User) => {
        await loadUser(user.email);
        navigate('/profile');
    }  

    useEffect(() => {
        if (project) {
            loadProjectMembers(project.id);
        }
    }, [project, loadProjectMembers]);

    if (!project) {
        onClose();
        return;
    }

    if (isError) {
        onClose();
        return;
    }

    if (isLoading) {
        return (
            <AnimatePresence>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-3/4 h-5/6 bg-custom-light-gray 
                            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            text-white z-10
                            flex flex-col justify-center items-center rounded-2xl p-3">
                    <LoadingPage/>
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-3/4 h-5/6 bg-custom-light-gray 
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-white z-30
                        flex flex-col justify-between items-center rounded-2xl p-3">
                <div className="w-full mt-5">
                    <h1 className="font-bold text-4xl mx-5">{project?.name} Participants</h1>
                    <hr className="w-full border-1 border-white my-5"/>
                </div>

                <div className="w-full px-5">
                    <ul>
                        {
                            users.map(user => {
                                if (usersToRemove.includes(user.id)) {
                                    return;
                                }

                                return (
                                    <li key={user.id} className="w-full flex items-center justify-between p-3 my-3 bg-custom-dark-gray rounded-lg">
                                        <p className="font-semibold underline cursor-pointer transition-all hover:scale-105 active:scale-95"
                                            onClick={() => {handleUserClick(user)}}>
                                            {user.name}
                                        </p>
                                        <IoRemoveCircle className="text-2xl text-red-500 cursor-pointer"
                                                        onClick={() => {handleUserRemove(user.id)}}/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div>
                    <Button text="Save" onClick={handleSave} className="bg-custom-blue text-xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95"/>
                    <Button text="Cancel" onClick={onClose} className="text-xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95"/>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProjectParticipantsPopup;