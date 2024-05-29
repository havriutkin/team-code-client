import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingProps {
    size: string;
    className?: string;
}

function Loading({ size, className }: LoadingProps) {

    return(
        <motion.div 
            animate={{
                rotate: [0, 90, 180, 270, 360],
            }} 
            transition={{
                repeat: Infinity,
                repeatType: "loop",
            }}>

            <AiOutlineLoading3Quarters className={`text-${size} text-white ${className}`}/>
                
        </motion.div>
    );
}

export default Loading;
