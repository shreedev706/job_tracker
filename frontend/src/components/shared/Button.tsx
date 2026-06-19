import React from "react";

interface ButtonProps {
  content: string;
  handleInput: (e: React.FormEvent) => void;
  isloading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ content, handleInput, isloading }) => {
  return (
    <button
      type="submit"
      onClick={handleInput}
      disabled={isloading}
      className={`w-full py-2.5 rounded-lg font-medium text-white transition-all text-sm ${
        isloading
          ? "bg-emerald-700 cursor-not-allowed"
          : "bg-emerald-600 hover:bg-emerald-500 active:scale-95"
      }`}
    >
      {isloading ? "Processing..." : content}
    </button>
  );
};

export default Button;
