import React, { useState } from "react";
import { FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const dummyDesigns = [
  {
    id: 1,
    title: "Vintage Skull Tee",
    image: "https://via.placeholder.com/150",
    description: "Dark-themed skull art on a black tee.",
  },
  {
    id: 2,
    title: "Abstract Splash Hoodie",
    image: "https://via.placeholder.com/150",
    description: "Color splash modern abstract hoodie design.",
  },
  {
    id: 3,
    title: "Minimal Logo Tee",
    image: "https://via.placeholder.com/150",
    description: "Minimalist logo tee with soft tones.",
  },
];

const SavedDesigns = () => {
  const [designs, setDesigns] = useState(dummyDesigns);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const updated = designs.filter((design) => design.id !== id);
    setDesigns(updated);
  };

  const handleView = (design) => {
    alert(`Viewing Design: ${design.title}`);
  };

  const handleCreateNewDesign = () => {
    navigate("/create-design");
  };

  return (
    <div className="relative space-y-6 px-4 sm:px-6 md:px-8 pb-20">
      <h2 className="text-xl font-semibold text-gray-800">Saved Designs</h2>

      {designs.length === 0 ? (
        <p className="text-gray-500 text-sm">You have no saved designs.</p>
      ) : (
        <div className="grid grid-cols-1 [@media(min-width:400px)]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">


          {designs.map((design) => (
            <div
              key={design.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-all"
            >
              <div className="w-full aspect-[4/3]">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800">
                  {design.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{design.description}</p>

                <div className="mt-4 flex justify-end space-x-4 text-gray-600">
                  <button
                    onClick={() => handleView(design)}
                    title="View"
                    className="hover:text-blue-600 transition-transform hover:scale-110"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(design.id)}
                    title="Delete"
                    className="hover:text-red-600 transition-transform hover:scale-110"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating + Button */}
      <button
        onClick={handleCreateNewDesign}
        title="Create New Design"
        className="fixed bottom-6 right-6 bg-primary hover:bg-orange-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-xl z-50 transition-transform hover:scale-110"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default SavedDesigns;
