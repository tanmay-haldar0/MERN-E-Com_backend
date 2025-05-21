import { useState, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ToggleView from "./components/ToggleView";
import Canvas2D from "./components/Canvas2D";
import Canvas3D from "./components/Canvas3D";
import Toolbar from "./components/Toolbar";
import { useCanvasStore } from "./hooks/useCanvasStore";
import ElementActionsPanel from "./components/ElementActionsPanel";
import configFile from "./assets/templates/mug/config.json";
import mugModel from './assets/templates/mug/mug.glb';
// and then pass mugModel to Canvas3D component


export default function App() {
  const [is3D, setIs3D] = useState(false);
  const currentLayer = useCanvasStore((state) => state.currentLayer);

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const recenterRef = useRef(null);

  const canvasConfig = configFile;

  const onToggle = useCallback(() => {
    setIs3D(prev => !prev);
  }, []);

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

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  const deleteElement = () => {
    setElements(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleExposeRecenter = (fn) => {
    recenterRef.current = fn;
  };

  const bringToFront = () => {
    if (!selectedElement) return;
    setElements((prev) => {
      const filtered = prev.filter(el => el.id !== selectedId);
      return [...filtered, selectedElement];
    });
  };

  const sendToBack = () => {
    if (!selectedElement) return;
    setElements((prev) => {
      const filtered = prev.filter(el => el.id !== selectedId);
      return [selectedElement, ...filtered];
    });
  };


  const stageRef = useRef(null);
  const [texture, setTexture] = useState(null);

  // Whenever elements change or user triggers, update texture
  useEffect(() => {
    if (!is3D && stageRef.current) {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      const loader = new THREE.TextureLoader();
      loader.load(dataUrl, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [elements, is3D]);

  
  return (
    <>
      <div className="flex justify-end fixed top-0 z-40 w-full p-2 bg-gray-400">
        <ToggleView is3D={is3D} onToggle={onToggle} />

      </div>
      <div className="flex flex-col h-screen">

        {/* ... your toolbar and canvas layout ... */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
          <Toolbar />
          <div className="h-full w-full">
            {is3D ? <Canvas3D modelPath={mugModel} /> : (
              <Canvas2D
                config={canvasConfig}
                elements={elements}
                setElements={setElements}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onExposeRecenter={handleExposeRecenter}
              />
            )}
          </div>

          <button
            onClick={() => recenterRef.current?.()}
            className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Recenter
          </button>

          {/* Floating action panel */}
          <ElementActionsPanel
            selectedElement={selectedElement}
            onDelete={deleteElement}
            onBringToFront={bringToFront}
            onSendToBack={sendToBack}
          />


          {/* Right Status Panel */}
          {/* <div className="hidden sm:block w-64 p-4 bg-white border-l">
            <h2 className="text-lg font-semibold mb-2">Layer Status</h2>
            {selectedElement ? (
              <div className="text-sm">
                <p><strong>ID:</strong> {selectedElement.id}</p>
                <p><strong>Type:</strong> {selectedElement.type}</p>
                <p><strong>Position:</strong> {JSON.stringify(selectedElement.position || { x: selectedElement.x, y: selectedElement.y })}</p>
              </div>
            ) : (
              <p className="text-gray-500">No layer selected.</p>
            )}
          </div> */}
        </div>

      </div>
    </>
  );
}