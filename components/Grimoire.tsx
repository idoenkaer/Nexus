import React, { useState, useMemo } from 'react';
import { BookUser } from 'lucide-react';
import { Section } from './Section';
import { Card } from './Card';
import { npcs } from '../data/npcs';
import { NPC, SharedAppProps } from '../types';
import { lore as allLore } from '../data/lore';

type GrimoireTab = 'Dossiers' | 'Lore';

export const Grimoire: React.FC<Pick<SharedAppProps, 'collectedLoreIds'>> = ({ collectedLoreIds }) => {
    const [activeTab, setActiveTab] = useState<GrimoireTab>('Dossiers');
    const [selectedNpc, setSelectedNpc] = useState<NPC | null>(npcs[0] || null);
    
    const collectedLore = useMemo(() => {
        return allLore.filter(lore => collectedLoreIds.has(lore.id));
    }, [collectedLoreIds]);
    const [selectedLoreId, setSelectedLoreId] = useState<string | null>(collectedLore[0]?.id || null);

    const selectedLore = useMemo(() => {
        return allLore.find(l => l.id === selectedLoreId);
    }, [selectedLoreId]);

    const renderDossiers = () => {
        if (!selectedNpc) {
            return <p className="text-gray-500 text-center">No dossier selected.</p>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-2 pr-2 border-r border-gray-800 h-96 overflow-y-auto">
                    {npcs.map(npc => (
                        <div 
                            key={npc.id} 
                            onClick={() => setSelectedNpc(npc)} 
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent ${selectedNpc.id === npc.id ? 'bg-red-900/40 border-red-700/60' : 'hover:bg-gray-700/30'}`}
                        >
                            <div className="flex items-center">
                                <npc.icon className={`w-6 h-6 mr-3 flex-shrink-0 ${selectedNpc.id === npc.id ? 'text-red-300' : 'text-gray-400'}`} />
                                <div>
                                    <p className={`font-semibold ${selectedNpc.id === npc.id ? 'text-white' : 'text-gray-300'}`}>{npc.name}</p>
                                    <p className="text-xs text-gray-500">{npc.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="md:col-span-3">
                    <div className="sticky top-24">
                        <Card 
                            title={selectedNpc.name} 
                            subtitle={selectedNpc.title} 
                            icon={selectedNpc.icon}
                            className="bg-transparent border-none shadow-none hover:-translate-y-0"
                        >
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedNpc.description}</p>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    const renderLore = () => {
        if (collectedLore.length === 0) {
            return <p className="text-gray-500 text-center italic mt-8">No lore fragments collected yet. Secrets await in the shadows...</p>;
        }
        return (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-2 pr-2 border-r border-gray-800 h-96 overflow-y-auto">
                    {collectedLore.map(lore => (
                        <div 
                            key={lore.id} 
                            onClick={() => setSelectedLoreId(lore.id)} 
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent ${selectedLoreId === lore.id ? 'bg-purple-900/40 border-purple-700/60' : 'hover:bg-gray-700/30'}`}
                        >
                            <p className={`font-semibold ${selectedLoreId === lore.id ? 'text-white' : 'text-gray-300'}`}>{lore.title}</p>
                        </div>
                    ))}
                </div>
                <div className="md:col-span-3">
                    {selectedLore && (
                         <div className="sticky top-24">
                            <Card 
                                title={selectedLore.title} 
                                className="bg-transparent border-none shadow-none hover:-translate-y-0"
                            >
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed italic">{selectedLore.content}</p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <p className="text-gray-400 mb-6 italic">"A collection of whispers and truths about the players in this eternal game. Knowledge is a weapon; keep your arsenal sharp."</p>
            
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setActiveTab('Dossiers')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'Dossiers' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>Dossiers</button>
                <button onClick={() => setActiveTab('Lore')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'Lore' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>Lore</button>
            </div>
            
            {activeTab === 'Dossiers' ? renderDossiers() : renderLore()}
        </div>
    );
};