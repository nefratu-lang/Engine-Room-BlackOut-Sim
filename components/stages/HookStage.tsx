import React, { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const HookStage: React.FC<Props> = ({ onComplete }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-red-950 relative overflow-hidden">
      {/* Visual Alarm Overlay */}
      <div className="absolute inset-0 bg-red-600 opacity-20 animate-pulse pointer-events-none"></div>
      
      <div className="z-10 text-center p-8 border-4 border-red-600 bg-black/80 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
        <h1 className="text-6xl font-black text-red-500 mb-4 tracking-tighter animate-bounce">WARNING</h1>
        <h2 className="text-3xl font-mono text-white mb-6">GENERATOR FAILURE DETECTED</h2>
        <div className="bg-red-900/50 p-4 border border-red-500 mb-8">
          <p className="text-xl font-bold text-red-200">SHIP IN TOTAL BLACKOUT</p>
          <p className="text-lg text-white mt-2">TIME TO CRITICAL FAILURE: <span className="font-mono text-red-400">10:00</span></p>
        </div>

        {showButton && (
          <button 
            onClick={onComplete}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded shadow-lg transition-transform transform hover:scale-105 uppercase tracking-widest border-2 border-white"
          >
            Enter Engine Room
          </button>
        )}
      </div>
    </div>
  );
};