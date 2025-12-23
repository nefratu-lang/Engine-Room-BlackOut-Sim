
import React, { useState } from 'react';

interface Props {
  onPanelFound: () => void;
}

export const RoomStage: React.FC<Props> = ({ onPanelFound }) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="h-full w-full relative bg-gray-900 flex flex-col">
       <div className="absolute top-0 left-0 w-full bg-black/80 p-3 z-10 text-center border-b border-gray-700 shadow-lg backdrop-blur-sm">
          <p className="text-cyan-400 font-mono text-lg animate-pulse">STATUS: SEARCHING FOR FAULT SOURCE</p>
          <p className="text-sm text-gray-400">Hover over equipment to inspect status.</p>
       </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-black to-black opacity-80"></div>
        
        {/* Main Room Container */}
        <div className="relative w-full max-w-5xl h-[600px] bg-slate-900/50 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-sm p-8 mx-4 overflow-hidden">
          
          {/* Safe Zone 1: Auxiliary Pump */}
          <div 
            className="absolute top-20 left-10 w-64 h-80 border-2 border-slate-600 hover:border-cyan-500 transition-all cursor-help group bg-black/60 overflow-hidden rounded-lg shadow-lg"
            onMouseEnter={() => setHoveredZone('Auxiliary Seawater Pump')}
            onMouseLeave={() => setHoveredZone(null)}
          >
             <img 
               src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80" 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
               alt="Pump" 
             />
             <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                <div className="text-xs text-cyan-500 font-mono mb-1">UNIT: P-102</div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                    <span>PRESS: NORMAL</span>
                    <span className="text-green-400">RUNNING</span>
                </div>
             </div>
          </div>

          {/* Safe Zone 2: Cooling System */}
          <div 
            className="absolute top-20 right-10 w-64 h-64 border-2 border-slate-600 hover:border-cyan-500 transition-all cursor-help group bg-black/60 overflow-hidden rounded-lg shadow-lg"
            onMouseEnter={() => setHoveredZone('Central Cooling Unit')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <img 
               src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=400&q=80" 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
               alt="Cooling" 
             />
            <div className="absolute top-2 right-2 flex flex-col gap-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            </div>
            <div className="absolute bottom-0 w-full bg-black/80 text-center py-1 border-t border-slate-700">
                <span className="text-xs text-gray-300 font-mono">HVAC STATUS: NOMINAL</span>
             </div>
          </div>

          {/* FAULTY ZONE: Main Switchboard */}
          <button 
            onClick={onPanelFound}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-80 h-56 border-2 border-slate-600 hover:border-red-500 transition-all cursor-pointer group bg-black/60 overflow-hidden rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.1)] hover:shadow-[0_0_50px_rgba(220,38,38,0.4)]"
            onMouseEnter={() => setHoveredZone('Main Switchboard Panel 3')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <img 
               src="https://images.unsplash.com/photo-1563205764-f3a743457053?auto=format&fit=crop&w=500&q=80" 
               className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-300" 
               alt="Panel" 
             />
             
            {/* Smoke Effect */}
            <div className="absolute top-4 right-12 pointer-events-none">
               <div className="smoke-effect bg-gray-400" style={{ animationDelay: '0s', left: '0px' }}></div>
               <div className="smoke-effect bg-gray-300" style={{ animationDelay: '0.5s', left: '15px' }}></div>
               <div className="smoke-effect bg-white" style={{ animationDelay: '1.2s', left: '-10px' }}></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-red-900/80 border border-red-500 px-4 py-2 rounded shadow-lg backdrop-blur-sm animate-bounce">
                  <span className="text-white font-bold tracking-widest text-sm">INSPECT FAULT</span>
               </div>
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-2">
                 <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                 <span className="text-xs text-red-400 font-bold font-mono">HIGH TEMP ALERT</span>
            </div>
          </button>
        </div>

        {/* Cursor Feedback Tooltip */}
        {hoveredZone && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 border border-cyan-500 text-cyan-400 px-6 py-3 rounded-full font-mono text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] z-50 pointer-events-none whitespace-nowrap">
            &gt;&gt; INSPECTING: {hoveredZone}
          </div>
        )}
      </div>
    </div>
  );
};
