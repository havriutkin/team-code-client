import { useState } from "react";
import Button from "../component/Button";
import LoginForm from "../form/LoginForm";
import SignUpForm from "../form/SignUpForm";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import useAuthStore from "../store/auth";
import ErrorPage from "./ErrorPage";

function AuthPage() {
    const [isLoginForm, setIsLoginForm] = useState(false);
    const [isAnimationGoing, setIsAnimationGoing] = useState(false);
    const { isError } = useAuthStore();

    const handleFormChange = (target: string) => {
        if (target === "Sign Up" && isLoginForm) {
            setIsAnimationGoing(true);
            setIsLoginForm(false);
        } else if (target === "Login" && !isLoginForm) {
            setIsAnimationGoing(true);
            setIsLoginForm(true);
        }
    }

    if (isError) {
        return <ErrorPage/>
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

                <div className="w-full h-5/6 overflow-hidden">
                <AnimatePresence onExitComplete={() => setIsAnimationGoing(false)}>
                        {
                            isLoginForm && !isAnimationGoing && 
                            <motion.div key="login" className="w-full h-full"
                                initial={{ x: 500, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 500, opacity: 0 }}
                                transition={{ease: easeInOut}}>
                                <LoginForm />
                            </motion.div> 
                        }
                        {
                            !isLoginForm && !isAnimationGoing &&
                            <motion.div key="signup" className="w-full h-full"
                                initial={{x: -500, opacity: 0}}
                                animate={{x:0, opacity: 1}}
                                exit={{x:-500, opacity: 0}}
                                transition={{ease: easeInOut}}>
                                <SignUpForm />
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default AuthPage;
