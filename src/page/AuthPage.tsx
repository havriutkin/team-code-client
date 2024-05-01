import { useState } from "react";
import Button from "../component/Button";
import LoginForm from "../component/LoginForm";
import SignUpForm from "../component/SignUpForm";
import { motion } from "framer-motion";

function AuthPage() {
    const [isLoginForm, setIsLoginForm] = useState(false);

    const handleFormChange = (target: string) => {
        if (target === "Sign Up" && isLoginForm) {
            setIsLoginForm(false);
        } else if (target === "Login" && !isLoginForm) {
            setIsLoginForm(true);
        }
    }

    return (
        <div className="w-screen h-screen bg-dark-bg flex justify-center items-center font-sans text-white">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-1/2 h-5/6 bg-custom-dark-gray flex flex-col justify-start items-center rounded-lg">
                <div className="w-full h-1/6 flex justify-center items-center text-3xl font-extrabold">
                    <Button text="Sign Up" onClick={() => handleFormChange("Sign Up")} 
                        className={`w-1/2 h-full rounded-l-lg rounded-b-none transition-all 
                                    ${isLoginForm ? 'bg-custom-light-gray' : 'bg-custom-blue'}`}/>
                    <Button text="Login" onClick={() => handleFormChange("Login")}
                        className={`w-1/2 h-full rounded-r-lg rounded-b-none transition-all 
                                    ${isLoginForm ? 'bg-custom-blue' : 'bg-custom-light-gray'}`}/>
                </div>
                <div className="w-full h-5/6">
                    {isLoginForm ? <LoginForm /> : <SignUpForm />}
                </div>
            </motion.div>
        </div>
    );
}

export default AuthPage;
