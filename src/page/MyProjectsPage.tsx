import { motion } from "framer-motion";
import SideBar from "../component/Sidebar";
import useProjectStore from "../store/project";
import useAuthStore from "../store/auth";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import ProjectList from "../component/ProjectList";

function MyProjectsPage() {
    const { projects, isLoading, isError } = useProjectStore();
    const { principal } = useAuthStore();

    if (isLoading) {
        return <LoadingPage />
    }

    if (!principal || isError) {
        return <ErrorPage />
    } 

    return (
        <div className="w-screen h-screen overflow-y-scroll scrollbar-thin scrollbar-track-custom-blue bg-dark-bg font-sans text-white flex justify-center">
                <div className="w-1/12">
                    <SideBar />
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-3/4 h-full py-5 flex flex-col justify-start items-start gap-10">
                    <h1 className="text-4xl font-extrabold mb-5">My Projects</h1>

                    <div className="w-full">
                        <h2 className="text-3xl font-bold mb-3">Owned Projects</h2>
                        <ProjectList projects={projects.filter(project => project.owner.id === principal.id)} />
                    </div>

                    
                    <div className="w-full">
                        <h2 className="text-3xl font-bold mb-3">Participating Projects</h2>
                        <ProjectList projects={projects.filter(project => project.owner.id !== principal.id)} />
                    </div>

                </motion.div>
            </div>
    );
}

export default MyProjectsPage;