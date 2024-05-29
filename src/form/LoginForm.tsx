import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../component/Button";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/user";

type LoginFormInput = {
    email: string;
    password: string;
}

function LoginForm() {
    const { register, formState: {errors}, handleSubmit, setError } = useForm<LoginFormInput>();
    const { login, isLoading } = useAuthStore();
    const { loadUser } = useUserStore();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
        try {
            await login(data.email, data.password);
            await loadUser(data.email);
            navigate('/profile');
        } catch (error: any) {
            console.error(error);
            setError("password", { type: "manual", message: "Invalid email or password. Please try again" });
        }
    }

    return (
        <form className="w-full h-full flex flex-col justify-around items-center">
            <div className="w-1/3 flex flex-col gap-2">
                <label htmlFor="email">Email:</label>
                <input className="text-black p-2 rounded-lg" type="email" 
                    {...register('email', {required: true, pattern: /^\S+@\S+\.\S+$/i})} />
                {errors.email?.type === 'required' && <span className="text-red-500">Email is required</span>}
                {errors.email?.type === 'pattern' && <span className="text-red-500">Email is not valid</span>}
            </div>

            <div className="w-1/3 flex flex-col gap-2">
                <label>Password:</label>
                <input className="text-black p-2 rounded-lg" type="password" 
                    {...register('password', {required: true, minLength: 4})} />
                {errors.password?.type === 'required' && <span className="text-red-500">Password is required</span>}
                {errors.password?.type === 'minLength' && <span className="text-red-500">Password is too short</span>}
                {errors.password?.type === 'manual' && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <Button text="Login"
                    isDisabled={isLoading} 
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)} 
                    className="bg-custom-green text-3xl p-3 font-semibold rounded-lg hover:scale-105 active:scale-95" />
        </form>
    )
}

export default LoginForm;