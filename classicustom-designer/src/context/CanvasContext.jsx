import React, { createContext, useState, useContext } from "react";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const [objects, setObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [activeTool, setActiveTool] = useState("images");

  const addText = () => {
    const newText = {
      id: Date.now().toString(),
      type: "text",
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 20,
      color: "#000",
    };
    setObjects((prev) => [...prev, newText]);
    setSelectedObjectId(newText.id);
  };

  const uploadImage = (file) => {
    // convert file to URL and add to objects
    const url = URL.createObjectURL(file);
    const newImage = {
      id: Date.now().toString(),
      type: "image",
      src: url,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };
    setObjects((prev) => [...prev, newImage]);
    setSelectedObjectId(newImage.id);
  };

  const bringForward = () => {
    // Logic to move selected object one step forward in array
  };

  const sendBackward = () => {
    // Logic to move selected object one step backward in array
  };

  const selectTool = (toolId) => {
    setActiveTool(toolId);
  };

  return (
    <CanvasContext.Provider
      value={{
        objects,
        selectedObjectId,
        activeTool,
        setSelectedObjectId,
        addText,
        uploadImage,
        bringForward,
        sendBackward,
        selectTool,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
