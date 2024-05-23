import axios from "axios";
import RequestView from "../component/RequestView";
import SideBar from "../component/Sidebar";
import useAuthStore from "../store/auth";
import useProjectStore from "../store/project";
import useRequestStore from "../store/request";
import { useEffect } from "react";

function RequestPage() {
    const { requests, isLoading, isError, loadRequestsByProjectId, approveRequest} = useRequestStore();
    const { project } = useProjectStore();

    useEffect(() => {
        if(!project) {
            return;
        }

        loadRequestsByProjectId(project.id);
        console.log(requests);
    }, requests);

    const filteredRequests = requests?.filter(request => request.status !== "APPROVED" && request.status !== "REJECTED");
    const sortedRequests = filteredRequests.slice().sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());

    return (
        <div className=" w-screen h-screen flex justify-center text-white">
            <div className=" w-1/12">
                <SideBar/>
            </div>
            <div className="w-full h-full flex flex-col justify-start items-center ">
                
                <h3 className=" font-extrabold text-2xl">Join requests:</h3>
                {sortedRequests && sortedRequests.length > 0 ?
                    <ul className="w-full h-full flex flex-col justify-start items-center">
                        {sortedRequests.map((request, index) => {
                            return (
                                <li key={index} className="flex flex-col items-center w-full h-1/6 my-3">
                                    <RequestView request={request} className=" w-2/3 h-full border-2 border-custom-light-gray 
                                                            rounded-lg shadow-md shadow-custom-light-gray font-light
                                                            transition-all hover:scale-105"/>
                                </li>
                            );
                        })}
                    </ul>
                    : <h3 className=" text-1xl font-extrabold">No requests</h3>
                }
            </div>
        </div>
    );
}

export default RequestPage;