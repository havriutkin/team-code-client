import { FaRegTrashAlt } from "react-icons/fa";
import Notification from "../model/Notification";
import useNotificationStore from "../store/notification";

interface NotificationViewProps {
  notification: Notification;
  className?: string;
}

function NotificationView ({ notification, className }: NotificationViewProps) {
    const {loadNotifications, markAsViewed, deleteNotification} = useNotificationStore();

    const handleHover = async () => {
        if (!notification.viewed) {
            await markAsViewed(notification.id);
            await loadNotifications();
        }
    }

    const handleDelete = async () => {
        await deleteNotification(notification.id);
        await loadNotifications();
    }

    return (
        <div className={`w-1/2 flex items-center justify-around py-3 ${notification.viewed ? " bg-gray-600" : "bg-gray-500"} ${className}`}
            onMouseOver={handleHover}>
            <p className="text-xl">{notification.message}</p>
            <p>{notification.creationDate.toString().split("T")[0]}</p>
            <FaRegTrashAlt className="text-xl text-red-500 transition-all hover:scale-110 active:scale-95"
                onClick={handleDelete}/>
        </div>
    )
}

export default NotificationView;