import { IoIosNotificationsOutline } from "react-icons/io";
import { GoProjectRoadmap } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { BsPersonCircle } from "react-icons/bs";
import TeamCodeLogo from '/TeamCodeLogo.png'

function SideBar() {
  return (
    <div className="w-1/12 h-screen left-0 fixed bg-custom-light-gray rounded-r-3xl">
        <div className="w-full h-1/6 bg-custom-blue flex justify-center items-center 
                     rounded-tr-3xl">
            <img src={TeamCodeLogo} alt="TeamCodeLogo" className="w-1/2 h-1/2"/>
        </div>
        <div className="w-full h-4/6 flex flex-col justify-end items-center">
            <IoIosNotificationsOutline className="m-5 text-4xl hover:scale-110"/>
            <GoProjectRoadmap className="m-5 text-4xl hover:scale-110"/>
            <CiSearch className="m-5 text-4xl hover:scale-110"/>
        </div>
        <div className="w-full h-1/6 border-t-2 border-white flex justify-center items-center">
            <BsPersonCircle className="text-6xl"/>
        </div>
    </div>
  );
}

export default SideBar;