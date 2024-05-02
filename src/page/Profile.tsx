import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useUserStore from "../store/user";
import SideBar from "../component/Sidebar";
import { BsPersonCircle } from "react-icons/bs";

function Profile(){
    const location = useLocation();
    const { email, newUserTip } = location.state;
    const { user, loadUser, isLoading, isError } = useUserStore();

    useEffect(() => {
        if (email) {
            loadUser(email);
        }
    }, [email, loadUser]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading user</div>;
    }

    return (
        <div className="w-screen h-screen bg-dark-bg font-sans text-white">
            <SideBar/>
            <div className="flex-1 flex justify-end items-center">
                <div className="w-1/6 h-1/6">
                    <BsPersonCircle className="text-6xl"/>
                </div>
                <div className="w-5/6 flex flex-col">
                    <h1>{user.name}</h1>
                    <div className="flex justify-between">
                        <p>{user.email}</p>
                        <p>{user.gitHubLink || "No git hub link"}</p>
                        <p>{user.experience || "Experience not specified"}</p>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <h2>About</h2>
                    <p>{user.bio || "No bio"}</p>
                </div>
                <div>
                    <h2>Recent Projects</h2>
                </div>
            </div>
            {newUserTip && <p>Welcome to TeamCode! We're excited to have you on board.</p>}
        </div>
    );
}

export default Profile;