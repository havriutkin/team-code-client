import { BiErrorCircle } from "react-icons/bi";

function ErrorPage() {
    return (
        <div className=" bg-dark-bg w-screen h-screen flex flex-col justify-center items-center">
            <BiErrorCircle className=" text-9xl text-red-500"/>
            <h3 className=" text-red-500">Ups, something went wrong</h3>
        </div>
    );
}

export default ErrorPage;
