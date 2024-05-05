import Button from "./Button";
import Skill from "../model/SkillModel";
import { useState, useEffect } from "react";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface SkillFormProps {
    excludedSkills?: Skill[];
    className?: string;
    onConfirm?: (skillId: number) => void;
    onCancel: () => void;
}

function SkillForm({ className, excludedSkills, onCancel }: SkillFormProps ) {
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        axios.get(`${ENDPOINT}/skill`).then((response) => {
            setSkills(response.data);
        }).catch((error) => {
            console.error("Error fetching skills:", error);
        });
    }, []);

    return (
        <div className={`w-full min-h-20 z-20 flex flex-col gap-5 p-5
                        border bg-custom-dark-gray 
                        ${className}`}>
            <div>
                <p>Search Bar</p>
            </div>

            <div className="overflow-y-scroll">
                <ul className="flex flex-wrap justify-stretch">
                    {skills.map((skill, index) => {
                        if (excludedSkills && excludedSkills.some(excludedSkill => excludedSkill.id === skill.id)) {
                            return;
                        }
                        return (
                            <li key={index} className="flex">
                                <div className="flex gap-2 items-center bg-custom-blue min-w-10 min-h-5 px-3 rounded-xl
                                                transition-all hover:scale-110">
                                    <p className="">
                                        {skill.name}
                                    </p>
                                </div>
                            </li>
                        );
                    })
                    }
                </ul>
            </div>

            <div className="w-full flex justify-end items-center gap-3">
                <Button text="Add" 
                        onClick={() => {}}
                        className="p-2 rounded-lg bg-custom-blue transition-all hover:scale-105 active:scale-95"/>
                <Button text="Cancel"
                        onClick={onCancel}
                        className="p-2 rounded-lg bg-custom-blue transition-all hover:scale-105 active:scale-95"/>
            </div>
        </div>
    );
}

export default SkillForm;