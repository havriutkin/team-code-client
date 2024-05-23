import User from "./UserModel";
import Project from "./Project";

interface Request{
    id: number;
    status: string;
    requestDate: Date;
    message: string;
    user: User;
    project: Project;
}

export default Request;
