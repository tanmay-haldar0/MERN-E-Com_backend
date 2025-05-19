import React, { useState, useRef } from "react";
import {
  AiOutlinePicture,
  AiOutlineFontSize,
  AiOutlineUpload,
  AiOutlineAppstore,
} from "react-icons/ai";
import { IoLayersOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";

const tabs = [
  { id: "images", label: "Uploads", icon: <AiOutlineUpload size={20} /> },
  { id: "text", label: "Text", icon: <AiOutlineFontSize size={20} /> },
  { id: "graphics", label: "Graphics", icon: <AiOutlinePicture size={20} /> },
  { id: "designs", label: "Designs", icon: <AiOutlineAppstore size={20} /> },
  { id: "layers", label: "Layers", icon: <IoLayersOutline size={20} /> },
];

const Toolbar = ({ onAddText, onBringForward, onSendBackward, onAddImageToCanvas }) => {
  const [activeTab, setActiveTab] = useState("images");
  const [uploadedImages, setUploadedImages] = useState([]);

  const fileInputRef = useRef();

  // Handle file upload
  const onUploadImage = (e) => {
    const files = e.target.files;
    if (files.length) {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        newImages.push({ id: Date.now() + i, src: url, name: file.name });
      }
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  // Trigger hidden file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Drag start handler - pass image data in dataTransfer
  const onDragStart = (image, e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(image));
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex flex-col items-center justify-center py-3 group relative ${
              activeTab === tab.id ? "bg-gray-100 border-l-4 border-blue-500" : ""
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded ${
                activeTab === tab.id ? "text-blue-600 bg-blue-50" : "hover:bg-gray-200"
              }`}
            >
              {tab.icon}
            </div>
            <span className="text-[10px] mt-1 text-gray-600 group-hover:text-black">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active tab panel */}
      {activeTab && (
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium capitalize">{activeTab}</h2>
            <button onClick={() => setActiveTab(null)}>
              <MdOutlineClose size={20} />
            </button>
          </div>

          {activeTab === "images" && (
            <div>
              <button
                onClick={triggerFileInput}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 mb-3"
              >
                Upload Image
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onUploadImage}
              />

              {/* Show thumbnails with draggable */}
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-auto">
                {uploadedImages.length === 0 && (
                  <div className="text-gray-500 text-sm">No uploaded images yet.</div>
                )}
                {uploadedImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.src}
                    alt={img.name}
                    draggable
                    onDragStart={(e) => onDragStart(img, e)}
                    className="w-16 h-16 object-cover rounded cursor-grab border"
                    title="Drag and drop to canvas"
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "text" && (
            <div>
              <button
                onClick={onAddText}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Text
              </button>
            </div>
          )}

          {activeTab === "layers" && (
            <div className="space-x-2">
              <button
                onClick={onBringForward}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
              >
                Bring Forward
              </button>
              <button
                onClick={onSendBackward}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
              >
                Send Backward
              </button>
            </div>
          )}

          {activeTab === "graphics" && (
            <div className="text-sm text-gray-600">Graphics library coming soon.</div>
          )}
          {activeTab === "designs" && (
            <div className="text-sm text-gray-600">Design templates coming soon.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
