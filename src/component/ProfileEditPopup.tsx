import ProfileEditForm from "./ProfileEditForm";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../store/user";
import User from "../model/UserModel";

enum Experience {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCE = "ADVANCE"
}

type ProfileEditFormInput = {
    username: string;
    email: string;
    github: string;
    experience: Experience;
    bio: string;
    // skills: string[];
}


interface ProfileEditPopupProps {
    onSave: () => void;
    onClose: () => void;
}

function ProfileEditPopup({ onClose, onSave }: ProfileEditPopupProps) {
    const {user, updateUser, addSkills, removeSkills} = useUserStore();

    const handleSave = async (data: ProfileEditFormInput, skillsToAdd: number[], skillsToDelete: number[]) => {
        const userData: User = {
            id: user.id,
            name: data.username,
            email: data.email,
            experience: data.experience,
            bio: data.bio,
            githubLink: data.github,
            skills: [],
        };

        await updateUser(userData);

        if (skillsToAdd.length !== 0) {
            await addSkills(skillsToAdd);
        }

        if (skillsToDelete.length !== 0) {
            await removeSkills(skillsToDelete);
        }

        onSave();
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
                        text-white z-10
                        flex flex-col justify-between items-start">
                <div className="w-full mt-5">
                    <h1 className="font-bold text-4xl mx-5">Edit Profile</h1>
                    <hr className="w-full border-1 border-white my-5"/>
                </div>

                <div className="w-full h-full px-5">
                    <ProfileEditForm onClose={onClose} onSave={handleSave}/>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProfileEditPopup;