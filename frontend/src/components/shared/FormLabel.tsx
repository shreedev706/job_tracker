import React from "react";

interface LabelProps {
  htmlFor: string;
  labelHeading: string;
}

const FormLabel: React.FC<LabelProps> = ({ htmlFor, labelHeading }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 text-sm font-medium text-gray-300"
    >
      {labelHeading}
    </label>
  );
};

export default FormLabel;