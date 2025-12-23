import React, { useState } from 'react';

interface Props {
  onPanelFound: () => void;
}

export const RoomStage: React.FC<Props> = ({ onPanelFound }) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="h-full w-full relative bg-gray-900 flex flex-col">
       <div className="absolute top-0 left-0 w-full bg-black/60 p-2 z-10 text-center border-b border-gray-700">
          <p className="text-cyan-400 font-mono">STATUS: SEARCHING FOR FAULT SOURCE</p>
          <p className="text-xs text-gray-400">Move cursor to inspect equipment.</p>
       </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Background Image Placeholder */}
        <img 
          src="https://picsum.photos/1200/800?grayscale&blur=2" 
          alt="Engine Room" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        {/* Interactive Zones */}
        <div className="relative w-[800px] h-[500px] bg-gray-800/30 border border-gray-600 rounded-lg shadow-2xl backdrop-blur-sm">
          
          {/* Safe Zone 1 */}
          <div 
            className="absolute top-10 left-10 w-40 h-60 border-2 border-transparent hover:border-cyan-500 transition-all cursor-help group bg-black/40"
            onMouseEnter={() => setHoveredZone('Auxiliary Pump B')}
            onMouseLeave={() => setHoveredZone(null)}
          >
             <div className="absolute bottom-2 left-2 text-xs bg-black text-cyan-400 px-1 opacity-0 group-hover:opacity-100">Status: OK</div>
          </div>

          {/* Safe Zone 2 */}
          <div 
            className="absolute top-10 right-10 w-40 h-40 border-2 border-transparent hover:border-cyan-500 transition-all cursor-help group bg-black/40"
            onMouseEnter={() => setHoveredZone('Cooling System')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <div className="absolute bottom-2 left-2 text-xs bg-black text-cyan-400 px-1 opacity-0 group-hover:opacity-100">Status: OK</div>
          </div>

          {/* FAULTY ZONE */}
          <button 
            onClick={onPanelFound}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-48 border-2 border-transparent hover:border-red-500 transition-all cursor-pointer group bg-black/50"
            onMouseEnter={() => setHoveredZone('Main Switchboard Panel 3')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {/* CSS Smoke Effect */}
            <div className="absolute top-0 right-10">
               <div className="smoke-effect" style={{ animationDelay: '0s', left: '0px' }}></div>
               <div className="smoke-effect" style={{ animationDelay: '0.5s', left: '10px' }}></div>
               <div className="smoke-effect" style={{ animationDelay: '1s', left: '-5px' }}></div>
            </div>
            
            <div className="absolute bottom-2 left-2 text-xs bg-red-900 text-white px-1 opacity-0 group-hover:opacity-100 animate-pulse">
              WARNING: HEAT DETECTED
            </div>
          </button>
        </div>

        {/* Cursor Feedback */}
        {hoveredZone && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 border border-cyan-500 text-cyan-400 px-6 py-2 rounded-full font-mono text-lg">
            INSPECTING: {hoveredZone}
          </div>
        )}
      </div>
    </div>
  );
};