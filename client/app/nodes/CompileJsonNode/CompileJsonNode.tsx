/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface CompileJsonNodeProps {
  data: any;
  onChange: (data: any) => void;
}

const CompileJsonNode: React.FC<CompileJsonNodeProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="node p-4 bg-white shadow-md rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Compile JSON Node
      </label>
      <p className="text-gray-500">This node compiles JSON data.</p>
    </div>
  );
};

export default CompileJsonNode;
