import React from 'react';

interface Props {
  onCorrect: () => void;
  onMistake: () => void;
}

export const TerminologyStage: React.FC<Props> = ({ onCorrect, onMistake }) => {
  const handleChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      onCorrect();
    } else {
      onMistake();
      alert("Incorrect Component Identified. Access Denied.");
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">SECURITY LOCK 1: IDENTIFICATION</h2>
        <p className="text-gray-400 mb-8">Identify the faulty component to access the technical manual.</p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-64 h-64 bg-black border-2 border-red-500 relative flex items-center justify-center overflow-hidden">
             {/* Abstract representation of a breaker */}
             <div className="w-32 h-40 bg-gray-700 rounded flex flex-col items-center justify-around p-2">
                <div className="w-20 h-4 bg-black"></div>
                <div className="w-8 h-12 bg-red-600 rounded shadow-inner"></div>
                <div className="w-20 h-4 bg-black"></div>
             </div>
             <div className="absolute top-2 right-2 text-red-500 font-mono text-xs">FAULT</div>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-4 w-full">
            {[
              { label: 'Fuel Injection Pump', correct: false },
              { label: 'Turbocharger Intake', correct: false },
              { label: 'Main Circuit Breaker', correct: true },
              { label: 'Sea Water Cooling Valve', correct: false },
            ].map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(option.correct)}
                className="p-4 bg-gray-700 hover:bg-cyan-900 hover:text-cyan-200 text-left rounded border border-gray-600 transition-colors font-mono"
              >
                {String.fromCharCode(65 + idx)}. {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};