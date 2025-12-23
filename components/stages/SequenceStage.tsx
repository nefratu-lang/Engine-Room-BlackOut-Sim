
import React, { useState, useEffect } from 'react';
import { SEQUENCE_STEPS } from '../../types';

interface Props {
  completedSteps: string[];
  onStepComplete: (stepId: string) => void;
  onMistake: () => void;
}

export const SequenceStage: React.FC<Props> = ({ completedSteps, onStepComplete, onMistake }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("System Ready. Initiate Start-up Sequence.");
  const [statusColor, setStatusColor] = useState("text-cyan-400");
  
  // Scramble the buttons visually
  const [shuffledSteps] = useState(() => [...SEQUENCE_STEPS].sort(() => Math.random() - 0.5));

  // Sync local index with props
  useEffect(() => {
    setCurrentStepIndex(completedSteps.length);
    if (completedSteps.length === SEQUENCE_STEPS.length) {
       setStatusMessage("Sequence Complete. Generators Online.");
       setStatusColor("text-green-500");
    } else if (completedSteps.length > 0) {
       setStatusMessage(`Step Confirmed. Proceeding to next phase.`);
       setStatusColor("text-green-400");
    }
  }, [completedSteps]);

  const handleStepClick = (stepId: string) => {
    // Determine the next expected step based on how many are already done globally
    const correctStepId = SEQUENCE_STEPS[completedSteps.length].id;

    if (stepId === correctStepId) {
      // Correct
      onStepComplete(stepId);
    } else {
      // Incorrect
      onMistake();
      setStatusMessage("ERROR: INVALID SEQUENCE. HIGH TEMPERATURE RISK.");
      setStatusColor("text-red-500 animate-pulse");
      
      // Reset logic handled by GameContainer or just local reset visual?
      // In multiplayer, a mistake might just alert, not reset everyone's progress for simplicity
      // or we just reset the local visual temporarily
      setTimeout(() => {
        setStatusMessage("Sequence Paused. Check Logic.");
        setStatusColor("text-cyan-400");
      }, 1500);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">FINAL LOCK: START-UP SEQUENCE</h2>
        <div className="flex justify-center mb-4">
            <span className="bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded border border-blue-500/30">
                MULTIPLAYER SYNC ACTIVE
            </span>
        </div>
        <p className={`text-center font-mono text-lg mb-8 ${statusColor} min-h-[32px]`}>
          {statusMessage}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-gray-400 font-bold uppercase text-sm border-b border-gray-700 pb-2">Control Panel</h3>
            {shuffledSteps.map((step) => {
               const isCompleted = completedSteps.includes(step.id);
               return (
                <button
                  key={step.id}
                  onClick={() => !isCompleted && handleStepClick(step.id)}
                  disabled={isCompleted}
                  className={`w-full p-4 text-left font-mono border-l-4 transition-all shadow-md
                    ${isCompleted 
                      ? 'bg-green-900/30 border-green-500 text-green-500 opacity-50 cursor-not-allowed' 
                      : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-cyan-500 active:bg-gray-600'}
                  `}
                >
                  [{isCompleted ? 'DONE' : 'EXEC'}] {step.label}
                </button>
              );
            })}
          </div>

          <div className="bg-black p-4 rounded border border-gray-700 font-mono text-sm text-green-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
             <h3 className="text-gray-500 font-bold uppercase text-xs mb-4">Sequence Log</h3>
             <ul className="space-y-2">
                {completedSteps.map((id, idx) => {
                    const label = SEQUENCE_STEPS.find(s => s.id === id)?.label;
                    return <li key={idx} className="opacity-80">&gt; {label} ... OK</li>
                })}
                {completedSteps.length === 0 && <li className="animate-pulse">&gt; Waiting for input...</li>}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
