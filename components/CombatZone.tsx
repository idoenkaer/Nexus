

import React, { useState, useEffect, useRef } from 'react';
import { UserProfileState, Enemy, RewardProps, Character } from '../types';
import { AvatarCard } from './AvatarCard';
import { Sword, Shield, Skull, Ghost, UserX, Dog, UserRound } from 'lucide-react';

const enemies: Enemy[] = [
    { name: 'Gutter Ghoul', avatar: Ghost, hp: 30, maxHp: 30, attack: 5, reward: { xp: 10, sovereigns: 2 } },
    { name: 'Rival Fledgling', avatar: UserX, hp: 50, maxHp: 50, attack: 8, reward: { xp: 20, sovereigns: 5 } },
    { name: 'Shadow Hound', avatar: Dog, hp: 40, maxHp: 40, attack: 12, reward: { xp: 25, sovereigns: 8 } },
];

interface CombatZoneProps extends RewardProps {
    addNarrativeLog: (prompt: string) => Promise<void>;
    character: Character;
}

export const CombatZone: React.FC<CombatZoneProps> = ({ userProfile, addCurrency, updateHealth, addNarrativeLog, character, tickBuffs }) => {
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [playerHp, setPlayerHp] = useState(userProfile.hp);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [isCombatOver, setIsCombatOver] = useState(false);
    const [isPlayerDefending, setIsPlayerDefending] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);

    const startNewFight = () => {
        const randomEnemy = { ...enemies[Math.floor(Math.random() * enemies.length)] };
        setEnemy(randomEnemy);
        setPlayerHp(userProfile.hp);
        setIsPlayerTurn(true);
        setIsCombatOver(false);
        setIsPlayerDefending(false);
        setCombatLog([`A rival ${randomEnemy.name} emerges from the shadows!`]);
        addNarrativeLog(`A challenger emerges from the darkness of the Arena: a fierce ${randomEnemy.name}. Describe the tense moments before blood is spilled.`);
    };

    useEffect(() => {
        startNewFight();
    }, []);

    useEffect(() => {
        // Auto-scroll combat log
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [combatLog]);

    const addLog = (message: string) => {
        setCombatLog(prev => [...prev, message]);
    };

    const handlePlayerAttack = () => {
        if (!isPlayerTurn || !enemy || isCombatOver) return;

        const attackBuff = userProfile.activeBuffs.flatMap(b => b.effects).find(e => e.stat === 'attack');
        const attackBonus = attackBuff ? attackBuff.value : 0;
        const playerStrength = userProfile.attributes.strength * 2; // Simple damage formula
        const damage = Math.floor(playerStrength + attackBonus + Math.random() * 5);
        
        addLog(`You strike the ${enemy.name} for ${damage} damage.${attackBonus > 0 ? ` (+${attackBonus} from buffs!)` : ''}`);
        
        const newEnemyHp = Math.max(0, enemy.hp - damage);
        setEnemy({ ...enemy, hp: newEnemyHp });

        tickBuffs();

        if (newEnemyHp <= 0) {
            addLog(`You defeated the ${enemy.name}!`);
            addLog(`You gained ${enemy.reward.xp} XP and ${enemy.reward.sovereigns} Sovereigns.`);
            addCurrency(enemy.reward.xp, enemy.reward.sovereigns);
            setIsCombatOver(true);
            updateHealth(playerHp); // Sync final hp with global state
            addNarrativeLog(`With a final, brutal blow, the hunter has vanquished the ${enemy.name}. Describe their savage victory and the bloody echo it leaves in the Arena.`);
        } else {
            setIsPlayerTurn(false);
            setTimeout(handleEnemyTurn, 1000);
        }
    };
    
    const handlePlayerDefend = () => {
        if (!isPlayerTurn || !enemy || isCombatOver) return;
        setIsPlayerDefending(true);
        addLog("You brace for impact, ready for the attack.");
        tickBuffs();
        setIsPlayerTurn(false);
        setTimeout(handleEnemyTurn, 1000);
    };

    const handleEnemyTurn = () => {
        if (!enemy) return;

        let damage = Math.floor(enemy.attack + Math.random() * 3);
        const defenseBuff = userProfile.activeBuffs.flatMap(b => b.effects).find(e => e.stat === 'defense');
        const defenseBonus = defenseBuff ? defenseBuff.value : 0;
        
        let finalDamage = damage;

        if (isPlayerDefending) {
            finalDamage = Math.floor(finalDamage / 2);
        }
        
        finalDamage = Math.max(0, finalDamage - defenseBonus);
        
        const damageReduction = damage - finalDamage;
        let logMessage = `${enemy.name} attacks you for ${finalDamage} damage.`;
        if (damageReduction > 0) {
            logMessage += ` (Reduced by ${damageReduction}!)`;
        }

        addLog(logMessage);
        setIsPlayerDefending(false);

        const newPlayerHp = Math.max(0, playerHp - finalDamage);
        setPlayerHp(newPlayerHp);

        if (newPlayerHp <= 0) {
            addLog("You have been defeated!");
            setIsCombatOver(true);
            updateHealth(0);
            addNarrativeLog(`The hunter has fallen in battle to the might of the ${enemy.name}. Describe their bitter defeat, but hint that even in death, a lesson is learned in the eternal darkness.`);
        } else {
            setIsPlayerTurn(true);
        }
    };

    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Player Card */}
                <AvatarCard 
                    name={character.name}
                    level={userProfile.level}
                    avatarIcon={UserRound}
                    hp={playerHp}
                    maxHp={userProfile.maxHp}
                    isPlayer={true}
                    isDefending={isPlayerDefending}
                />

                {/* Combat Info */}
                <div className="text-center">
                    <p className="font-cinzel text-2xl text-gray-400 mb-4">VS</p>
                    <div ref={logRef} className="h-40 bg-gray-900/50 p-2 rounded-lg text-left text-xs overflow-y-auto border border-gray-700">
                        {combatLog.map((msg, i) => <p key={i} className="mb-1 animate-pop-in">{`> ${msg}`}</p>)}
                    </div>
                </div>

                {/* Enemy Card */}
                {enemy ? (
                    <AvatarCard 
                        name={enemy.name}
                        avatarIcon={enemy.avatar}
                        hp={enemy.hp}
                        maxHp={enemy.maxHp}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                         <Skull className="w-16 h-16 text-gray-600" />
                    </div>
                )}
            </div>
            
            {/* Action Bar */}
            <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-center items-center space-x-4">
                {isCombatOver ? (
                    <button onClick={startNewFight} className="w-48 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-500 transition-colors">
                        {playerHp > 0 ? "Find New Prey" : "Rise Again"}
                    </button>
                ) : (
                    <>
                        <button onClick={handlePlayerAttack} disabled={!isPlayerTurn} className="flex items-center justify-center w-48 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            <Sword className="w-5 h-5 mr-2"/> Attack
                        </button>
                        <button onClick={handlePlayerDefend} disabled={!isPlayerTurn} className="flex items-center justify-center w-48 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <Shield className="w-5 h-5 mr-2"/> Defend
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
