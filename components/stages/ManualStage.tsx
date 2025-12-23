import React, { useState } from 'react';

interface Props {
  onCorrect: () => void;
  onMistake: () => void;
}

export const ManualStage: React.FC<Props> = ({ onCorrect, onMistake }) => {
  const [input, setInput] = useState('');
  const CORRECT_CODE = '4.5';

  const handleKey = (key: string) => {
    if (key === 'CLR') {
      setInput('');
    } else if (key === 'ENT') {
      if (input === CORRECT_CODE) {
        onCorrect();
      } else {
        onMistake();
        setInput('ERR');
        setTimeout(() => setInput(''), 1000);
      }
    } else {
      if (input.length < 4) setInput(prev => prev === 'ERR' ? key : prev + key);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col lg:flex-row">
      {/* PDF / Manual Viewer */}
      <div className="flex-1 bg-white p-8 overflow-y-auto text-gray-900 font-serif border-r border-gray-700">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 border-b-2 border-black pb-2">Technical Manual: GEN-SET 3000</h1>
          <h2 className="text-xl font-bold mb-2">Section 4: Safety Protocols</h2>
          <p className="mb-4 text-justify">
            The Main Circuit Breaker is designed to trip automatically under overload conditions. 
            Before resetting, the operator must verify the lubrication system integrity. 
          </p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <h3 className="font-bold">CRITICAL PARAMETERS</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nominal Voltage: 440V</li>
                <li>Frequency: 60Hz</li>
                <li>Oil Temperature Max: 85°C</li>
                <li><strong>Safety Shut-off Pressure Limit: 4.5 bar</strong></li>
                <li>Reset Delay: 30 seconds</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            WARNING: Do not attempt to engage the synchronization gear if the pressure is below the shut-off limit.
            Failure to observe this limit may result in catastrophic engine seizure.
          </p>
        </div>
      </div>

      {/* Keypad Interface */}
      <div className="w-full lg:w-96 bg-gray-800 p-8 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-700">
        <h2 className="text-cyan-400 font-mono mb-6 text-center">ENTER SAFETY LIMIT TO UNLOCK VALVE</h2>
        
        <div className="bg-black border-2 border-cyan-600 w-full mb-6 p-4 rounded text-right">
            <span className="font-mono text-3xl text-green-500 tracking-widest">{input || '_ _ _'}</span>
            <span className="text-xs text-gray-500 block mt-1">UNIT: BAR</span>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(key => (
                <button 
                    key={key}
                    onClick={() => handleKey(key)}
                    className="h-16 bg-gray-700 hover:bg-gray-600 rounded text-xl font-bold text-white shadow-lg active:transform active:scale-95"
                >
                    {key}
                </button>
            ))}
            <button 
                onClick={() => handleKey('CLR')}
                className="h-16 bg-red-900 hover:bg-red-800 rounded text-xl font-bold text-white shadow-lg"
            >
                CLR
            </button>
            <button 
                onClick={() => handleKey('ENT')}
                className="col-span-3 h-16 bg-green-700 hover:bg-green-600 rounded text-xl font-bold text-white shadow-lg mt-2 uppercase tracking-widest"
            >
                ENTER
            </button>
        </div>
      </div>
    </div>
  );
};