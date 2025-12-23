import React, { useState } from 'react';

interface Props {
  onJoin: (name: string, sessionId: string, mode: 'HOST' | 'JOIN') => void;
}

export const LobbyStage: React.FC<Props> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isHosting, setIsHosting] = useState(false);

  const handleHost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin(name, '', 'HOST');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && sessionId.trim()) {
      onJoin(name, sessionId, 'JOIN');
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=10')] opacity-20 bg-cover bg-center"></div>
      
      <div className="z-10 bg-slate-800/90 p-8 rounded-xl shadow-2xl border border-cyan-500/30 max-w-md w-full backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Naval Training Sim</h1>
        <h2 className="text-cyan-400 font-mono text-center mb-8 text-sm">MULTIPLAYER PROTOCOL INITIATED</h2>

        {!isHosting ? (
          <div className="space-y-6">
            <div>
               <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Cadet Name</label>
               <input
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                 placeholder="Enter Name"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsHosting(true)}
                disabled={!name}
                className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded transition-all shadow-lg"
              >
                HOST SESSION
              </button>
              
              <div className="col-span-1">
                 {/* Placeholder for spacing or split UI later */}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Or Join Existing:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-cyan-500 focus:outline-none font-mono text-sm"
                  placeholder="Paste Session ID"
                />
                <button
                  onClick={handleJoin}
                  disabled={!name || !sessionId}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold px-4 rounded transition-all"
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-white">Initializing Secure Channel...</p>
            <button 
              onClick={(e) => handleHost(e)} 
              className="mt-4 px-4 py-2 bg-green-600 rounded text-white font-bold"
            >
              Start & Generate ID
            </button>
            <button 
              onClick={() => setIsHosting(false)}
              className="mt-2 block w-full text-slate-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};