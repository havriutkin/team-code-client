interface ButtonProps {
    text: string;
    className?: string;
    onClick: () => void;
}

function Button({ text, className, onClick }: ButtonProps) {
    return (
        <button
            className={className}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;