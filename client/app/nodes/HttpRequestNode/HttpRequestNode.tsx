/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

interface HttpRequestNodeProps {
  data: any;
  onChange: (data: any) => void;
}

const HttpRequestNode: React.FC<HttpRequestNodeProps> = ({
  data,
  onChange,
}) => {
  const [url, setUrl] = useState(data.url || "");

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    onChange({ ...data, url: newUrl, handler: "handleHttpRequestNode" });
  };

  return (
    <div className="node p-4 bg-white shadow-md rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        HTTP Request Node
      </label>
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter URL"
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
};

export default HttpRequestNode;
