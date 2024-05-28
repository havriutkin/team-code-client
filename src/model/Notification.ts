import User from "./UserModel";

interface Notification {
    id: number;
    message: string;
    isViewed: boolean;
    creationDate: Date;
    user: User;
}

export default Notification;