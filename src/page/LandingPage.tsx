import TeamCodeLogo from '/TeamCodeLogo.png'
import Button from '../component/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
    const navigate = useNavigate();

    const handleButtonClick = () => { 
        navigate('/auth');
    }

    return (
        <div className="w-screen h-screen bg-dark-bg font-sans text-white p-10 flex flex-col justify-start gap-10">
            <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="h-1/6 flex justify-between items-start"
            >
                <h1 className="text-5xl font-extrabold">TeamCode</h1>
                <Button text="Login"
                    className='border text-2xl font-semibold rounded-lg w-1/12 h-1/2 text-center
                            transition-all hover:scale-105 active:scale-95 active:text-gray-400'
                    onClick={handleButtonClick} />
            </motion.div>

            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className='h-2/3 flex justify-between'
            >
                <div className='w-1/2 flex flex-col justify-evenly'>
                    <h2 className='text-4xl font-bold'>Create And Find Exciting Projects!</h2>
                    <p className='text-2xl font-light'>
                        Team Code connects you with talented individuals looking to collaborate on exciting ventures.
                        Whether you're a coding whiz seeking a design guru, or a marketing maestro needing a tech 
                        partner, we've got you covered.
                    </p>
                    <div className='w-full flex justify-center items-center'>
                    <Button text="Get Started"
                            className='bg-custom-blue text-3xl font-extrabold rounded-lg p-8 w-1/3
                                     transition-all hover:scale-105 
                                     active:scale-95 active:bg-opacity-80 active:text-gray-400' 
                            onClick={handleButtonClick} />
                    </div>
                </div>
                <div className='w-1/2 flex justify-center items-center'>
                    <motion.img 
                        src={TeamCodeLogo}
                        width={500}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </motion.div>

        </div>
    )
}

export default LandingPage;