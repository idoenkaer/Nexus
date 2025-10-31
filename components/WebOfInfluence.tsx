import React from 'react';
import { NPCRelationships, NPCRelationshipStatus, SharedAppProps } from '../types';
import { Card } from './Card';
import { npcs } from '../data/npcs';

const statusStyles: Record<NPCRelationshipStatus, string> = {
    Loyal: 'border-green-500/80 hover:shadow-green-500/40',
    Neutral: 'border-gray-600/80 hover:shadow-gray-400/30',
    Rival: 'border-yellow-600/80 hover:shadow-yellow-500/40',
    Enemy: 'border-red-600/80 hover:shadow-red-500/40',
};

const moodGlow: { [key: string]: string } = {
  // Positive
  Pleased: 'shadow-[0_0_15px_rgba(34,197,94,0.4)]',
  Intrigued: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
  Respectful: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]',
  Trusting: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
  // Neutral
  Pragmatic: '',
  Wary: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
  Suspicious: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]',
  Dismissive: 'shadow-[0_0_15px_rgba(107,114,128,0.4)]',
  // Negative
  Annoyed: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  Hostile: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
  Furious: 'shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse',
  Hateful: 'shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse',
  Territorial: 'shadow-[0_0_15px_rgba(202,138,4,0.5)]',
  Impressed: 'shadow-[0_0_15px_rgba(20,184,166,0.4)]'
}

export const WebOfInfluence: React.FC<Pick<SharedAppProps, 'npcRelationships'>> = ({ npcRelationships }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {npcs.map(npc => {
        const relationship = npcRelationships[npc.id];
        if (!relationship) return null;

        const cardClasses = `
          bg-gray-800/50 backdrop-blur-md border rounded-lg p-3 text-center
          transition-all duration-300 ease-in-out shadow-lg hover:-translate-y-1
          ${statusStyles[relationship.status]} ${moodGlow[relationship.mood] || ''}
        `;

        return (
          <Card 
            key={npc.id} 
            title={npc.name} 
            subtitle={npc.title}
            overrideClassName={cardClasses}
          >
            <div className="flex flex-col items-center mt-2">
                <npc.icon className="w-12 h-12 text-gray-300 mb-2" />
                 <div className="relative group">
                    <span 
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-black/30`}
                    >
                        {relationship.status}
                    </span>
                    <div className="absolute bottom-full mb-2 w-max bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        Mood: {relationship.mood}
                    </div>
                </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
