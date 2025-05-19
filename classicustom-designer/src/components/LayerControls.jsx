// src/components/LayerControls.jsx
import React from "react";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

const LayerControls = () => {
  return (
    <>
      <button className="p-2 hover:bg-gray-100 rounded" title="Bring Forward">
        <FaArrowUp />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded" title="Send Backward">
        <FaArrowDown />
      </button>
      <button className="p-2 hover:bg-red-100 text-red-500 rounded" title="Delete">
        <FaTrash />
      </button>
    </>
  );
};

export default LayerControls;
