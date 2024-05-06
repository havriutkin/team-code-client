import Button from "./Button";
import Skill from "../model/SkillModel";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import useSkills from "../hooks/useSkills";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

interface SkillFormProps {
    excludedSkills?: Skill[];
    className?: string;
    onConfirm?: (skills: Skill[]) => void;
    onCancel: () => void;
}

function SkillForm({ className, excludedSkills, onCancel, onConfirm }: SkillFormProps ) {
    const [searchText, setSearchText] = useState("");
    const { skills, fetchSkills, setFilterTextState } = useSkills({filterText: searchText});
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

    useEffect(() => {
        setFilterTextState(searchText);
        fetchSkills();
    }, [searchText, setFilterTextState, fetchSkills]);

    const handleSelectSkill = (skill: Skill) => {
        setSelectedSkills(prev => [...prev, skill]);
    };

    const handleUnselectSkill = (skill: Skill) => {
        setSelectedSkills(prev => prev.filter(selectedSkill => selectedSkill.id !== skill.id));
    }

    const handleAddButtonClick = () => {
        if (onConfirm) {
            onConfirm(selectedSkills);
        }
    }

    return (
        <div className={`w-full min-h-20 z-20 flex flex-col gap-5 p-5
                        border bg-custom-dark-gray 
                        ${className}`}>
            <div>
                <SearchBar className="w-2/3 max-h-10 bg-custom-light-gray" onChange={setSearchText}/>
            </div>

            <div className="">
                <ul className="max-h-40 overflow-y-scroll flex flex-wrap justify-stretch gap-3 p-3">
                    {selectedSkills && selectedSkills.map((skill, index) => {
                        return (
                            <li key={index} className="flex">
                                <div className="flex gap-2 items-center bg-custom-blue min-w-10 min-h-5 px-3 rounded-xl
                                                transition-all hover:scale-105">
                                    <p className="">
                                        {skill.name}
                                    </p>
                                    <IoIosCloseCircleOutline 
                                        className="h-full text-red-500 text-xl cursor-pointer
                                                transition-all hover:scale-110 active:scale-95"
                                        onClick={() => handleUnselectSkill(skill)}/>
                                </div>
                            </li>
                        );
                    })}

                    {skills.slice(0, 20).map((skill, index) => {
                        if (excludedSkills && excludedSkills.some(excludedSkill => excludedSkill.id === skill.id)) {
                            return;
                        }

                        if (selectedSkills.some(selectedSkill => selectedSkill.id === skill.id)) {
                            return;
                        }

                        return (
                            <li key={index} className="flex">
                                <div className="flex gap-2 items-center bg-custom-blue min-w-10 min-h-5 px-3 rounded-xl
                                                transition-all hover:scale-105">
                                    <p className="">
                                        {skill.name}
                                    </p>
                                    <IoIosAddCircleOutline 
                                        className="h-full text-green-500 text-xl cursor-pointer
                                                transition-all hover:scale-110 active:scale-95"
                                        onClick={() => handleSelectSkill(skill)}/>
                                </div>
                            </li>
                        );
                    })
                    }
                </ul>
            </div>

            <div className="w-full flex justify-end items-center gap-3">
                <Button text="Add" 
                        onClick={handleAddButtonClick}
                        className="p-2 rounded-lg bg-custom-blue transition-all hover:scale-105 active:scale-95"/>
                <Button text="Cancel"
                        onClick={onCancel}
                        className="p-2 rounded-lg transition-all hover:scale-105 active:scale-95"/>
            </div>
        </div>
    );
}

export default SkillForm;