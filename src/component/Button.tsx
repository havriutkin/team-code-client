interface ButtonProps {
    text: string;
    className?: string;
    isDisabled?: boolean;
    onClick: () => void;
}

function Button({ text, className, isDisabled=false, onClick }: ButtonProps) {
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