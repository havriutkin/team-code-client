import User from "../model/UserModel";
import Button from "./Button";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface SkillListProps {
    user: User;
    className?: string;
    closeCircle: boolean;
    onClickCloseCircle: () => void;
}

function SkillList({ user={} as User, className, closeCircle=false, onClickCloseCircle}: SkillListProps){
    onClickCloseCircle: () => {"delete skill"}
    return(
        <div className="my-4">
            { user.skills && user.skills.length > 0 ?
                <ul className="w-full h-full flex flex-wrap justify-stretch items-start gap-4">
                    {user.skills && user.skills.map((skill, index) => (
                        <li key={index} className="flex relative">{
                            <div className="relative">
                                <Button
                                    text={skill.name}
                                    onClick={() => {}}
                                    className={`relative z-10 bg-custom-blue ${closeCircle ? "px-4 pr-5" : "px-4"} ${className}`} // Fix the conditional operator syntax
                                />
                                {closeCircle ? 
                                    <IoIosCloseCircleOutline className="absolute top-0 right-0 w-auto transform translate-x-0 translate-y-1 pl-1 text-red-500 text-1xl z-20 cursor-pointer"
                                    onClick={onClickCloseCircle }/> // Add absolute and z-20 to the icon
                                    : <></>
                                }
                            </div>}
                        </li>
                    ))}
                </ul>
                : <p>No skills</p>
            }
        </div>
    );
}

export default SkillList;
