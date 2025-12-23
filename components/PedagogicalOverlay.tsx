import React from 'react';

interface Props {
  tag: string;
  description: string;
}

export const PedagogicalOverlay: React.FC<Props> = ({ tag, description }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-sm border-l-4 border-blue-500 p-3 max-w-xs shadow-lg animate-fade-in pointer-events-none">
      <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Pedagogical Context</div>
      <div className="font-bold text-white text-sm mb-1">{tag}</div>
      <div className="text-gray-300 text-xs leading-tight">{description}</div>
    </div>
  );
};