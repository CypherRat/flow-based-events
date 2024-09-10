/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faBox,
  faFileAlt,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

import HttpRequestNode from "./nodes/HttpRequestNode/HttpRequestNode";
import CompileJsonNode from "./nodes/CompileJsonNode/CompileJsonNode";
import LogAndSaveNode from "./nodes/LogAndSaveNode/LogAndSaveNode";
import Sidebar from "./components/Sidebar";

const socket = io("http://localhost:4000");

const nodeTypes = {
  httpRequest: HttpRequestNode,
  compileJson: CompileJsonNode,
  logAndSave: LogAndSaveNode,
};

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [output, setOutput] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFlowConfig = (config: any[]) => {
      try {
        const newNodes = config.map((node) => ({
          id: node.id,
          type: node.type,
          position: { x: 0, y: 0 },
          data: { label: node.type, ...node.data },
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
      } catch (error) {
        console.error("Error processing flow config:", error);
      }
    };

    const handleFlowExecuted = (executedFlow: any[]) => {
      try {
        setOutput(executedFlow);
      } catch (error) {
        console.error("Error processing flow execution:", error);
      }
    };

    socket.emit("getFlow");

    socket.on("flowConfig", handleFlowConfig);
    socket.on("flowExecuted", handleFlowExecuted);

    return () => {
      socket.off("flowConfig", handleFlowConfig);
      socket.off("flowExecuted", handleFlowExecuted);
    };
  }, []);

  const addNode = (type: string) => {
    const id = uuidv4();
    const newNode = {
      id,
      type,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: type, inputs: {}, handler: getHandlerType(type) },
    };
    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
  };

  const handleNodeChange = (updatedData: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedData.id ? updatedData : node))
    );
  };

  const getHandlerType = (type: string) => {
    switch (type) {
      case "httpRequest":
        return "httpRequestHandler";
      case "compileJson":
        return "compileJsonHandler";
      case "logAndSave":
        return "logAndSaveHandler";
      default:
        return "";
    }
  };

  const deployFlow = () => {
    socket.emit(
      "deployFlow",
      nodes.map((node) => ({
        id: node.id,
        type: node.data.label,
        next: edges.find((edge) => edge.source === node.id)?.target || null,
        data: node.data,
      }))
    );
  };

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };

  const closeSidebar = () => {
    setSelectedNode(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Accordion = ({
    title,
    children,
    isParent = false,
  }: {
    title: string;
    isParent?: boolean;
    children: React.ReactNode;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          className={`w-full text-left flex items-center justify-between p-3 bg-gray-700 text-white ${
            !isParent && "rounded-lg"
          } focus:outline-none`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <FontAwesomeIcon
              icon={isOpen ? faChevronUp : faChevronDown}
              className="mr-2"
            />
            {title}
          </span>
        </button>
        {isOpen && (
          <div
            className={`${
              isParent ? "bg-gray-600" : "pb-0"
            } p-2 flex flex-col gap-2`}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  const OutputAccordion = () => {
    const formatContent = (content: any) => {
      try {
        return typeof content === "object"
          ? JSON.stringify(content, null, 2)
          : content;
      } catch {
        return content;
      }
    };

    return (
      <div className="overflow-y-auto h-full bg-gray-800 rounded-lg text-white flex flex-col gap-2 scrollbar-custom">
        {output.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Deploy to Read Output
          </div>
        ) : (
          output.map((node: any) => (
            <Accordion key={node.id} title={`Node: ${node.type}`} isParent>
              {node.input && (
                <Accordion title="Input">
                  <pre className="whitespace-pre-wrap max-h-[250px] overflow-y-auto bg-gray-700 p-2 rounded-lg scrollbar-custom">
                    {formatContent(node.input)}
                  </pre>
                </Accordion>
              )}
              {node.output && (
                <Accordion title="Output">
                  <pre className="whitespace-pre-wrap max-h-[250px] overflow-y-auto bg-gray-700 p-2 rounded-lg scrollbar-custom">
                    {formatContent(node.output)}
                  </pre>
                </Accordion>
              )}
            </Accordion>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold">Flow Based Events</h1>
        <button
          onClick={deployFlow}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Deploy Flow
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-gray-900 p-4 border-r border-gray-700 text-white flex flex-col">
          {/* Node Buttons Section */}
          <div className="flex flex-col mb-6">
            <h2 className="text-xl font-semibold mb-4">Nodes</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => addNode("httpRequest")}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                <FontAwesomeIcon icon={faBox} className="mr-2" />
                HTTP Request Node
              </button>
              <button
                onClick={() => addNode("compileJson")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Compile JSON Node
              </button>
              <button
                onClick={() => addNode("logAndSave")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                <FontAwesomeIcon icon={faCode} className="mr-2" />
                Log and Save Node
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="overflow-y-auto flex-grow flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Output</h2>
            <OutputAccordion />
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative p-4 bg-gray-100">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            className="w-full h-full border border-gray-300"
            // nodeTypes={nodeTypes}
          >
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case "httpRequest":
                    return "teal";
                  case "compileJson":
                    return "blue";
                  case "logAndSave":
                    return "yellow";
                  default:
                    return "#eee";
                }
              }}
            />
            <Controls />
            <Background />
          </ReactFlow>
          {selectedNode && (
            <div
              ref={sidebarRef}
              className="absolute right-0 top-0 h-full w-72 bg-gray-900 text-white shadow-lg transition-transform transform translate-x-0"
            >
              <Sidebar
                selectedNode={selectedNode}
                onChange={handleNodeChange}
                onClose={closeSidebar}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
