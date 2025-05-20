import { FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

const ElementActionsPanel = ({ selectedElement, onDelete, onBringToFront, onSendToBack }) => {
  if (!selectedElement) return null;

  return (
    <div className="fixed z-50 flex flex-col items-center gap-3 bg-white border border-gray-300 rounded-md shadow-md p-2"
         style={{
           left: 'calc(50% + 170px)', // Assuming canvas width is ~400px and centered
           top: 'calc(50% - 100px)',  // Adjust vertically
         }}
    >
      <button
        onClick={onBringToFront}
        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
        title="Bring to Front"
      >
        <FiArrowUp className="text-xl text-blue-600" />
      </button>
      <button
        onClick={onSendToBack}
        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
        title="Send to Back"
      >
        <FiArrowDown className="text-xl text-blue-600" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 bg-red-100 rounded hover:bg-red-200"
        title="Delete Element"
      >
        <FiTrash2 className="text-xl text-red-600" />
      </button>
    </div>
  );
};

export default ElementActionsPanel;
