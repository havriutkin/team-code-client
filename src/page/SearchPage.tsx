import { motion } from "framer-motion";
import SideBar from "../component/Sidebar";
import useProjectStore from "../store/project";
import ProjectList from "../component/ProjectList";
import SearchBar from "../component/SearchBar";
import Button from "../component/Button";
import { FaAngleDown } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ProjectFilter from "../model/ProjectFilter";
import ErrorPage from "./ErrorPage";
import Loading from "../component/Loading";
import Skill from "../model/SkillModel";
import SkillForm from "../form/SkillForm";
import { CiMenuBurger } from "react-icons/ci";

function SearchPage() {
    const { projects, loadProjectsByFilter, isLoading, isError } = useProjectStore();
    const [isLevelsDisplayed, setIsLevelsDisplayed] = useState<boolean>(false);
    const [isSkillsDisplayed, setIsSkillsDisplayed] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [level, setLevel] = useState<string>("");
    const [skills, setSkills] = useState<Skill[]>([]);
    const levelRef = useRef<HTMLDivElement>(null);
    const skillRef = useRef<HTMLDivElement>(null);

    const handleChangeName = (name: string) => {
        setName(name);
    }

    useEffect(() => {
        const rawSkills = skills.map(skill => skill.name);
        const projectFilter: ProjectFilter = {
            name: name === "" ? null : name,
            projectLevel: level === "" ? null : level.toUpperCase(),
            skills: rawSkills.length === 0 ? null : rawSkills
        }

        loadProjectsByFilter(projectFilter);
    }, [name, level, skills]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
                setIsLevelsDisplayed(false);
            }

            if (skillRef.current && !skillRef.current.contains(event.target as Node)) {
                setIsSkillsDisplayed(false);
            }
        };

        if (isLevelsDisplayed || isSkillsDisplayed) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLevelsDisplayed, isSkillsDisplayed]);

    if (isError) {
        return <ErrorPage />;
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
                <h1 className="text-4xl font-extrabold mb-5">Search for projects</h1>

                <div className="w-1/2 h-1/4 flex flex-col justify-around">
                    <div className="w-full flex items-center justify-start gap-5">
                        <SearchBar className="w-1/2" onChange={handleChangeName} />
                        <Button className="w-1/2 h-full rounded-lg text-xl bg-custom-blue transition-all
                                        hover:scale-105 active:scale-95" text="Create Project" onClick={() => { }} />
                    </div>

                    <div className="w-2/3 flex justify-between text-sm gap-1 relative">
                        <div className="w-1/2 h-full flex items-center p-1 text-center border border-custom-light-gray cursor-pointer"
                            onClick={() => { setIsLevelsDisplayed(prev => !prev) }}>
                            <h3 className="w-11/12">{level === "" ? "Level" : level} </h3>
                            {
                                isLevelsDisplayed ? 
                                <CiMenuBurger className="w-1/12" />
                                : 
                                <FaAngleDown className="w-1/12" /> 
                            }
                        </div>

                        <div className="w-1/2 h-full flex items-center p-1 text-center border border-custom-light-gray cursor-pointer"
                            onClick={() => {setIsSkillsDisplayed(prev => !prev)}}>
                            <h3 className="w-11/12">{skills.length === 0 ? "Skills" : "Skills*"}</h3>
                            {
                                isSkillsDisplayed ? 
                                <CiMenuBurger className="w-1/12" />
                                : 
                                <FaAngleDown className="w-1/12" /> 
                            }
                        </div>

                        {
                            isLevelsDisplayed &&
                            <div className="absolute left-0 top-full mt-2 z-20 bg-custom-dark-gray w-40 p-2"
                                ref={levelRef}>
                                <Button className={`w-full h-1/4 text-sm transition-all
                                                hover:scale-105 active:scale-95 ${level === "" && "bg-custom-blue"}`}
                                                text="All" onClick={() => setLevel("")} />
                                <Button className={`w-full h-1/4 text-sm transition-all
                                                hover:scale-105 active:scale-95 ${level === "Easy" && "bg-custom-blue"}`} 
                                                text="Easy" onClick={() => setLevel("Easy")} />
                                <Button className={`w-full h-1/4 text-sm transition-all
                                                hover:scale-105 active:scale-95 ${level === "Medium" && "bg-custom-blue"}`}
                                                text="Medium" onClick={() => setLevel("Medium")} />
                                <Button className={`w-full h-1/4 text-sm transition-all
                                                hover:scale-105 active:scale-95 ${level === "Hard" && "bg-custom-blue"}`} 
                                                text="Hard" onClick={() => setLevel("Hard")} />
                            </div>
                        }

                        {
                            isSkillsDisplayed &&
                            <div className="absolute right-0 top-full mt-2 z-20 bg-custom-dark-gray w-40"
                                ref={skillRef}>
                                <SkillForm 
                                        pinnedSkills={skills}
                                        onConfirm={(newSkills: Skill[]) => {setSkills(newSkills); setIsSkillsDisplayed(false);}}
                                        onCancel={() => {setIsSkillsDisplayed(false)}}/>
                            </div>
                        }
                        
                    </div>
                </div>

                <div className="w-full h-full min-h-96">
                    {
                        isLoading ? <Loading size="6xl" /> :
                            <ProjectList className="w-full" projects={projects} />
                    }
                </div>
            </motion.div>
        </div>
    );
}

export default SearchPage;
