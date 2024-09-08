/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

interface HttpRequestNodeProps {
  data: any;
  onChange: (data: any) => void;
}

const HttpRequestNode: React.FC<HttpRequestNodeProps> = ({
  data,
  onChange,
}) => {
  const [url, setUrl] = useState(data.url || "");

  useEffect(() => {
    setUrl(data.url || "");
  }, [data.url]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
  };

  const handleUpdate = () => {
    onChange({ ...data, url, handler: "handleHttpRequestNode" });
  };

  return (
    <div className="node p-4 bg-white shadow-md rounded-lg text-black">
      <h3 className="text-lg font-bold mb-2">HTTP Request Node</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter URL"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update
      </button>
    </div>
  );
};

export default HttpRequestNode;
