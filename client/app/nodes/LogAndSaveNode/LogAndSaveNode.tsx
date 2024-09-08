/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface LogAndSaveNodeProps {
  data: any;
  onChange: (data: any) => void;
}

const LogAndSaveNode: React.FC<LogAndSaveNodeProps> = ({ data, onChange }) => {
  return (
    <div className="node p-4 bg-white shadow-md rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Log and Save Node
      </label>
      <p className="text-gray-500">This node logs and saves data.</p>
    </div>
  );
};

export default LogAndSaveNode;
