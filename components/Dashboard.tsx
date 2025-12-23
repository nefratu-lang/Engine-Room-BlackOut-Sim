import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StudentMetrics, GameStage } from '../types';

interface Props {
  metrics: StudentMetrics;
  onRestart: () => void;
}

const CLASS_AVERAGES = [
  { name: 'Detection', time: 15 },
  { name: 'Terminology', time: 25 },
  { name: 'Manual', time: 60 },
  { name: 'Sequence', time: 45 },
];

export const Dashboard: React.FC<Props> = ({ metrics, onRestart }) => {
  const studentData = [
    { name: 'Total Time (s)', value: metrics.timeElapsed, classAvg: 145 },
    { name: 'Mistakes', value: metrics.mistakes, classAvg: 2 },
  ];

  return (
    <div className="h-full w-full bg-gray-100 text-gray-900 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
            <p className="text-gray-600">Session Analysis: Engine Room Blackout</p>
          </div>
          <button onClick={onRestart} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Restart Simulation</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500 uppercase font-bold">Total Time</h3>
            <p className="text-4xl font-mono font-bold text-blue-600">{Math.floor(metrics.timeElapsed / 60)}m {metrics.timeElapsed % 60}s</p>
          </div>
          <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
            <h3 className="text-sm text-gray-500 uppercase font-bold">Total Errors</h3>
            <p className="text-4xl font-mono font-bold text-red-600">{metrics.mistakes}</p>
          </div>
          <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 uppercase font-bold">Outcome</h3>
            <p className="text-4xl font-mono font-bold text-green-600">{metrics.stageReached === GameStage.SUCCESS || metrics.stageReached === GameStage.DASHBOARD ? 'PASS' : 'FAIL'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Student vs Class Average</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Student" fill="#3b82f6" />
                  <Bar dataKey="classAvg" name="Class Avg" fill="#9ca3af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Session Log</h3>
            <div className="h-64 overflow-y-auto bg-gray-50 p-4 border rounded font-mono text-sm">
              {metrics.logs.length === 0 ? (
                <p className="text-gray-400">No events recorded.</p>
              ) : (
                <ul className="space-y-1">
                  {metrics.logs.map((log, i) => (
                    <li key={i} className="border-b border-gray-200 pb-1 last:border-0">{log}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};