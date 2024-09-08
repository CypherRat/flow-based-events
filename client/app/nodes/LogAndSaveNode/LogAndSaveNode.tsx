/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface LogAndSaveNodeProps {
  data: any;
}

const LogAndSaveNode: React.FC<LogAndSaveNodeProps> = ({ data }) => {
  return (
    <div className="node p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold mb-2">Log and Save Node</h3>
      <p className="text-gray-500 mb-4">This node logs and saves data.</p>
    </div>
  );
};

export default LogAndSaveNode;
