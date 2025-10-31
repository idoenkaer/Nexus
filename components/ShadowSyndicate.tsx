
import React, { useState, useEffect } from 'react';
import { Briefcase, Users, ClipboardList, Send, CheckCircle, XCircle, Bot, Crosshair, FileSearch, Star, Coins, Gem } from 'lucide-react';
import { Card } from './Card';
import { SharedAppProps, Agent, SyndicateMission, ActiveMission } from '../types';
import { availableMissions } from '../data/missions';
import { agentsForHire } from '../data/agents';

const specialtyIcons: { [key: string]: React.ElementType } = {
    Infiltration: FileSearch,
    Combat: Crosshair,
    Intel: Bot,
};

const AgentAssignmentModal: React.FC<{
    mission: SyndicateMission;
    agents: Agent[];
    onAssign: (agentId: string) => void;
    onClose: () => void;
}> = ({ mission, agents, onAssign, onClose }) => {
    const compatibleAgents = agents.filter(a => a.status === 'Idle' && a.specialty === mission.requiredSpecialty);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-pop-in" onClick={onClose}>
            <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 w-full max-w-md shadow-lg shadow-red-500/30" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-cinzel text-red-300 mb-2">Assign Agent to:</h3>
                <p className="text-lg font-semibold text-white mb-4">{mission.title}</p>
                <div className="space-y-3">
                    {compatibleAgents.length > 0 ? compatibleAgents.map(agent => (
                        <div key={agent.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{agent.name}</p>
                                <p className="text-xs text-gray-400">Success Mod: +{(agent.successModifier * 100).toFixed(0)}%</p>
                            </div>
                            <button onClick={() => onAssign(agent.id)} className="bg-red-600 px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-500 transition-colors">
                                Assign
                            </button>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 italic">No compatible agents available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ShadowSyndicate: React.FC<SharedAppProps> = (props) => {
    const { hiredAgents, activeMissions, startMission, resolveMission } = props;
    const [activeTab, setActiveTab] = useState('missions');
    const [selectedMission, setSelectedMission] = useState<SyndicateMission | null>(null);
    const [missionResult, setMissionResult] = useState<{ mission: SyndicateMission, result: { success: boolean, rewards: string } } | null>(null);
    const [, setTick] = useState(0);

    useEffect(() => {
        const activeTimers = activeMissions.some(m => m.completionTime > Date.now());
        if (activeTimers) {
            const timer = setInterval(() => {
                setTick(t => t + 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [activeMissions]);

    const handleAssign = (agentId: string) => {
        if (selectedMission) {
            const success = startMission(selectedMission.id, agentId);
            // Can add feedback here if needed
            setSelectedMission(null);
        }
    };

    const handleDebrief = (missionId: string) => {
        const mission = availableMissions.find(m => m.id === missionId);
        if(mission) {
            const result = resolveMission(missionId);
            setMissionResult({ mission, result });
        }
    };
    
    const getRemainingTime = (completionTime: number) => {
        const remaining = completionTime - Date.now();
        if (remaining <= 0) return null;
        const seconds = Math.floor((remaining / 1000) % 60);
        const minutes = Math.floor(remaining / 1000 / 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderMissions = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableMissions.map(mission => {
                const SpecialtyIcon = specialtyIcons[mission.requiredSpecialty];
                return (
                    <div key={mission.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-red-300">{mission.title}</h4>
                            <p className="text-sm text-gray-400 mt-1 mb-3">{mission.description}</p>
                            <div className="text-xs space-y-1 text-gray-300">
                                <p className="flex items-center"><SpecialtyIcon className="w-4 h-4 mr-2 text-purple-400"/> Required: {mission.requiredSpecialty}</p>
                                <p className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400"/> Reward: {mission.rewards.xp} XP</p>
                                <p className="flex items-center"><Coins className="w-4 h-4 mr-2 text-yellow-600"/> Reward: {mission.rewards.sovereigns} Sov.</p>
                                {mission.rewards.soulShards && <p className="flex items-center"><Gem className="w-4 h-4 mr-2 text-purple-400"/> Reward: {mission.rewards.soulShards} Shard(s)</p>}
                            </div>
                        </div>
                        <button onClick={() => setSelectedMission(mission)} className="mt-4 w-full bg-purple-800/80 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors">
                            Assign Agent
                        </button>
                    </div>
                )
            })}
        </div>
    );
    
    const renderRoster = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hiredAgents.map(agent => {
                const SpecialtyIcon = specialtyIcons[agent.specialty];
                const isOnMission = agent.status === 'On Mission';
                return (
                    <div key={agent.id} className={`bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 text-center ${isOnMission ? 'opacity-60' : ''}`}>
                        <SpecialtyIcon className="w-10 h-10 mx-auto text-purple-400 mb-2" />
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="text-sm text-gray-400">{agent.specialty}</p>
                        <p className={`mt-2 text-xs font-bold ${isOnMission ? 'text-yellow-400' : 'text-green-400'}`}>{agent.status}</p>
                    </div>
                )
            })}
        </div>
    );
    
    const renderActiveOps = () => (
         <div className="space-y-4">
            {activeMissions.length > 0 ? activeMissions.map(active => {
                 const mission = availableMissions.find(m => m.id === active.missionId);
                 const agent = hiredAgents.find(a => a.id === active.agentId);
                 if (!mission || !agent) return null;

                 const remainingTime = getRemainingTime(active.completionTime);
                 
                 return (
                    <div key={active.missionId} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-red-300">{mission.title}</p>
                            <p className="text-sm text-gray-400">Agent: {agent.name}</p>
                        </div>
                        {remainingTime ? (
                            <div className="text-lg font-mono font-bold text-yellow-400 bg-gray-800/50 px-3 py-1 rounded-md">{remainingTime}</div>
                        ) : (
                            <button onClick={() => handleDebrief(active.missionId)} className="bg-green-600 px-4 py-2 text-sm font-semibold rounded-md hover:bg-green-500 transition-colors">
                                Debrief
                            </button>
                        )}
                    </div>
                 )
            }) : (
                <p className="text-center text-gray-500 italic py-8">No active operations.</p>
            )}
        </div>
    );

    return (
        <Card title="Syndicate Operations" icon={Briefcase}>
             {selectedMission && <AgentAssignmentModal mission={selectedMission} agents={hiredAgents} onAssign={handleAssign} onClose={() => setSelectedMission(null)} />}
             {missionResult && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-pop-in" onClick={() => setMissionResult(null)}>
                    <div className="bg-gray-900 border border-purple-500/50 rounded-lg p-6 w-full max-w-md shadow-lg shadow-purple-500/30 text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-cinzel text-purple-200 mb-2">Mission Complete: {missionResult.mission.title}</h3>
                        {missionResult.result.success ? (
                            <CheckCircle className="w-16 h-16 mx-auto text-green-500 my-4" />
                        ) : (
                            <XCircle className="w-16 h-16 mx-auto text-red-500 my-4" />
                        )}
                        <p className={`text-lg font-semibold mb-2 ${missionResult.result.success ? 'text-green-400' : 'text-red-400'}`}>
                            {missionResult.result.success ? 'Success' : 'Failure'}
                        </p>
                        <p className="text-gray-300 mb-4">Rewards: {missionResult.result.rewards}</p>
                        <button onClick={() => setMissionResult(null)} className="bg-gray-600 px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-500 transition-colors">
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setActiveTab('missions')} className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'missions' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>
                    <ClipboardList className="w-4 h-4 mr-2" /> Mission Board
                </button>
                <button onClick={() => setActiveTab('roster')} className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'roster' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>
                    <Users className="w-4 h-4 mr-2" /> Agent Roster
                </button>
                <button onClick={() => setActiveTab('active')} className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'active' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>
                    <Send className="w-4 h-4 mr-2" /> Active Operations
                </button>
            </div>
            <div className="animate-pop-in">
                {activeTab === 'missions' && renderMissions()}
                {activeTab === 'roster' && renderRoster()}
                {activeTab === 'active' && renderActiveOps()}
            </div>
        </Card>
    );
};
