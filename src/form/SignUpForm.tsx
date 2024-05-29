import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../component/Button";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/user";
import axios from "axios";
import { useState } from "react";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

type SignUpFormInputs = {
    username: string;
    email: string;
    password: string;
}

function SignUpForm() {
    const { register, formState: {errors}, handleSubmit, setError, clearErrors} = useForm<SignUpFormInputs>();
    const { register: signUp, isLoading } = useAuthStore();
    const { loadUser } = useUserStore();
    const navigate = useNavigate();


    const checkEmailExists = async (email: string) => {
        const response = await axios.get(`${ENDPOINT}/user/exists/email/${email}`);
        if (response.status === 200) {
            setError("email", { type: "manual", message: "Email is already in use" });
        } else { 
            clearErrors("email");
        }

    };

    const checkUsernameExists = async (username: string) => {
            const response = await axios.get(`${ENDPOINT}/user/exists/name/${username}`);
            if (response.status === 200) {
                setError("username", { type: "manual", message: "Username is already in use" });    
            } else {
                clearErrors("username");
            }

    };

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        try {
            await signUp(data.username, data.email, data.password);
            await loadUser(data.email);
            navigate('/profile', { state: { newUserTip: true } });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form className="w-full h-full flex flex-col justify-around items-center">
            <div className=" w-1/3 flex flex-col gap-2">
                <label>Username:</label>
                <input className="text-black p-2 rounded-lg" 
                        {...register('username', { required: true, maxLength: 20, minLength: 5})}
                        onBlur={(e) => checkUsernameExists(e.target.value)} />
                {errors.username?.type === 'required' && <span className="text-red-500">Username is required</span>}
                {errors.username?.type === 'maxLength' && <span className="text-red-500">Username is too long</span>}
                {errors.username?.type === 'minLength' && <span className="text-red-500">Username is too short</span>}
                {errors.username?.type === 'manual' && <span className="text-red-500">{errors.username.message}</span>}
            </div>

            <div className=" w-1/3 flex flex-col gap-2">
                <label htmlFor="email">Email:</label>
                <input className="text-black p-2 rounded-lg" type="email" 
                    {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/i })}
                    onBlur={(e) => checkEmailExists(e.target.value)} />
                {errors.email?.type === 'required' && <span className="text-red-500">Email is required</span>}
                {errors.email?.type === 'pattern' && <span className="text-red-500">Email is not valid</span>}
                {errors.email?.type === 'manual' && <span className="text-red-500">{errors.email.message}</span>}
            </div>

            <div className="w-1/3 flex flex-col gap-2">
                <label>Password:</label>
                <input className="text-black p-2 rounded-lg" type="password" 
                    {...register('password', {required: true, minLength: 5, pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*\W)(?!.*\s).{5,}$/})} />
                {errors.password?.type === 'required' && <span className="text-red-500">Password is required</span>}
                {errors.password?.type === 'minLength' && <span className="text-red-500">Password is too short</span>}
                {errors.password?.type === 'pattern' && <span className="text-red-500">Password must contain at least one number, one uppercase letter, and one symbol</span>}
            </div>

            <Button text="Sign Up"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)} 
                    className="bg-custom-green text-3xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95" />
        </form>
    )
}

export default SignUpForm;