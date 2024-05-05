import { useForm, SubmitHandler } from "react-hook-form";
import Button from "./Button";
import useUserStore from "../store/user";
import User from "../model/UserModel";
import SkillList from "./SkillList";

enum Experience {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCE = "ADVANCE"
}

type ProfileEditFormInput = {
    username: string;
    email: string;
    github: string;
    experience: Experience;
    bio: string;
    // skills: string[];
}

interface ProfileEditFormProps {
    onClose: () => void;
    onSave: (data: ProfileEditFormInput) => void;
}

function ProfileEditForm({ onClose, onSave }: ProfileEditFormProps){
    const { register, formState: {errors}, handleSubmit } = useForm<ProfileEditFormInput>();
    const {user, updateUser} = useUserStore();

    const onSubmit: SubmitHandler<ProfileEditFormInput> = async (data, e) => {
        e?.preventDefault();
        const userData: User = {
            id: user.id,
            name: data.username,
            email: data.email,
            experience: data.experience,
            bio: data.bio,
            githubLink: data.github,
            skills: [],
        };
        updateUser(userData).then(() => {
            onSave(data);
        }).catch((error : Error) => {    
            console.error("Error updating user:", error);
        });
    };

    return (
        <form className="w-full h-full flex flex-col justify-around items-start font-semibold">
            <div className="w-full max-h-96 flex flex-col justify-around my-2 gap-8 
                            overflow-y-scroll scrollbar-thin ">
                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-center">
                        <label htmlFor="username" className="w-1/4 text-xl">Username:</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="text" 
                            defaultValue={user.name}
                            {...register('username', {required: true})} />
                        {errors.username?.type === 'required' && <span className="text-red-500">Username is required</span>}
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-center">
                        <label htmlFor="email" className="w-1/4 text-xl">Email:</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="email" 
                            defaultValue={user.email}
                            {...register('email', {required: true, pattern: /^\S+@\S+\.\S+$/i})} />
                        {errors.email?.type === 'required' && <span className="text-red-500">Email is required</span>}
                        {errors.email?.type === 'pattern' && <span className="text-red-500">Email is not valid</span>}
                    </div>
                </div>   

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-center">
                        <label htmlFor="github" className="w-1/4 text-xl">GitHub:</label>
                        <input className="w-1/2 text-black p-2 rounded-lg" type="text" 
                            defaultValue={user.githubLink}
                            {...register('github')} />
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-center">
                        <label htmlFor="experience" className="w-1/4 text-xl">Experience:</label>
                        <select className="w-1/2 text-black p-2 rounded-lg" 
                            defaultValue={user.experience}
                            {...register('experience', {required: true})}>
                            <option value={Experience.BEGINNER}>Beginner</option>
                            <option value={Experience.INTERMEDIATE}>Intermediate</option>
                            <option value={Experience.ADVANCE}>Advanced</option>
                        </select>
                        {errors.experience?.type === 'required' && <span className="text-red-500">Experience is required</span>}
                    </div>
                </div>

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-center">
                        <label htmlFor="bio" className="w-1/4 text-xl">Bio:</label>
                        <textarea className="w-1/2 max-h-14 text-black p-2 rounded-lg" 
                            defaultValue={user.bio}
                            {...register('bio')} />
                    </div>
                </div> 

                <div className="w-full min-h-20 p-1 flex flex-col justify-between items-center pb-5 border-b-2">
                    <div className="w-full flex justify-start items-center">
                        <p className="w-1/4 text-xl">Skills:</p>
                        <SkillList className="" skills={user.skills} isEdit={true} 
                                    onDelete={() => {}} onAdd={() => {}}/>
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

export default ProfileEditForm;