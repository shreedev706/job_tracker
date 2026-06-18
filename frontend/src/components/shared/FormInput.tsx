import React from "react";

// 1. Explicitly type component incoming properties
interface FormInputProps {
  type: "text" | "email" | "password" | "number" | "search"; // Restricts input type variants safely
  name: string;
  id: string;
  placeholder: string;
  value: string;
  setState: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  id,
  placeholder,
  value,
  setState,
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
        required
        className="w-full p-2.5 rounded-lg text-sm bg-neutral-800 border border-neutral-700 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
      />
    </div>
  );
};

export default FormInput;