import { AnimatePresence, motion } from "framer-motion";
import Button from "../component/Button";

interface SuccessPopupProps {
    onClose: () => void;
}

function SuccessPopup({ onClose }: SuccessPopupProps) {
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
                <div className="text-2xl text-center">
                    <p className="text-green-600">
                        Your join request has been sent!
                    </p>
                </div>
                <Button text="Close" onClick={onClose} className="bg-custom-blue text-xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95"/>
            </motion.div>
        </AnimatePresence>
    );
}

export default SuccessPopup;