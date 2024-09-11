/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
 
interface KafkaNodeProps {
  node: any;
  onChange: (node: any) => void;
}
 
const KafkaNode: React.FC<KafkaNodeProps> = ({ node, onChange }) => {
  const [topic, setTopic] = useState(node?.data?.inputs?.topic || '');
  const [consumerId, setConsumerId] = useState(node?.data?.inputs?.consumerId || '');
 
  useEffect(() => {
    setTopic(node?.data?.inputs?.topic || '');
    setConsumerId(node?.data?.inputs?.consumerId || '');
  }, [node?.data?.inputs?.topic, node?.data?.inputs?.consumerId]);
 
  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };
 
  const handleConsumerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsumerId(event.target.value);
  };
 
  const handleUpdate = () => {
    onChange({
      ...node,
      data: {
        ...node?.data,
        inputs: { topic, consumerId }
      }
    });
  };
 
  return (
    <div className="node p-4 bg-white shadow-md rounded-lg text-black">
      <h3 className="text-lg font-bold mb-2">Kafka Node</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Topic Name
        </label>
        <input
          type="text"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter Topic Name"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Consumer ID
        </label>
        <input
          type="text"
          value={consumerId}
          onChange={handleConsumerIdChange}
          placeholder="Enter Consumer ID"
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
 
export default KafkaNode;