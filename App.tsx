import React from 'react';
import { GameContainer } from './components/GameContainer';

function App() {
  return (
    <div className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 min-h-screen">
      <GameContainer />
    </div>
  );
}

export default App;