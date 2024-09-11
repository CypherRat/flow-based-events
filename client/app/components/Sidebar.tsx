/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import HttpRequestNode from "../nodes/HttpRequestNode/HttpRequestNode";
import CompileJsonNode from "../nodes/CompileJsonNode/CompileJsonNode";
import LogAndSaveNode from "../nodes/LogAndSaveNode/LogAndSaveNode";
import KafkaNode from "../nodes/KafkaNode/kafkaNode";

interface SidebarProps {
  selectedNode: any;
  onChange: (data: any) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedNode,
  onChange,
  onClose,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!selectedNode) return null;

  const renderNodeComponent = () => {
    switch (selectedNode.type) {
      case "httpRequest":
        return <HttpRequestNode node={selectedNode} onChange={onChange} />;
      case "compileJson":
        return <CompileJsonNode />;
      case "logAndSave":
        return <LogAndSaveNode />;
      case "kafkaNode":
        return <KafkaNode node={selectedNode} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="h-full w-full bg-gray-100 shadow-lg transition-transform transform translate-x-0"
    >
      <div className="flex justify-between items-center text-black mb-4 p-4">
        <h2 className="text-xl font-bold">Node Properties</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✖
        </button>
      </div>
      <div className="p-4">{renderNodeComponent()}</div>
    </div>
  );
};

export default Sidebar;
