import { useForm, SubmitHandler } from "react-hook-form";
import useProjectStore from "../store/project";
import { useState } from "react";
import Skill from "../model/SkillModel";
import Button from "../component/Button";
import SkillList from "../component/SkillList";
import { useNavigate } from "react-router-dom";

enum ProjectLevel {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

type ProjectEditFormInput = {
    name: string;
    description: string;
    status: boolean;
    level: ProjectLevel;
    gitRepository: string;
    maxParticipantsNumber: number;
}

interface ProjectEditPopupProps {
    onClose: () => void;
    onSave: (data: ProjectEditFormInput, skillsToAdd: number[], skillsToDelete: number[]) => Promise<void>;
}

function ProjectEditForm({onClose, onSave}: ProjectEditPopupProps) {
    const { project } = useProjectStore();
    const { register, formState: {errors}, handleSubmit } = useForm<ProjectEditFormInput>();
    const [skillsToDelete, setSkillsToDelete] = useState<number[]>([]);
    const [skillsToAdd, setSkillsToAdd] = useState<Skill[]>([]);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<ProjectEditFormInput> = async (data, e) => {
        e?.preventDefault();
        const toAddIds = skillsToAdd.map(skill => skill.id);
        onSave(data, toAddIds, skillsToDelete);
    };

    const onDeleteSkill = (skillId: number) => {
        setSkillsToDelete((prev: number[]) => [...prev, skillId]);
    };

    const onAddSkill = (skills: Skill[]) => {
        setSkillsToAdd((prev: Skill[]) => [...prev, ...skills]);
    }

    if (!project) {
        navigate('/profile');
        return;
    }

    return (
        <form className="w-full h-full flex flex-col justify-around items-start font-semibold">
            <div className="w-full max-h-96 flex flex-col justify-around my-2 gap-8 
                            overflow-y-scroll scrollbar-thin ">
                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <label htmlFor="name" className="w-1/4 text-xl">Project Name:</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="text" 
                            defaultValue={project.name}
                            {...register('name', {required: true, maxLength: 20})} />
                        {errors.name?.type === 'required' && <span className="text-red-500">Username is required</span>}
                        {errors.name?.type === 'maxLength' && <span className="text-red-500">Username is too long</span>}
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <label htmlFor="description" className="w-1/4 text-xl">Description:</label>
                        <textarea className="w-1/2 text-black p-2 rounded-lg" 
                            defaultValue={project.description}
                            {...register('description', {required: true})} />
                        {errors.description?.type === 'required' && <span className="text-red-500">Description is required</span>}
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <label htmlFor="status" className="w-1/4 text-xl">Status (not accepting requests if disabled):</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="checkbox" 
                            defaultChecked={project.status}
                            {...register('status')} />
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <label htmlFor="level" className="w-1/4 text-xl">Level:</label>
                        <select className="w-1/2 text-black p-2 rounded-lg" 
                            defaultValue={project.projectLevel}
                            {...register('level')}>
                            <option value={ProjectLevel.EASY}>Easy</option>
                            <option value={ProjectLevel.MEDIUM}>Medium</option>
                            <option value={ProjectLevel.HARD}>Hard</option>
                        </select>
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <label htmlFor="gitRepository" className="w-1/4 text-xl">GitHub Repository:</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="text" 
                            defaultValue={project.gitRepository}
                            {...register('gitRepository')} />
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <label htmlFor="maxParticipantsNumber" className="w-1/4 text-xl">Max Participants Number:</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="number" 
                            defaultValue={project.maxParticipantsNumber}
                            {...register('maxParticipantsNumber', { max: 15 })} />
                        {errors.maxParticipantsNumber?.type === 'max' && <span className="text-red-500">Max possible number is 15</span>}
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-start">
                        <p className="w-1/4 text-xl">Skills:</p>
                        <SkillList className="" skills={[...project.skills, ...skillsToAdd]} isEdit={true} 
                                    onDelete={onDeleteSkill} onAdd={onAddSkill}/>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-end items-center gap-5 font-semibold">
                <Button text="Save"
                        onClick={handleSubmit(onSubmit)} 
                        className="bg-custom-blue text-xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95" />

                <Button text="Cancel"
                        onClick={onClose}
                        className="bg-custom-red text-xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95" />
            </div>
        </form>
    );
}

export default ProjectEditForm;