import { motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "../store/notification";
import { useEffect } from "react";
import NotificationList from "../component/NotificationList";
import Button from "../component/Button";
import Loading from "../component/Loading";

interface NotificationsPopupProps {
    onClose: () => void;
}

function NotificationsPopup({ onClose }: NotificationsPopupProps) {
    const { notifications, loadNotifications, isLoading } = useNotificationStore();

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

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
                        flex flex-col justify-between items-start">
                <div className="w-full mt-5">
                    <h1 className="font-bold text-4xl mx-5">Notifications</h1>
                    <hr className="w-full border-1 border-white my-5"/>
                </div>
                {
                    isLoading ?
                    <div className="w-full h-full flex justify-center items-center">
                        <Loading size="xl"/>
                    </div>
                    :
                    <>

                        <div className="w-full h-full px-5 overflow-y-scroll scrollbar-thin">
                            <NotificationList notifications={notifications}/>
                        </div>

                        <div className="w-full justify-center items-center p-5">
                            <Button text="Close" className="w-1/12 rounded-md h-10 bg-custom-blue text-white
                                                hover:scale-105 active:scale-95 transition-all" 
                                onClick={onClose}/>
                        </div>
                    </>
                }   
            </motion.div>
        </AnimatePresence>
    );
}

export default NotificationsPopup;