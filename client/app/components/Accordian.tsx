import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

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

export default Accordion;
