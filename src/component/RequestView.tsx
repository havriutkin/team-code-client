import Request from "../model/RequestModel";
import useRequestStore from "../store/request";
import SkillList from "./SkillList";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";


interface RequestPopup{
    request: Request;
    className?: string;
}

function RequestView({ request, className }: RequestPopup) {
    const { approveRequest, rejectRequest } = useRequestStore();

    return (
        <div className={`bg-dark-bg flex items-center p-3 ${className}`}>
            <p className=" w-1/6">{request.user.name}</p>
            <SkillList skills={request.user.skills.slice(0, 7)} isEdit={false} className="text-sm flex w-3/5 scrollbar-none items-center"/>
            <p className="w-1/6">{request.requestDate.toString().split("T")[0]}</p>
            <div className=" w-1/6 flex justify-evenly items-center">
                <IoIosCheckmarkCircleOutline
                        className="h-full text-green-500 text-xl cursor-pointer
                        transition-all hover:scale-110 active:scale-95"
                        onClick={() => {approveRequest(request)}}
                />
                <IoIosCloseCircleOutline 
                    className="h-full text-red-500 text-xl cursor-pointer
                            transition-all hover:scale-110 active:scale-95"
                    onClick={() => {rejectRequest(request)}}
                /> 
            </div>                   
        </div>
    );
}

export default RequestView;