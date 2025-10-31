import React, { useState, useMemo } from 'react';
import { SharedAppProps, SocialConflict, RPGQuestConsequence, SocialConflictChoice } from '../types';
import { socialConflicts } from '../data/socialConflicts';
import { npcs } from '../data/npcs';
import { Card } from './Card';
import { Users, BookOpen, Check, X, Shield, HandMetal, Angry, UserCheck, Drama, Meh, Dices } from 'lucide-react';
import { reputationIcons } from './RPGCharacterCard';
import { rollDice, DiceRollResult } from '../utils/dice';
import { DiceRoller } from './DiceRoller';

interface SocialConflictZoneProps extends SharedAppProps {
    conflictId: number;
    onComplete: () => void;
    addNarrativeLog: (prompt: string) => Promise<void>;
}

export const SocialConflictZone: React.FC<SocialConflictZoneProps> = (props) => {
    const { conflictId, onComplete, addNarrativeLog, userProfile } = props;
    
    const conflict = useMemo(() => socialConflicts.find(c => c.id === conflictId), [conflictId]);
    const npc = useMemo(() => npcs.find(n => n.id === conflict?.npcId), [conflict]);
    
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [usedChoices, setUsedChoices] = useState<number[]>([]);
    const [isResolved, setIsResolved] = useState(false);
    const [diceRoll, setDiceRoll] = useState<{result: DiceRollResult, choice: SocialConflictChoice} | null>(null);


    const addLog = (message: string) => {
        setLog(prev => [...prev.slice(-10), message]);
    };

    const processConsequences = (consequences: RPGQuestConsequence[]) => {
        consequences.forEach(con => {
            switch (con.type) {
                case 'addCurrency': props.addCurrency(con.payload.xp, con.payload.sovereigns); break;
                case 'updateAttribute': props.updateAttribute(con.payload.attribute, con.payload.amount); break;
                case 'updateRelationship': props.updateNPCRelationship(con.payload.npcId, con.payload.newStatus); break;
                case 'setQuest': props.setCurrentQuestId(con.payload.questId); break;
                case 'updateReputation': props.updateReputation(con.payload); break;
                case 'updateNPCMood': props.updateNPCMood(con.payload.npcId, con.payload.newMood); break;
                default: break;
            }
        });
    };

    const handleResolve = (isSuccess: boolean) => {
        if (!conflict) return;
        setIsResolved(true);
        const outcome = isSuccess ? conflict.onSuccess : conflict.onFailure;
        addNarrativeLog(outcome.narrativeLog);
        addLog(`> OUTCOME: ${outcome.narrativeLog}`);
        processConsequences(outcome.consequences);
        setTimeout(onComplete, 4000);
    };
    
    const handleDiceRollComplete = () => {
        if (!diceRoll || !conflict) return;

        const { result, choice } = diceRoll;
        const successesNeeded = choice.diceCheck?.successesNeeded || 1;
        const success = result.successes >= successesNeeded;

        const logMsg = success ? `[SUCCESS] ${choice.successLog || choice.narrativeLog}` : `[FAILURE] ${choice.failureLog || "Your attempt falls flat."}`;
        addLog(`> ${logMsg}`);
        addNarrativeLog(logMsg);

        if (success) {
            setProgress(p => p + 1);
            processConsequences(choice.consequences);
        }
        
        setDiceRoll(null);

        // Defer resolution check to allow UI to update
        setTimeout(() => {
            if (progress + (success ? 1 : 0) >= conflict.successThreshold) {
                handleResolve(true);
            } else if (usedChoices.length >= conflict.choices.length) {
                handleResolve(false);
            }
        }, 100);
    };


    const handleChoice = (choice: SocialConflictChoice, index: number) => {
        if (!conflict) return;

        setUsedChoices(prev => [...prev, index]);
        
        if (choice.diceCheck) {
            const { attribute, ability, difficulty } = choice.diceCheck;
            const attributeValue = userProfile.attributes[attribute] || 0;
            const abilityValue = userProfile.abilities[ability] || 0;
            const poolSize = attributeValue + abilityValue;
            
            addLog(`> Rolling ${poolSize} dice (${attribute} ${attributeValue} + ${ability} ${abilityValue}) vs difficulty ${difficulty}...`);
            const result = rollDice(poolSize, difficulty);
            setDiceRoll({ result, choice });
        } else {
            // Non-dice check choice
            addLog(`> ${choice.narrativeLog}`);
            addNarrativeLog(choice.narrativeLog);
            setProgress(p => p + 1);
            processConsequences(choice.consequences);
            setTimeout(() => {
                 if (progress + 1 >= conflict.successThreshold) {
                    handleResolve(true);
                } else if (usedChoices.length >= conflict.choices.length) {
                    handleResolve(false);
                }
            }, 100);
        }
    };

    if (!conflict || !npc) {
        return <div className="text-center text-red-500">Error: Conflict or NPC not found.</div>;
    }

    const NpcIcon = npc.icon;

    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 shadow-lg animate-pop-in max-w-4xl mx-auto">
            {diceRoll && <DiceRoller 
                rollResult={diceRoll.result}
                difficulty={diceRoll.choice.diceCheck?.difficulty || 6}
                poolSize={(userProfile.attributes[diceRoll.choice.diceCheck!.attribute] || 0) + (userProfile.abilities[diceRoll.choice.diceCheck!.ability] || 0)}
                title={diceRoll.choice.diceCheck!.ability}
                onClose={handleDiceRollComplete}
            />}
            <h2 className="text-3xl font-bold font-cinzel text-red-400 mb-2">{conflict.title}</h2>
            <p className="text-gray-400 mb-4">{conflict.objective}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center bg-gray-900/40 p-4 rounded-lg border border-gray-700">
                    <NpcIcon className="w-24 h-24 text-red-300 mb-3" />
                    <h3 className="text-xl font-bold font-cinzel">{npc.name}</h3>
                    <p className="text-sm text-gray-500">{npc.title}</p>
                </div>
                <div className="md:col-span-2">
                    <Card title="Situation Report" icon={BookOpen} className="bg-transparent border-none shadow-none p-0">
                         <p className="text-gray-300 italic mb-4">{conflict.description}</p>
                         <div className="h-40 bg-gray-900/50 p-2 rounded-lg text-left text-xs overflow-y-auto border border-gray-700 font-mono">
                            {log.map((msg, i) => <p key={i} className="mb-1 animate-pop-in">{msg}</p>)}
                            {!log.length && <p className="text-gray-500">Awaiting your move...</p>}
                        </div>
                    </Card>
                </div>
            </div>
            
            <div className="my-4">
                <div className="flex justify-between items-center mb-1 text-sm font-semibold">
                    <span>Progress to Success</span>
                    <span>{progress} / {conflict.successThreshold}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-purple-600 to-red-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(progress / conflict.successThreshold) * 100}%` }}></div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700/50">
                {isResolved ? (
                     <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="text-xl font-cinzel text-purple-300">The conversation has ended.</h3>
                        <p className="text-gray-400">The consequences are now in motion...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                    {conflict.choices.map((choice, index) => {
                        const isUsed = usedChoices.includes(index);
                        return (
                            <button key={index} onClick={() => handleChoice(choice, index)} disabled={isUsed} className="text-left bg-gray-700 text-white p-3 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed">
                                {choice.diceCheck && (
                                    <span className={`flex items-center text-xs font-bold mb-1 text-purple-300`}>
                                        <Dices className="w-3 h-3 mr-1.5"/>
                                        {choice.diceCheck.ability} Check
                                    </span>
                                )}
                                {choice.text}
                            </button>
                        );
                    })}
                </div>
                )}
            </div>
        </div>
    );
};
