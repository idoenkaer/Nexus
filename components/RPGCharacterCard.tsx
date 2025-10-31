import React, { useState, useMemo } from 'react';
import { RPGItem, Character, ArchetypeName, SharedAppProps, RPGQuestChoice, RPGQuestConsequence, NPCRelationshipStatus, OriginName, ReputationType, AbilityName, AttributeName } from '../types';
import { Sword, Shield, BookOpen, Star, Coins, Gem, ShieldPlus, Crosshair, UserRound, Edit3, Crown, Dog, Sparkles, Briefcase, FileSearch, HandMetal, Angry, Smile, Meh, Drama, History, UserCheck, Trophy, PlusCircle } from 'lucide-react';
import { Card } from './Card';
import { quests as allQuests } from '../data/quests';
import { origins } from '../data/origins';
import { achievements } from '../data/achievements';

const initialShopItems: RPGItem[] = [
    { id: 1, name: "Health Potion", description: "Heals 25 HP.", cost: 25, icon: 'ShieldPlus', type: 'Potion', effect: { type: 'heal', payload: { amount: 25 } } },
    { id: 2, name: "Silver Dagger", description: "A quick and silent blade, useful for many things.", cost: 75, icon: 'Sword', type: 'Misc' },
];

const archetypeData: Record<ArchetypeName, { name: string; icon: React.ElementType; description: string }> = {
    Vampire: { name: 'Alpha Vampire', icon: Crown, description: "Charismatic, commanding, and cunning." },
    Werewolf: { name: 'Renegade Werewolf', icon: Dog, description: "Fiercely loyal, hot-tempered, and rebellious." },
    Warlock: { name: 'Warlock Enforcer', icon: Sparkles, description: "Brooding, perceptive, and dangerously intelligent." },
    Syndicate: { name: 'Syndicate Boss', icon: Briefcase, description: "Ruthless, power-hungry, and menacing." },
    Hunter: { name: 'Hunter-Investigator', icon: FileSearch, description: "Stoic, relentless, and haunted by the past." },
};

export const reputationIcons: Record<ReputationType, React.ElementType> = {
    Feared: Angry,
    Honorable: UserCheck,
    Devious: Drama,
    Neutral: Meh,
}

const Customization: React.FC<{
    character: Character, 
    setCharacter: (c: Character) => void, 
    setCurrentQuestId: (id: number) => void,
    userProfile: SharedAppProps['userProfile'],
    spendXp: SharedAppProps['spendXp'],
    showFeedback: (type: 'success' | 'error', message: string) => void,
}> = ({ character, setCharacter, setCurrentQuestId, userProfile, spendXp, showFeedback }) => {

    const handleSpendXp = (ability: AbilityName) => {
        if (spendXp(ability)) {
            showFeedback('success', `${ability} increased!`);
        } else {
            showFeedback('error', 'Not enough XP or max level reached.');
        }
    }

    const getXpCost = (ability: AbilityName): number => {
        const currentRating = userProfile.abilities[ability];
        return (currentRating + 1) * 3;
    }

    return (
        <div className="space-y-4 animate-pop-in">
            <div>
                <label className="text-xs font-semibold text-gray-400">Alias</label>
                <div className="relative">
                    <input 
                        type="text"
                        value={character.name}
                        onChange={(e) => setCharacter({...character, name: e.target.value, origin: character.origin})}
                        className="w-full bg-gray-900/80 border border-gray-700 rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
            </div>
            <div>
                <label className="text-xs font-semibold text-gray-400">Archetype</label>
                <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(archetypeData) as ArchetypeName[]).map(key => {
                        const archetype = archetypeData[key];
                        const isSelected = character.archetype === key;
                        return (
                             <button 
                                key={key}
                                onClick={() => {
                                    setCharacter({...character, archetype: key});
                                    // Reset to the first quest on archetype change
                                    setCurrentQuestId(1); 
                                }}
                                className={`p-2 rounded-md transition-all border ${isSelected ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-gray-900/50 text-gray-400 hover:bg-gray-700/50 border-gray-700'}`}
                                title={archetype.description}
                            >
                                <archetype.icon className="w-6 h-6 mx-auto mb-1"/>
                                <p className="text-xs font-semibold">{archetype.name.split(' ')[1]}</p>
                            </button>
                        )
                    })}
                </div>
            </div>
            <div>
                <label className="text-xs font-semibold text-gray-400">Spend Experience (Current XP: {userProfile.xp})</label>
                <div className="bg-gray-900/50 p-2 rounded-lg space-y-2">
                    {Object.keys(userProfile.abilities).map(key => {
                        const ability = key as AbilityName;
                        const rating = userProfile.abilities[ability];
                        const cost = getXpCost(ability);
                        const canAfford = userProfile.xp >= cost && rating < 5;
                        return (
                            <div key={ability} className="flex items-center justify-between text-sm">
                                <span className="font-semibold">{ability}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-full ml-1 ${i < rating ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => handleSpendXp(ability)} 
                                        disabled={!canAfford}
                                        className="flex items-center text-xs px-2 py-1 rounded bg-gray-700 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {cost} XP <PlusCircle className="w-3 h-3 ml-1.5"/>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

interface RPGCharacterCardProps extends SharedAppProps {
    addNarrativeLog: (prompt: string) => Promise<void>;
    setActiveConflictId: (id: number | null) => void;
}

export const RPGCharacterCard: React.FC<RPGCharacterCardProps> = (props) => {
    const { userProfile, addCurrency, spendSovereigns, spendXp, inventory, addItem, useItem, addNarrativeLog, character, setCharacter, currentQuestId, updateAttribute, updateNPCRelationship, updateNPCMood, updateReputation, setCurrentQuestId, setActiveConflictId, addLore, unlockedAchievementIds } = props;

    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [activeTab, setActiveTab] = useState<'stats' | 'customization' | 'achievements'>('stats');

    const currentQuest = useMemo(() => {
        return allQuests.find(q => q.id === currentQuestId);
    }, [currentQuestId]);
    
    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };


    const processConsequences = (consequences: RPGQuestConsequence[]) => {
        consequences.forEach(con => {
            switch (con.type) {
                case 'addCurrency':
                    addCurrency(con.payload.xp, con.payload.sovereigns);
                    showFeedback('success', `Gained ${con.payload.xp} XP & ${con.payload.sovereigns} Sov.`);
                    break;
                case 'updateAttribute':
                    updateAttribute(con.payload.attribute, con.payload.amount);
                    break;
                case 'updateRelationship':
                    updateNPCRelationship(con.payload.npcId, con.payload.newStatus as NPCRelationshipStatus);
                    break;
                case 'setQuest':
                    setCurrentQuestId(con.payload.questId);
                    break;
                case 'branchOnArchetype':
                    const archetypeConsequences = con.payload[character.archetype] || con.payload['default'];
                    if (archetypeConsequences) {
                        processConsequences(archetypeConsequences);
                    }
                    break;
                case 'updateReputation':
                    updateReputation(con.payload);
                    break;
                case 'updateNPCMood':
                    updateNPCMood(con.payload.npcId, con.payload.newMood);
                    break;
                case 'startSocialConflict':
                    setActiveConflictId(con.payload.conflictId);
                    break;
                case 'addLore':
                    addLore(con.payload.loreId);
                    showFeedback('success', `New lore acquired!`);
                    break;
                default:
                    break;
            }
        });
    };

    const handleChoiceClick = (choice: RPGQuestChoice) => {
        addNarrativeLog(choice.narrativeLog);
        processConsequences(choice.consequences);
    };

    const handleBuyItem = (item: RPGItem) => {
        if (spendSovereigns(item.cost)) {
            addItem(item);
            showFeedback('success', `Purchased ${item.name}!`);
        } else {
            showFeedback('error', 'Not enough Sovereigns!');
        }
    };

    const handleUseItem = (itemId: number) => {
        useItem(itemId);
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            showFeedback('success', `Used ${item.name}.`);
        }
    };

    const xpPercentage = (userProfile.xp / userProfile.xpToNextLevel) * 100;
    const CharacterAvatar = archetypeData[character.archetype]?.icon || UserRound;
    
    const getIcon = (iconName: string) => {
        if(iconName === 'ShieldPlus') return <ShieldPlus className="w-5 h-5 mr-2 text-green-400" />;
        if(iconName === 'Sword') return <Sword className="w-5 h-5 mr-2 text-gray-400" />;
        return null;
    }
    
    const unlockedAchievementsList = useMemo(() => achievements.filter(a => unlockedAchievementIds.has(a.id)), [unlockedAchievementIds]);

    const renderDots = (rating: number) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ml-1 ${i < rating ? 'bg-red-500' : 'bg-gray-700'}`}></div>
            ))}
        </div>
    );

    return (
        <Card title="Umbral Agent Dossier" icon={Crosshair} className="bg-gray-800/70 flex flex-col">
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-4">
                        <CharacterAvatar className="w-12 h-12 mr-4 text-red-300" />
                        <div>
                            <h4 className="text-xl font-bold text-red-300 font-cinzel">{character.name}</h4>
                            <p className="text-sm text-gray-400">Lvl {userProfile.level} {archetypeData[character.archetype].name}</p>
                            <p className="text-xs text-purple-300">{character.origin}</p>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-700 mb-4">
                        <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'stats' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>Stats & Narrative</button>
                        <button onClick={() => setActiveTab('achievements')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'achievements' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>Achievements</button>
                        <button onClick={() => setActiveTab('customization')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'customization' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>Customize</button>
                    </div>

                    {activeTab === 'stats' && (
                        <div className="animate-pop-in">
                            <div className="mb-4">
                                <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
                                    <span>XP</span>
                                    <span>{userProfile.xp} / {userProfile.xpToNextLevel}</span>
                                </div>
                                <div className="w-full bg-gray-900/50 rounded-full h-3 shadow-inner">
                                    <div className="bg-gradient-to-r from-red-600 to-red-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden xp-bar-animate" style={{ width: `${xpPercentage}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h5 className="font-bold text-gray-400 text-sm mb-2 font-cinzel">Attributes</h5>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between"><span>Strength</span> <span className="font-bold">{userProfile.attributes.strength}</span></div>
                                        <div className="flex justify-between"><span>Dexterity</span> <span className="font-bold">{userProfile.attributes.dexterity}</span></div>
                                        <div className="flex justify-between"><span>Dominance</span> <span className="font-bold">{userProfile.attributes.dominance}</span></div>
                                        <div className="flex justify-between"><span>Intelligence</span> <span className="font-bold">{userProfile.attributes.intelligence}</span></div>
                                        <div className="flex justify-between"><span>Wits</span> <span className="font-bold">{userProfile.attributes.wits}</span></div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-400 text-sm mb-2 font-cinzel">Abilities</h5>
                                    <div className="space-y-1 text-sm">
                                        {Object.keys(userProfile.abilities).map(key => {
                                            const ability = key as AbilityName;
                                            return (
                                                <div key={ability} className="flex justify-between">
                                                    <span>{ability}</span>
                                                    {renderDots(userProfile.abilities[ability])}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="font-bold text-gray-300 mb-2 flex items-center font-cinzel"><Gem className="w-4 h-4 mr-2 text-yellow-400" /> Active Narrative</h5>
                                {currentQuest ? (
                                    <div className="bg-gray-900/50 p-3 rounded-lg">
                                        <p className="font-semibold text-red-400">{currentQuest.title}</p>
                                        <p className="text-sm text-gray-400 mb-3">{currentQuest.description}</p>
                                        <div className="space-y-2">
                                            {currentQuest.choices.map((choice, index) => (
                                                <button key={index} onClick={() => handleChoiceClick(choice)} className="w-full text-left bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors">
                                                    {choice.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : <p className="text-sm text-gray-500 italic">The threads of fate are still. No new path reveals itself.</p>}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'customization' && <Customization character={character} setCharacter={setCharacter} setCurrentQuestId={setCurrentQuestId} userProfile={userProfile} spendXp={spendXp} showFeedback={showFeedback} />}

                    {activeTab === 'achievements' && (
                        <div className="animate-pop-in space-y-2 h-80 overflow-y-auto pr-2">
                            {unlockedAchievementsList.length > 0 ? unlockedAchievementsList.map(ach => {
                                const Icon = ach.icon;
                                return (
                                <div key={ach.id} className="flex items-start bg-gray-900/50 p-3 rounded-lg">
                                    <Icon className="w-8 h-8 mr-4 text-yellow-400 flex-shrink-0" />
                                    <div>
                                        <h5 className="font-bold text-red-300">{ach.name}</h5>
                                        <p className="text-sm text-gray-400">{ach.description}</p>
                                        <p className="text-xs text-green-400 italic mt-1">{ach.bonusDescription}</p>
                                    </div>
                                </div>
                                );
                            }) : <p className="text-sm text-gray-500 italic text-center pt-8">Your legend is yet to be written.</p>}
                        </div>
                    )}
                </div>
                
                {activeTab === 'stats' && (
                  <div className="mt-auto animate-pop-in">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <h5 className="font-bold text-gray-300 mb-2 font-cinzel">Black Market</h5>
                              <div className="bg-gray-900/50 p-2 rounded-lg space-y-2">
                                  {initialShopItems.map(item => (
                                      <div key={item.id} className="flex items-center justify-between">
                                          <div className="text-sm">{item.name}</div>
                                          <button onClick={() => handleBuyItem(item)} className="flex items-center bg-yellow-700 px-2 py-1 rounded-md text-xs font-semibold hover:bg-yellow-600">
                                              <Coins className="w-3 h-3 mr-1" /> {item.cost}
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <h5 className="font-bold text-gray-300 mb-2 font-cinzel">Inventory</h5>
                              <div className="bg-gray-900/50 p-2 rounded-lg h-20 overflow-y-auto space-y-1">
                                  {inventory.length > 0 ? inventory.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between text-sm bg-gray-700/50 p-1 rounded-md">
                                          <div className="flex items-center">
                                            {getIcon(item.icon)} {item.name}
                                          </div>
                                          {item.type === 'Potion' && (
                                              <button onClick={() => handleUseItem(item.id)} className="bg-green-600 px-2 rounded text-xs hover:bg-green-500">Use</button>
                                          )}
                                      </div>
                                  )) : <p className="text-xs text-gray-500 text-center pt-2">Empty</p>}
                              </div>
                          </div>
                      </div>
                  </div>
                )}
            </div>
            {feedback && (
                <div className={`absolute bottom-4 right-4 p-2 rounded-lg text-xs text-white animate-pop-in z-20 ${feedback.type === 'success' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                    {feedback.message}
                </div>
            )}
        </Card>
    );
};
