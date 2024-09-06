/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported

const socket = io("http://localhost:4000");

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    socket.emit("getFlow");
    socket.on("flowConfig", (config: any[]) => {
      const newNodes = config.map((node) => ({
        id: node.id,
        type: "default",
        position: { x: 0, y: 0 },
        data: { label: node.type },
      }));
      const newEdges = config
        .filter((node) => node.next)
        .map((node) => ({
          id: `${node.id}-${node.next}`,
          source: node.id,
          target: node.next,
        }));
      setNodes(newNodes);
      setEdges(newEdges);
    });

    socket.on("flowExecuted", (executedFlow: any[]) => {
      setOutput(JSON.stringify(executedFlow, null, 2));
    });
  }, []);

  const addNode = (type: string) => {
    const id = uuidv4();
    const newNode = {
      id,
      type: "default",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: type },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const deployFlow = () => {
    socket.emit(
      "deployFlow",
      nodes.map((node) => ({
        id: node.id,
        type: node.data.label,
        next: edges.find((edge) => edge.source === node.id)?.target || null,
      }))
    );
  };

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Flow Based Events</h1>
        <button
          onClick={deployFlow}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Deploy Flow
        </button>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700 text-white flex flex-col">
          {/* Node Buttons Section */}
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold mb-4">Nodes</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => addNode("HTTP Request Node")}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                HTTP Request Node
              </button>
              <button
                onClick={() => addNode("Compile JSON Node")}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                Compile JSON Node
              </button>
              <button
                onClick={() => addNode("Log and Save Node")}
                className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
              >
                Log and Save Node
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-grow flex flex-col">
            <h2 className="text-xl font-bold mb-2">Output</h2>
            <div className="flex-grow overflow-y-auto">
              <pre className="bg-white text-black p-4 whitespace-pre-wrap break-words rounded h-full">
                {output}
              </pre>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 p-4">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="w-full h-full bg-white border border-gray-300"
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default App;
