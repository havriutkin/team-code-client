import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../component/Button";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

interface IFormInput {
  userName: string;
  email: string;
  password: string;
}

function AuthPage() {
  const navigate = useNavigate();

  const [activeTab , setActiveTab]  = useState("signin");

  const handleSignIn = () =>
  {
    setActiveTab("signin");
  }

  const handleLogIn = () =>
  {
    setActiveTab("login");
  }

  const { register, formState: {errors}, handleSubmit, reset} = useForm<IFormInput>({
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => 
    { 
      console.log(data);
      reset();
      navigate("/search");
    }

  return (
    <div className="w-screen h-screen bg-dark-bg flex justify-center items-center font-sans">
      <form className="bg-custom-dark-gray flex-col justify-center items-center w-1/2 h-5/6 rounded-lg text-white" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full h-20 text-4xl text-white flex justify-between items-center">
          <div className={`bg-${activeTab === "signin" ? "custom-blue" : "custom-light-gray"} flex-1 rounded-l-lg h-full flex items-center justify-center hover:scale-105 active:scale-95 active:text-gray-400 !important`} onClick={handleSignIn}>Sign in</div>
          <div className={`bg-${activeTab === "login" ? "custom-blue" : "custom-light-gray"} flex-1 rounded-r-lg h-full flex items-center justify-center hover:scale-105 active:scale-95 active:text-gray-400 !important`} onClick={handleLogIn}>Log in</div>
        </div>
        <div className="flex flex-col items-center gap-6 mt-3 w-full text-2xl">
          <div className="my-4 w-1/2">
            <label className="block">User Name:</label>
            <input
              className="text-gray-500 w-full px-0 py-1  rounded-lg focus:outline-none"
              {...register("userName", { required: true, minLength: 5, maxLength: 100 })}
              placeholder="user name"
            />
            {errors.userName && (
            <p role="alert" className="text-red-500">Oups, somethis wrong with User Name</p>
            )}
          </div>
          <div className="my-4 w-1/2">
            <label className="block">Email:</label>
            <input
              className="text-gray-500 w-full px-0 py-1 rounded-lg focus:outline-none"
              {...register("email", { required: true, minLength: 5, maxLength: 100, pattern: /^\S+@\S+\.\S+$/i})}
              placeholder="email@gmail.com"
            />
            {errors.email && <p className="text-red-500">Please, enter the correct email</p>}
          </div>
          <div className="my-4 w-1/2">
            <label className="block">Password:</label>
            <input type="password"
              className="text-gray-500 w-full px-0 py-1 rounded-lg focus:outline-none"
              {...register("password", { required: true, minLength: 5, maxLength: 100 })}
              placeholder="password123"
            />
          </div>
          <Button
            className="bg-custom-green border-none  text-2xl font-semibold rounded-lg w-2/6 p-4 transition-all hover:scale-105 active:scale-95 active:text-gray-400"
            text="Submit"
            onClick={()=>onSubmit}
          />
        </div>
      </form>
    </div>
  );
}

export default AuthPage;
