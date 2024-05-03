import ProfileEditForm from "./ProfileEditForm";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileEditPopupProps {
    onClose: () => void;
}

function ProfileEditPopup({ onClose }: ProfileEditPopupProps) {

    const handleSave = () => {
        onClose();
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