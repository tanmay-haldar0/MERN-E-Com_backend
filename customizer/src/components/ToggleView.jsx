import { FaCube, FaVectorSquare } from "react-icons/fa";

export default function ToggleView({ is3D, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
    >
      {is3D ? <FaVectorSquare /> : <FaCube />}
      {is3D ? "Switch to 2D" : "Switch to 3D"}
    </button>
  );
}
