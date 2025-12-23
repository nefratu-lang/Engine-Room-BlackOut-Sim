import React from 'react';

interface Props {
  onFinish: () => void;
}

export const SuccessStage: React.FC<Props> = ({ onFinish }) => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-green-900 to-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white/10 backdrop-blur-md p-12 rounded-xl border border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-2xl w-full">
        <div className="mb-6">
          <svg className="w-24 h-24 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">POWER RESTORED</h1>
        <h2 className="text-xl text-green-300 font-mono mb-8">MISSION ACCOMPLISHED</h2>

        <div className="bg-black/40 p-6 rounded mb-8 border border-white/20">
          <h3 className="text-yellow-400 font-serif text-2xl mb-2">CERTIFICATE OF COMPETENCY</h3>
          <p className="text-gray-300">This certifies that the student has successfully demonstrated emergency response procedures for Marine Generator Failure.</p>
        </div>

        <button 
          onClick={onFinish}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow transition-colors"
        >
          View Performance Dashboard
        </button>
      </div>
    </div>
  );
};