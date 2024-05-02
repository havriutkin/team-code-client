import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useUserStore from "../store/user";
import SideBar from "../component/Sidebar";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";

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
        <div className="w-screen h-screen bg-dark-bg font-sans text-white flex justify-center">
            <div className="w-1/12">
                <SideBar/>
            </div>
            <div className="w-3/4 p-5 flex flex-col items-start gap-10">
                <div className="w-full h-1/5 flex justify-end items-center">
                    <div className="w-1/6 h-full flex justify-start items-center">
                        <BsPersonCircle className="text-6xl"/>
                    </div>
                    <div className="w-5/6 h-full flex flex-col justify-between">
                        <h1 className="font-extrabold text-6xl">{user.name}</h1>
                        <div className="w-full flex justify-between">
                            <div className="w-1/3 flex justify-start items-center gap-2">
                                <MdEmail className="text-2xl"/>
                                <p>{user.email}</p>
                            </div>
                            <div className="w-1/3 flex justify-start items-center gap-2">
                                <FaGithub className="text-2xl"/>
                                <p>{user.gitHubLink || "No git hub link"}</p>
                            </div>
                            <div className="w-1/3 flex justify-start items-center gap-2">
                                <SiLevelsdotfyi className="text-2xl"/>
                                <p>{user.experience || "Experience not specified"}</p>
                            </div>
                        </div>
                        <div>
                            { user.skills && user.skills.length > 0 ?
                                <ul>
                                    {user.skills && user.skills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                                : <p>No skills</p>
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-between items-start">
                    <div className="w-full min-h-20 flex flex-col items-start gap-2">
                        <h2 className="font-bold text-3xl">About</h2>
                        <p className="w-1/2 text-lg font-light min-h-16">{user.bio || "No bio"}</p>
                    </div>
                    <div className="w-full min-h-20 flex flex-col items-start gap-2">
                        <h2 className="font-bold text-3xl">Recent Projects</h2>
                        <div>
                            <p className="font-light text-lg">No projects</p>
                        </div>
                    </div>
                </div>
                {newUserTip && <p>Welcome to TeamCode! We're excited to have you on board.</p>}
            </div>
        </div>
    );
}

export default Profile;