/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface CompileJsonNodeProps {}

const CompileJsonNode: React.FC<CompileJsonNodeProps> = () => {
  return (
    <div className="node p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold mb-2">Compile JSON Node</h3>
      <p className="text-gray-500 mb-4">This node compiles JSON data.</p>
    </div>
  );
};

export default CompileJsonNode;
