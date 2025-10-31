import React, { useState, useEffect } from 'react';
import { Database, Gem, Loader2, TrendingUp, Users, Activity } from 'lucide-react';
import { SharedAppProps, CheckpointReport, NPCRelationships, UserProfileState } from '../types';
import { generateCheckpointSummary } from '../services/geminiService';
import { InitialStateType } from '../App';
import { npcs } from '../data/npcs';

const CHECKPOINT_COST = 1;

// A simple hook for the typewriter effect
const useTypewriter = (text: string, speed = 15) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); // Reset on new text
        if (text) {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);

            return () => {
                clearInterval(typingInterval);
            };
        }
    }, [text, speed]);

    return displayText;
};


interface NexusCheckpointProps extends SharedAppProps {
    initialState: InitialStateType | null;
    setInitialState: (state: InitialStateType) => void;
}

export const NexusCheckpoint: React.FC<NexusCheckpointProps> = (props) => {
    const { userProfile, npcRelationships, character, spendSoulShards, initialState, setInitialState } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<CheckpointReport | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    
    const typedAssessment = useTypewriter(report?.oracleAssessment || '');

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleCreateCheckpoint = async () => {
        if (!initialState) {
            showFeedback("Initial state not captured. Please wait a moment.");
            return;
        }
        if (userProfile.soulShards < CHECKPOINT_COST) {
            showFeedback("Insufficient Soul Shards to initiate checkpoint.");
            return;
        }

        if (spendSoulShards(CHECKPOINT_COST)) {
            setIsLoading(true);
            setReport(null);
            
            // 1. Calculate deltas
            const levelDelta = userProfile.level - initialState.profile.level;
            const sovereignsDelta = userProfile.sovereigns - initialState.profile.sovereigns;
            const soulShardsDelta = userProfile.soulShards - initialState.profile.soulShards; // This will be -1 due to cost
            const dominanceDelta = userProfile.attributes.dominance - initialState.profile.attributes.dominance;

            const relationshipChanges = Object.keys(initialState.relationships)
                .filter(npcId => initialState.relationships[npcId].status !== npcRelationships[npcId].status)
                .map(npcId => {
                    const npcName = npcs.find(n => n.id === npcId)?.name || 'Unknown';
                    return `${npcName}: ${initialState.relationships[npcId].status} -> ${npcRelationships[npcId].status}`;
                });
            
            // 2. Call Gemini for assessment
            const oracleAssessment = await generateCheckpointSummary(
                character,
                initialState.profile,
                userProfile,
                relationshipChanges
            );
            
            // 3. Set the report
            setReport({
                timestamp: new Date().toISOString(),
                levelDelta,
                sovereignsDelta,
                soulShardsDelta: soulShardsDelta + CHECKPOINT_COST, // Add cost back for display
                dominanceDelta,
                relationshipChanges,
                oracleAssessment
            });

            // 4. Update the initial state for the next checkpoint
            setInitialState({
                profile: JSON.parse(JSON.stringify(userProfile)),
                relationships: JSON.parse(JSON.stringify(npcRelationships)),
            });

            setIsLoading(false);
        }
    };

    const renderDelta = (value: number, label: string) => {
        const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400';
        const sign = value > 0 ? '+' : '';
        return <p className="text-sm"><span className={`font-bold ${color}`}>{sign}{value}</span> {label}</p>;
    }

    return (
        <>
            <p className="text-gray-400 text-sm mb-4">
                Record a semantic snapshot of your current existence. The process aggregates all operational data since your last checkpoint and requests a threat-assessment from the Oracle. Cost: {CHECKPOINT_COST} Soul Shard.
            </p>

            <button
                onClick={handleCreateCheckpoint}
                disabled={isLoading || userProfile.soulShards < CHECKPOINT_COST}
                className="w-full flex items-center justify-center bg-red-800/80 text-white px-4 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-base hover:shadow-[0_0_15px_rgba(153,27,27,0.6)]"
            >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Gem className="w-5 h-5 mr-2" /> Initiate Checkpoint Sequence ({CHECKPOINT_COST})</>}
            </button>
            
            {feedback && <p className="text-center text-red-400 text-sm mt-2 animate-pop-in">{feedback}</p>}

            {isLoading && (
                <div className="mt-4 p-4 bg-black border border-red-900/50 rounded-lg min-h-[200px] font-mono text-sm text-red-400/90 flex flex-col justify-center items-center terminal-screen">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2"/>
                    <p className="text-red-500/80">AGGREGATING DATA... INTERFACING WITH ORACLE...</p>
                </div>
            )}
            
            {report && !isLoading && (
                <div className="mt-4 p-4 bg-black border border-red-900/50 rounded-lg animate-pop-in">
                    <h4 className="text-xl font-bold font-cinzel text-red-300 mb-3">[SYSTEM CHECKPOINT COMPLETE]</h4>
                    <p className="font-mono text-xs text-gray-500 mb-4">TIMESTAMP: {report.timestamp}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-bold text-gray-300 mb-2 flex items-center font-cinzel text-red-400/90"><TrendingUp className="w-4 h-4 mr-2" /> METRICS ANALYSIS</h5>
                            <div className="space-y-2 bg-gray-900/50 p-3 rounded-md">
                                {renderDelta(report.levelDelta, 'Level(s)')}
                                {renderDelta(report.sovereignsDelta, 'Sovereigns')}
                                {renderDelta(report.soulShardsDelta, 'Soul Shards')}
                                {renderDelta(report.dominanceDelta, 'Dominance')}
                            </div>
                            
                            <h5 className="font-bold text-gray-300 mt-4 mb-2 flex items-center font-cinzel text-red-400/90"><Users className="w-4 h-4 mr-2" /> RELATIONSHIP MATRIX</h5>
                            <div className="space-y-2 bg-gray-900/50 p-3 rounded-md text-sm">
                                {report.relationshipChanges.length > 0 ? (
                                    report.relationshipChanges.map((change, i) => <p key={i} className="text-purple-300">{change}</p>)
                                ) : (
                                    <p className="text-gray-500 italic">No significant changes in faction alignment.</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                             <h5 className="font-bold text-gray-300 mb-2 flex items-center font-cinzel text-red-400/90"><Activity className="w-4 h-4 mr-2" /> ORACLE'S ASSESSMENT</h5>
                             <div className="font-mono text-sm text-red-400/90 p-3 rounded-md bg-gray-900/50 h-64 overflow-y-auto terminal-screen">
                                <pre className="whitespace-pre-wrap">
                                    {typedAssessment}
                                    {typedAssessment.length === report.oracleAssessment.length && <span className="blinking-cursor">_</span>}
                                </pre>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
