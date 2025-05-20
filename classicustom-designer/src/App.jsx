import React from "react";
import Toolbar from "./components/Toolbar";
import LayerControls from "./components/LayerControls";
import CanvasStage from "./components/CanvasStage";
import {phoneCoverTemplate, mugTemplate} from "./templates/templateConfig";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Navbar */}
      <nav className="w-full h-14 bg-white border-b border-gray-300 flex justify-between items-center px-6 shadow-sm z-40">
        {/* Left: Logo */}
        <div className="text-xl font-bold text-blue-600 cursor-pointer select-none">
          MyLogo
        </div>

        {/* Right: Profile */}
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline text-gray-700 font-medium">User Name</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover cursor-pointer"
          />
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Toolbar />

        {/* Main */}
        <main className="flex-1 flex justify-center items-center relative overflow-hidden">
          {/* Floating Controls */}
          <div className="absolute top-8 z-20 flex gap-2 bg-white shadow px-3 py-1 rounded-md border">
            <LayerControls />
          </div>

          {/* Canvas */}
          <div className="p-2 bg-white border shadow-md rounded-md overflow-hidden mt-16">
            <CanvasStage template={mugTemplate} />
          </div>
        </main>
      </div>
    </div>
  );
}
