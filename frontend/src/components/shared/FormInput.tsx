import React from "react";

interface InputProps {
  type: string;
  name: string;
  id: string;
  value: string;
  setState: (value: string) => void;
  placeholder: string;
}

const FormInput: React.FC<InputProps> = ({
  type,
  name,
  id,
  value,
  setState,
  placeholder,
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={(e) => setState(e.target.value)}
      className="w-full px-4 py-2 bg-[#1F2937] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
      placeholder={placeholder}
      required
    />
  );
};

export default FormInput;
