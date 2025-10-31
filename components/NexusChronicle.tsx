
import React, { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { NarrativeLog } from '../types';

interface NexusChronicleProps {
  logs: NarrativeLog[];
}

export const NexusChronicle: React.FC<NexusChronicleProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-lg h-64 flex flex-col">
      <div className="flex items-center mb-3 text-red-400">
        <BookOpen className="w-5 h-5 mr-3" />
        <h4 className="text-lg font-bold font-cinzel">Shadow Chronicle</h4>
      </div>
      <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-3 pr-2">
        {logs.length === 0 && (
            <p className="text-gray-500 text-sm italic text-center pt-8">The chronicle is yet unwritten...</p>
        )}
        {logs.map(log => (
            <p key={log.id} className="text-gray-300 text-sm italic animate-pop-in">
                {log.text}
            </p>
        ))}
      </div>
    </div>
  );
};