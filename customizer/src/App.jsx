import { useState, useCallback, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ToggleView from "./components/ToggleView";
import Canvas2D from "./components/Canvas2D";
import Canvas3D from "./components/Canvas3D";
import Toolbar from "./components/Toolbar";
import { useCanvasStore } from "./hooks/useCanvasStore";
import ElementActionsPanel from "./components/ElementActionsPanel";
import configFile from "./assets/templates/mug/config.json";
import mugModel from './assets/templates/mug/mug.glb';
import * as THREE from 'three';

export default function App() {
  const [is3D, setIs3D] = useState(false);
  const currentLayer = useCanvasStore((state) => state.currentLayer);

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const recenterRef = useRef(null);
  const stageRef = useRef(null);
  const [texture, setTexture] = useState(null);

  const canvasConfig = configFile;

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  const addElement = useCallback((item) => {
    const id = `el-${Date.now()}`;
    const newItem = {
      ...item,
      id,
      x: canvasConfig.canvasSize.width / 2 - 100,
      y: canvasConfig.canvasSize.height / 2 - 100,
      width: 200,
      height: 200,
      rotation: 0,
    };
    setElements((prev) => [...prev, newItem]);
    setSelectedId(id);
  }, []);

  const deleteElement = () => {
    setElements(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  const bringToFront = () => {
    if (!selectedElement) return;
    setElements(prev => {
      const filtered = prev.filter(el => el.id !== selectedId);
      return [...filtered, selectedElement];
    });
  };

  const sendToBack = () => {
    if (!selectedElement) return;
    setElements(prev => {
      const filtered = prev.filter(el => el.id !== selectedId);
      return [selectedElement, ...filtered];
    });
  };

  const handleExposeRecenter = (fn) => {
    recenterRef.current = fn;
  };

  const generateWhiteTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL();
    console.log("Generating white texture data URL", dataUrl.slice(0, 100));
    const loader = new THREE.TextureLoader();
    loader.load(dataUrl, (whiteTexture) => {
      console.log("White texture loaded:", whiteTexture);
      setTexture(whiteTexture);
    });
  };


  const generateStageTexture = () => {
    if (stageRef.current && elements.length > 0) {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      console.log("Generating texture from stage data URL", dataUrl.slice(0, 100)); // print start of data URL
      const loader = new THREE.TextureLoader();
      loader.load(dataUrl, (loadedTexture) => {
        console.log("Texture loaded:", loadedTexture);
        setTexture(loadedTexture);
      });
    } else {
      console.log("No elements - using white texture");
      generateWhiteTexture();
    }
  };


  const onToggle = useCallback(() => {
    if (!is3D) {
      // Before switching to 3D, update texture
      generateStageTexture();
    }
    setIs3D(prev => !prev);
  }, [is3D, elements]);

  return (
    <>
      <div className="flex justify-end fixed top-0 z-40 w-full p-2 bg-gray-400">
        <ToggleView is3D={is3D} onToggle={onToggle} />
      </div>

      <div className="flex flex-col h-screen">
        <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
          <Toolbar />

          <div className="h-full w-full">
            {is3D ? (
              <Canvas3D modelPath={mugModel} texture={texture} />
            ) : (
              <Canvas2D
                config={canvasConfig}
                elements={elements}
                setElements={setElements}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onExposeRecenter={handleExposeRecenter}
                stageRef={stageRef}
              />
            )}
          </div>

          <button
            onClick={() => recenterRef.current?.()}
            className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Recenter
          </button>

          <ElementActionsPanel
            selectedElement={selectedElement}
            onDelete={deleteElement}
            onBringToFront={bringToFront}
            onSendToBack={sendToBack}
          />
        </div>
      </div>
    </>
  );
}
