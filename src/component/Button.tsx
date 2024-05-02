import Loading from "./Loading";

interface ButtonProps {
    text: string;
    className?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    onClick: () => void;
}

function Button({ text, className, isDisabled=false, isLoading=false, onClick }: ButtonProps) {
    if(isLoading) {
        return (
            <button
            disabled={true}
            className={className}
            onClick={onClick}
        >
            <Loading size="xl"/>
        </button>
        );
    }
    
    return (
        <button
            disabled={isDisabled}
            className={className}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;