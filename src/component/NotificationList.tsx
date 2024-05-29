import NotificationView from "./NotificationView";
import Notification from "../model/Notification";

interface NotificationListProps {
    notifications?: Notification[];
    className?: string;
}

function NotificationList({ notifications, className}: NotificationListProps ) {

    return(
        <div className={`${className}`}>
            { notifications && notifications.length > 0 ?
                <ul className="w-full h-full flex flex-col gap-4 justify-around">
                    {notifications.map((notification, index) => {
                        return (
                            <li key={index} className="flex flex-col w-auto h-full">
                                <NotificationView notification={notification} className="border-2 border-custom-light-gray w-3/4 
                                                        rounded-lg shadow-md shadow-custom-light-gray
                                                        transition-all"/>
                            </li>
                        );
                    })}
                </ul>
                : <p className="w-full flex justify-center items-center">No Notifications</p>
            }
        </div>
    );
}

export default NotificationList;