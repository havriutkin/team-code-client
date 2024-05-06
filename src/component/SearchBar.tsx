import { useState } from "react";
import {IoIosSearch} from "react-icons/io";

interface SearchBarProps {
    className?: string;
    onChange: (searchText: string) => void;
}

function SearchBar({ className, onChange }: SearchBarProps) {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        onChange(e.target.value);
    }

    return (
        <div className={`w-full p-2 rounded-xl flex justify-center items-center gap-3 ${className}`}>
            <IoIosSearch className="text-2xl cursor-pointer"/>
            <input className="w-full p-2 rounded-lg bg-custom-light-gray" type="text" 
                value={searchText}
                onChange={handleSearch}/>
        </div>
    );
}

export default SearchBar;