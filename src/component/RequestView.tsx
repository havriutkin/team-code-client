import { useNavigate } from "react-router-dom";
import Request from "../model/RequestModel";
import useRequestStore from "../store/request";
import useUserStore from "../store/user";
import SkillList from "./SkillList";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";


interface RequestPopup{
    request: Request;
    className?: string;
}

function RequestView({ request, className }: RequestPopup) {
    const { approveRequest, rejectRequest } = useRequestStore();
    const { loadUser } = useUserStore();
    const navigate = useNavigate();

    const handleUserClick = async () => {
        await loadUser(request.user.email);
        navigate('/profile');
    }

    return (
        <div className={`bg-dark-bg flex items-center justify-around p-3 ${className}`}>
            <p className="text-xl font-bold
                underline cursor-pointer transition-all hover:scale-105 active:scale-95"
                onClick={handleUserClick}>
                {request.user.name}
            </p>

            <SkillList skills={request.user.skills.slice(0, 7)} isEdit={false} className="text-sm flex scrollbar-none items-center"/>
            
            <p className="">{request.requestDate.toString().split("T")[0]}</p>
            <div className="flex justify-evenly items-center gap-2">
                <IoIosCheckmarkCircleOutline
                        className="h-full text-green-500 text-3xl cursor-pointer
                        transition-all hover:scale-110 active:scale-95"
                        onClick={() => {approveRequest(request)}}
                />
                <IoIosCloseCircleOutline 
                    className="h-full text-red-500 text-3xl cursor-pointer
                            transition-all hover:scale-110 active:scale-95"
                    onClick={() => {rejectRequest(request)}}
                /> 
            </div>                   
        </div>
    );
}

export default RequestView;