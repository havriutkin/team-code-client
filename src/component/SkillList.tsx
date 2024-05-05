import Skill from "../model/SkillModel";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import SkillForm from "./SkillForm";
import { useState } from "react";

interface SkillListProps {
    skills: Skill[];
    className?: string;
    isEdit: boolean;
    onDelete?: (skillId: number) => void;
    onAdd?: (skillId: number) => void;
}

function SkillList({ skills, className, isEdit=false, onDelete, onAdd}: SkillListProps){
    const [isAdding, setIsAdding] = useState(false);

    const handleAddButtonClick = () => {
        setIsAdding(prev => !prev);
    }

    return(
        <div className={className}>
            { skills && skills.length > 0 ?
                <ul className="w-full h-full flex flex-wrap justify-stretch items-start gap-4">
                    {skills.map((skill, index) => (
                        <li key={index} className="flex">
                            <div className="flex gap-2 items-center bg-custom-blue min-w-10 min-h-5 px-3 rounded-xl
                                            transition-all hover:scale-110">
                                <p className="">
                                    {skill.name}
                                </p>
                                {isEdit && onDelete ? 
                                    <IoIosCloseCircleOutline 
                                        className="h-full text-red-500 text-xl cursor-pointer
                                                transition-all hover:scale-110 active:scale-95"
                                        onClick={() => onDelete(skill.id)}/> 
                                    : <></>
                                }
                            </div>
                        </li>
                    ))}
                    <li>
                        {isEdit && onAdd ?
                            <div className="h-full flex justify-center items-center min-w-10 px-3 rounded-xl">
                                <IoIosAddCircleOutline 
                                    className="text-green-500 text-2xl cursor-pointer
                                            transition-all hover:scale-110 active:scale-95"
                                    onClick={handleAddButtonClick}/>
                            </div>
                            : <></>
                        }
                        {isAdding ? 
                            <SkillForm className="static  w-96" 
                                onCancel={() => setIsAdding(false)}/> 
                            : <></>
                        }
                    </li> 
                </ul>
                : <p>No skills</p>
            }
        </div>
    );
}

export default SkillList;
