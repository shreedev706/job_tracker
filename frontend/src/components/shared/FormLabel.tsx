import React from "react";

// 1. Explicitly type component incoming properties
interface FormLabelProps {
  htmlFor: string;
  labelHeading: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, labelHeading }) => {
  return (
    <div>
      <label
        htmlFor={htmlFor} // ✨ Fixed: Swapped "for" to "htmlFor" to satisfy React compiler requirements
        className="block mb-1.5 text-sm font-semibold text-neutral-300 tracking-wide select-none"
      >
        {labelHeading}
      </label>
    </div>
  );
};

export default FormLabel;