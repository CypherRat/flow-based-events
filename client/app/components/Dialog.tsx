import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, content }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div
        ref={dialogRef}
        className="bg-white text-black p-4 rounded-lg relative overflow-y-auto max-h-[500px] max-w-lg w-full scrollbar-custom"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
};

export default Dialog;
