import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

// 1. Explicitly type component incoming properties
interface ButtonProps {
  content: string;
  handleInput: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  isloading?: boolean; // Optional parameter flag to prevent compilation errors if omitted
}

const Button: React.FC<ButtonProps> = ({ content, handleInput, isloading = false }) => {
  return (
    <div className="w-full">
      <button
        type="submit"
        disabled={isloading}
        className="w-full text-white bg-green-600 hover:bg-green-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-neutral-700 disabled:cursor-not-allowed focus:ring-2 focus:outline-none focus:ring-green-500 font-semibold rounded-lg text-sm px-5 py-2.5 text-center transition-all cursor-pointer shadow-md border border-transparent"
        onClick={handleInput}
      >
        {isloading ? (
          <div className="flex items-center justify-center h-5">
            <PulseLoader color="#ffffff" size={8} margin={2} />
          </div>
        ) : (
          content
        )}
      </button>
    </div>
  );
};

export default Button;