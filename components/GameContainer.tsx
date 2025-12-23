import React, { useState, useEffect, useRef } from 'react';
import { GameStage, StudentMetrics, PedagogicalContext, ChatMessage, SEQUENCE_STEPS, MultiplayerEvent } from '../types';
import { InstructionsStage } from './stages/InstructionsStage';
import { HookStage } from './stages/HookStage';
import { RoomStage } from './stages/RoomStage';
import { TerminologyStage } from './stages/TerminologyStage';
import { ManualStage } from './stages/ManualStage';
import { SequenceStage } from './stages/SequenceStage';
import { SuccessStage } from './stages/SuccessStage';
import { Dashboard } from './Dashboard';
import { LobbyStage } from './LobbyStage';
import { ChatOverlay } from './ChatOverlay';
import { PedagogicalOverlay } from './PedagogicalOverlay';
import { getChiefEngineerHint } from '../services/geminiService';
import { multiplayerService } from '../services/multiplayerService';

export const GameContainer: React.FC = () => {
  // Start with INSTRUCTIONS instead of LOBBY
  const [stage, setStage] = useState<GameStage>(GameStage.INSTRUCTIONS);
  const [metrics, setMetrics] = useState<StudentMetrics>({
    timeElapsed: 0,
    mistakes: 0,
    stageReached: GameStage.START,
    logs: []
  });
  
  const [hint, setHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Multiplayer State
  const [playerName, setPlayerName] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sequenceSteps, setSequenceSteps] = useState<string[]>([]);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');

  // Pedagogical Context Mapping
  const getContext = (currentStage: GameStage): PedagogicalContext => {
    switch (currentStage) {
      case GameStage.INSTRUCTIONS:
        return { tag: "Orientation", description: "Establishing learning objectives and rules of engagement." };
      case GameStage.LOBBY:
        return { tag: "Collaboration Setup", description: "Preparing for team-based problem solving." };
      case GameStage.START:
      case GameStage.HOOK:
        return { tag: "TEC-VARIETY: Tension", description: "Creating urgency with audio-visual alerts and time constraints." };
      case GameStage.ROOM_EXPLORATION:
        return { tag: "Active Learning", description: "Exploratory environment requires student agency to identify faults." };
      case GameStage.TERMINOLOGY:
        return { tag: "Recall & Recognition", description: "Connecting visual stimuli to technical vocabulary (Input)." };
      case GameStage.MANUAL_ANALYSIS:
        return { tag: "Information Literacy", description: "Extracting specific data from authentic technical documentation." };
      case GameStage.SEQUENCE:
        return { tag: "Process Application", description: "Applying procedural knowledge in a logical sequence (Collaborative)." };
      case GameStage.SUCCESS:
        return { tag: "The Yielding", description: "Immediate positive feedback and reward for completion." };
      case GameStage.DASHBOARD:
        return { tag: "Assessment Analytics", description: "Data-driven review of student performance." };
      default:
        return { tag: "", description: "" };
    }
  };

  const context = getContext(stage);

  // Timer Logic
  useEffect(() => {
    if (stage !== GameStage.INSTRUCTIONS && stage !== GameStage.LOBBY && stage !== GameStage.START && stage !== GameStage.DASHBOARD && stage !== GameStage.SUCCESS) {
      timerRef.current = setInterval(() => {
        setMetrics(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
        if(timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Multiplayer Listeners
  useEffect(() => {
    const unsubscribe = multiplayerService.subscribe((event: MultiplayerEvent) => {
      switch (event.type) {
        case 'CHAT':
          setChatMessages(prev => [...prev, event.payload]);
          break;
        case 'STATE_UPDATE':
          if (event.payload.stage !== stage) {
             setStage(event.payload.stage);
             addLog(`Remote update: Moved to ${event.payload.stage}`);
          }
          break;
        case 'SEQUENCE_UPDATE':
          setSequenceSteps(event.payload.steps);
          break;
        case 'SYNC_REQUEST':
          // A new player joined, send them our state
          multiplayerService.send({
            type: 'SYNC_RESPONSE',
            payload: { stage, sequenceSteps }
          });
          break;
        case 'SYNC_RESPONSE':
          // We joined, accepting state
          if (stage === GameStage.START || stage === GameStage.HOOK) {
             setStage(event.payload.stage);
             setSequenceSteps(event.payload.sequenceSteps);
          }
          break;
      }
    });
    return () => unsubscribe();
  }, [stage, sequenceSteps]);

  const addLog = (msg: string) => {
    setMetrics(prev => ({ ...prev, logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${msg}`] }));
  };

  // ----- Actions -----

  const handleInstructionsComplete = () => {
    setStage(GameStage.LOBBY);
  };

  const handleJoinSession = async (name: string, sessionId: string, mode: 'HOST' | 'JOIN') => {
    setPlayerName(name);
    setIsMultiplayer(true);
    setConnectionStatus('Connecting...');

    try {
      if (mode === 'HOST') {
        const id = await multiplayerService.createSession(name);
        setCurrentSessionId(id);
        setConnectionStatus('Session Created');
        // Auto start for host
        setStage(GameStage.START);
        addLog(`Hosted session: ${id}`);
      } else {
        await multiplayerService.joinSession(name, sessionId);
        setCurrentSessionId(sessionId);
        setConnectionStatus('Connected');
        
        // Notify others
        const joinMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'SYSTEM',
          text: `${name} has joined the crew.`,
          timestamp: Date.now(),
          isSystem: true
        };
        multiplayerService.send({ type: 'CHAT', payload: joinMsg });
        // Request State
        multiplayerService.send({ type: 'SYNC_REQUEST', payload: null });
        
        setStage(GameStage.START);
        addLog(`Joined session: ${sessionId}`);
      }
    } catch (err) {
      console.error("Connection failed", err);
      alert("Connection failed. Please check the ID and try again.");
      setConnectionStatus('Failed');
      setStage(GameStage.LOBBY);
    }
  };

  const broadcastStageChange = (newStage: GameStage) => {
    setStage(newStage);
    if (isMultiplayer) {
      multiplayerService.send({ type: 'STATE_UPDATE', payload: { stage: newStage } });
    }
  };

  const handleStart = () => {
    broadcastStageChange(GameStage.HOOK);
    addLog("Session Started");
  };

  const handleHookComplete = () => {
    broadcastStageChange(GameStage.ROOM_EXPLORATION);
    addLog("Entered Engine Room");
  };

  const handlePanelFound = () => {
    broadcastStageChange(GameStage.TERMINOLOGY);
    addLog("Fault Source Identified");
  };

  const handleTermCorrect = () => {
    broadcastStageChange(GameStage.MANUAL_ANALYSIS);
    addLog("Terminology Verified");
  };

  const handleManualCorrect = () => {
    broadcastStageChange(GameStage.SEQUENCE);
    addLog("Safety Limit Verified");
  };

  const handleSequenceStepComplete = (stepId: string) => {
    const newSteps = [...sequenceSteps, stepId];
    setSequenceSteps(newSteps);
    if (isMultiplayer) {
        multiplayerService.send({ type: 'SEQUENCE_UPDATE', payload: { steps: newSteps } });
    }

    if (newSteps.length === SEQUENCE_STEPS.length) {
        handleSequenceSuccess();
    }
  };

  const handleSequenceSuccess = () => {
    setTimeout(() => {
        broadcastStageChange(GameStage.SUCCESS);
        addLog("Sequence Completed. Power Restored.");
    }, 1000);
  };

  const handleMistake = () => {
    setMetrics(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
    addLog("Error Recorded");
  };

  const handleRestart = () => {
    setStage(GameStage.START);
    setMetrics({ timeElapsed: 0, mistakes: 0, stageReached: GameStage.START, logs: [] });
    setSequenceSteps([]);
    setHint('');
  };

  const requestHint = async () => {
    setLoadingHint(true);
    const result = await getChiefEngineerHint(stage, "Give me a hint");
    setHint(result);
    setLoadingHint(false);
    
    if (isMultiplayer) {
         const hintMsg: ChatMessage = {
             id: Date.now().toString(),
             sender: 'CHIEF ENGINEER',
             text: `HINT: ${result}`,
             timestamp: Date.now(),
             isSystem: false
         };
         multiplayerService.send({ type: 'CHAT', payload: hintMsg });
         setChatMessages(prev => [...prev, hintMsg]);
    }
    addLog("Hint Requested");
  };

  const sendChatMessage = (text: string) => {
    const msg: ChatMessage = {
        id: Date.now().toString(),
        sender: playerName,
        text,
        timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, msg]);
    if (isMultiplayer) {
        multiplayerService.send({ type: 'CHAT', payload: msg });
    }
  };

  if (stage === GameStage.INSTRUCTIONS) {
    return (
      <div className="h-screen w-full relative">
         <InstructionsStage onComplete={handleInstructionsComplete} />
         <div className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-50 font-mono z-50 pointer-events-none select-none">
           Created by Sercan UZUN
         </div>
      </div>
    );
  }

  if (stage === GameStage.LOBBY) {
      return (
        <div className="h-screen w-full relative">
          <LobbyStage onJoin={handleJoinSession} />
          <div className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-50 font-mono z-50 pointer-events-none select-none">
            Created by Sercan UZUN
          </div>
        </div>
      );
  }

  if (stage === GameStage.START) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white relative">
         <div className="absolute top-4 right-4 text-xs text-gray-500 font-mono text-right">
             <div className="text-white">ID: <span className="text-cyan-400 select-all">{currentSessionId}</span></div>
             <div>STATUS: {connectionStatus}</div>
         </div>
         {isMultiplayer && (
            <div className="absolute bottom-4 left-4">
                <ChatOverlay messages={chatMessages} onSendMessage={sendChatMessage} />
            </div>
         )}
        <h1 className="text-4xl font-bold mb-8">Naval Training Simulation</h1>
        <p className="mb-4 text-gray-400">Scenario: Emergency Generator Troubleshooting</p>
        
        {currentSessionId && (
            <div className="bg-slate-800 p-4 rounded border border-cyan-500/50 mb-8 text-center animate-pulse">
                <p className="text-xs text-gray-400 uppercase">Share this Session ID with your team:</p>
                <p className="text-2xl font-mono text-cyan-400 font-bold select-all mt-2">{currentSessionId}</p>
            </div>
        )}

        <button onClick={handleStart} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded text-xl font-bold transition-all">
          Initialize Simulation
        </button>
        
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-50 font-mono z-50 pointer-events-none select-none">
            Created by Sercan UZUN
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      <PedagogicalOverlay tag={context.tag} description={context.description} />
      
      <div className="flex-1 overflow-hidden">
        {stage === GameStage.HOOK && <HookStage onComplete={handleHookComplete} />}
        {stage === GameStage.ROOM_EXPLORATION && <RoomStage onPanelFound={handlePanelFound} />}
        {stage === GameStage.TERMINOLOGY && <TerminologyStage onCorrect={handleTermCorrect} onMistake={handleMistake} />}
        {stage === GameStage.MANUAL_ANALYSIS && <ManualStage onCorrect={handleManualCorrect} onMistake={handleMistake} />}
        {stage === GameStage.SEQUENCE && (
            <SequenceStage 
                completedSteps={sequenceSteps} 
                onStepComplete={handleSequenceStepComplete} 
                onMistake={handleMistake} 
            />
        )}
        {stage === GameStage.SUCCESS && <SuccessStage onFinish={() => setStage(GameStage.DASHBOARD)} />}
        {stage === GameStage.DASHBOARD && <Dashboard metrics={metrics} onRestart={handleRestart} />}
      </div>

      {stage !== GameStage.DASHBOARD && stage !== GameStage.SUCCESS && isMultiplayer && (
          <ChatOverlay messages={chatMessages} onSendMessage={sendChatMessage} />
      )}

      {stage !== GameStage.DASHBOARD && stage !== GameStage.SUCCESS && (
        <div className="h-16 bg-gray-950 border-t border-gray-700 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
             <div className="text-gray-400 text-sm font-mono">
                TIME: <span className="text-white text-lg">{Math.floor(metrics.timeElapsed / 60).toString().padStart(2, '0')}:{(metrics.timeElapsed % 60).toString().padStart(2, '0')}</span>
             </div>
             <div className="text-gray-400 text-sm font-mono hidden md:block">
                ERRORS: <span className="text-red-500 text-lg">{metrics.mistakes}</span>
             </div>
             {currentSessionId && <div className="text-xs font-mono text-cyan-800 bg-cyan-900/20 px-2 rounded border border-cyan-900 hidden md:block">ROOM: {currentSessionId}</div>}
          </div>
          
          <div className="flex items-center gap-4">
            {hint && <span className="text-yellow-400 text-xs md:text-sm italic mr-2 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-700 max-w-[200px] truncate">Chief: "{hint}"</span>}
            <button 
              onClick={requestHint} 
              disabled={loadingHint}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 text-sm font-bold rounded border border-gray-600 flex items-center gap-2 whitespace-nowrap"
            >
              {loadingHint ? '...' : 'Ask Chief'}
            </button>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-50 font-mono z-50 pointer-events-none select-none">
          Created by Sercan UZUN
      </div>
    </div>
  );
};
