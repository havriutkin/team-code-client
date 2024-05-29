import { useState } from "react";
import useAuthStore from "../store/auth";
import Skill from "../model/SkillModel";


interface SkillProps {
    filterText?: string;
}

const useSkills = ({filterText = ""}: SkillProps) => {
    const { token } = useAuthStore();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [filterTextState, setFilterTextState] = useState<string>(filterText);

    const fetchSkills = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/skill`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            const filteredData = data.filter((skill: Skill) => {
                return skill.name.toLowerCase().includes(filterTextState.toLowerCase());
            });

            setSkills(filteredData);
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    };

    return { skills, fetchSkills, setFilterTextState };
}

export default useSkills;