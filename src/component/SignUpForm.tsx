import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../component/Button";

type SignUpFormInputs = {
    username: string;
    email: string;
    password: string;
}

function SignUpForm() {
    const { register, formState: {errors}, handleSubmit } = useForm<SignUpFormInputs>();

    const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
        console.log(data);
    }

    return (
        <form className="w-full h-full flex flex-col justify-around items-center">
            <div className="flex flex-col gap-2">
                <label>Username:</label>
                <input className="text-black p-2 rounded-lg" 
                        {...register('username', { required: true, maxLength: 20, minLength: 5})} />
                {errors.username?.type === 'required' && <span className="text-red-500">Username is required</span>}
                {errors.username?.type === 'maxLength' && <span className="text-red-500">Username is too long</span>}
                {errors.username?.type === 'minLength' && <span className="text-red-500">Username is too short</span>}
            </div>


            <div className="flex flex-col gap-2">
                <label htmlFor="email">Email:</label>
                <input className="text-black p-2 rounded-lg" type="email" 
                    {...register('email', {required: true, pattern: /^\S+@\S+\.\S+$/i})} />
                {errors.email?.type === 'required' && <span className="text-red-500">Email is required</span>}
                {errors.email?.type === 'pattern' && <span className="text-red-500">Email is not valid</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label>Password:</label>
                <input className="text-black p-2 rounded-lg" type="password" 
                    {...register('password', {required: true, minLength: 5})} />
                {errors.password?.type === 'required' && <span className="text-red-500">Password is required</span>}
                {errors.password?.type === 'minLength' && <span className="text-red-500">Password is too short</span>}
            </div>

            <Button text="Sign Up" onClick={handleSubmit(onSubmit)} 
                    className="bg-custom-green text-3xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95" />
        </form>
    )
}

export default SignUpForm;