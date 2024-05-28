import { AnimatePresence, motion } from "framer-motion";
import Button from "../component/Button";

interface NewUserPopupProps {
    onClose: () => void;
}

function newUserPopup({ onClose }: NewUserPopupProps) {
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-1/2 h-1/2 bg-custom-light-gray 
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-white z-30
                        flex flex-col justify-around items-center rounded-2xl">
                <p className=" text-4xl font-extrabold">Welcome to TeamCode!</p>
                <div className="text-2xl text-center">
                    <p>
                        Make sure to edit your info! This way it will be easier to get into a project!
                    </p>
                    <p>
                        Search for projects and join them to start collaborating!
                    </p>
                </div>
                <Button text="Got it!" onClick={onClose} className="bg-custom-blue text-xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95"/>
            </motion.div>
        </AnimatePresence>
    );
}

export default newUserPopup;