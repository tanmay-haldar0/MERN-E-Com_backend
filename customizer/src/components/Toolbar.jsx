import React, { useState, useEffect } from "react";
import {
  FiUpload,
  FiType,
  FiDownload,
  FiX,
} from "react-icons/fi";
import clsx from "clsx";

const Toolbar = ({ onAddImage, onAddText, onExport }) => {
  const [activePanel, setActivePanel] = useState("uploads");
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setPanelOpen(!mobile); // Panel closed by default on mobile
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      src: URL.createObjectURL(file),
      type: "image",
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const Tab = ({ label, icon, tab }) => (
    <button
      onClick={() => {
        if (activePanel === tab && panelOpen) {
          setPanelOpen(false); // toggle off
        } else {
          setActivePanel(tab);
          setPanelOpen(true); // open panel
        }
      }}
      className={clsx(
        "flex flex-col items-center justify-center py-3 px-2 hover:bg-blue-100 transition rounded",
        activePanel === tab && panelOpen && "bg-blue-100 text-blue-600"
      )}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  const renderPanelContent = () => {
    switch (activePanel) {
      case "uploads":
        return (
          <>
            <label className="flex items-center gap-2 cursor-pointer mb-4 text-blue-600">
              <FiUpload /> Upload Images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("application/json", JSON.stringify(img))
                  }
                  onDoubleClick={() => onAddImage(img)}
                  className="border rounded overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
                >
                  <img src={img.src} alt="upload" className="w-full h-auto" />
                </div>
              ))}
            </div>
          </>
        );
      case "text":
        return (
          <button
            onClick={onAddText}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiType className="inline mr-2" />
            Add Text
          </button>
        );
      case "export":
        return (
          <button
            onClick={onExport}
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FiDownload className="inline mr-2" />
            Export Design
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full relative z-50">
      {/* Sidebar */}
      <div className="flex flex-col w-16 bg-white border-r shadow z-50">
        <Tab label="Uploads" icon={<FiUpload />} tab="uploads" />
        <Tab label="Text" icon={<FiType />} tab="text" />
        <Tab label="Export" icon={<FiDownload />} tab="export" />
      </div>

      {/* Sliding Panel */}
      {panelOpen && (
        <>
          {/* Mobile overlay */}
          {isMobile ? (
            <div className="fixed inset-0 bg-black/50 z-40 flex">
              <div className="w-[80%] max-w-xs bg-white p-4 shadow-lg relative overflow-y-auto">
                <button
                  onClick={() => setPanelOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                >
                  <FiX className="text-xl" />
                </button>
                {renderPanelContent()}
              </div>
              <div className="flex-1" onClick={() => setPanelOpen(false)} />
            </div>
          ) : (
            // Desktop inline panel
            <div className="w-64 bg-white border-r shadow p-4 overflow-y-auto relative">
              <button
                onClick={() => setPanelOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <FiX className="text-xl" />
              </button>
              {renderPanelContent()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Toolbar;
