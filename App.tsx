
import React, { useState, useEffect } from 'react';
import { Swords, Hammer, Moon, Skull, Hexagon, Coins, Gem, Shield, HeartPulse, HandMetal, Crown } from 'lucide-react';

import { BottomNav } from './components/BottomNav';
import { GamingHub } from './components/GamingHub';
import { UtilitySuite } from './components/UtilitySuite';
import { MeditationZone } from './components/MeditationZone';
import { AppSection, UserProfileState, NPCRelationships, NPCRelationshipStatus, Buff, ReputationType, Character, Origin, RPGItem, Agent, ActiveMission, SyndicateMission, EchoWhisper, SanctumState, SanctumModuleType, AttributeName, AbilityName } from './types';
import { npcs as initialNpcs } from './data/npcs';
import { origins } from './data/origins';
import { achievements } from './data/achievements';
import { availableMissions } from './data/missions';
import { echoDialogues } from './data/echoDialogues';
import { EchoWhisper as EchoWhisperComponent } from './components/EchoWhisper';
import { initialSanctumState } from './data/sanctum';

interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    type: 'xp' | 'sovereigns';
}

const icons: { [key: string]: React.ElementType } = {
  Sword: Swords, Shield, Crown, Gem
};

export type InitialStateType = {
    profile: UserProfileState;
    relationships: NPCRelationships;
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.Gaming);
  const [userProfile, setUserProfile] = useState<UserProfileState>({
    level: 1,
    xp: 50,
    xpToNextLevel: 100,
    sovereigns: 100,
    soulShards: 5,
    hp: 50,
    maxHp: 50,
    attributes: {
        strength: 2,
        dexterity: 2,
        dominance: 2,
        intelligence: 2,
        wits: 2,
    },
    abilities: {
        'Brawl': 1,
        'Intimidation': 1,
        'Investigation': 0,
        'Stealth': 0,
        'Occult': 0,
    },
    activeBuffs: [],
    reputation: { type: 'Neutral', value: 0 },
  });
  const [character, setCharacter] = useState<Character>({ name: 'The Unseen', archetype: 'Vampire' });
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [echoWhisper, setEchoWhisper] = useState<EchoWhisper | null>(null);

  // New centralized state
  const [inventory, setInventory] = useState<RPGItem[]>([]);
  const [collectedLoreIds, setCollectedLoreIds] = useState<Set<string>>(new Set());
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<Set<string>>(new Set());
  const [hiredAgents, setHiredAgents] = useState<Agent[]>([
    { id: 'agent-000', name: 'Rookie', specialty: 'Infiltration', successModifier: 0.0, status: 'Idle', cost: 0 }
  ]);
  const [activeMissions, setActiveMissions] = useState<ActiveMission[]>([]);
  const [sanctumState, setSanctumState] = useState<SanctumState>(initialSanctumState);
  const [initialState, setInitialState] = useState<InitialStateType | null>(null);


  const [npcRelationships, setNpcRelationships] = useState<NPCRelationships>(() => {
    return initialNpcs.reduce((acc, npc) => {
        acc[npc.id] = npc.relationship;
        return acc;
    }, {} as NPCRelationships);
  });
  
  const [currentQuestId, setCurrentQuestId] = useState<number>(1);

  useEffect(() => {
    if (!character.origin) {
      const defaultOrigin = origins[0];
      setCharacter(c => ({...c, origin: defaultOrigin.name}));
      const { profile, relationships } = defaultOrigin.applyBonus(userProfile, npcRelationships);
      setUserProfile(profile);
      setNpcRelationships(relationships);
    }
  }, [character.origin]);

  useEffect(() => {
    if (!initialState) {
        // Deep copy to prevent mutation
        setInitialState({
            profile: JSON.parse(JSON.stringify(userProfile)),
            relationships: JSON.parse(JSON.stringify(npcRelationships)),
        });
    }
  }, [userProfile]); // Depend on userProfile to capture state after origin bonus is applied


  useEffect(() => {
    const dominanceLevel =
      userProfile.attributes.dominance >= 4 ? 'high'
      : userProfile.attributes.dominance <= 1 ? 'low'
      : 'medium';
    document.body.setAttribute('data-dominance-level', dominanceLevel);
  }, [userProfile.attributes.dominance]);

  // Malkavian Sidekick "Echo" Logic
  useEffect(() => {
      const echoInterval = setInterval(() => {
          if (Math.random() < 0.2) { // 20% chance to speak every 15 seconds
              const targetSelectors = ['header h1', '.card', 'button:not(:disabled)', '.xp-bar-animate', 'nav button', '.terminal-screen'];
              const randomSelector = targetSelectors[Math.floor(Math.random() * targetSelectors.length)];
              const targets = document.querySelectorAll(randomSelector);
              
              if (targets.length > 0) {
                  const target = targets[Math.floor(Math.random() * targets.length)];
                  const rect = target.getBoundingClientRect();
                  const dialogue = echoDialogues[Math.floor(Math.random() * echoDialogues.length)];

                  setEchoWhisper({
                      id: Date.now(),
                      text: dialogue,
                      x: rect.left,
                      y: rect.top - 10, // Position it slightly above the element
                  });

                  setTimeout(() => setEchoWhisper(null), 6000); // Whisper lasts for 6 seconds
              }
          }
      }, 15000);

      return () => clearInterval(echoInterval);
  }, []);

  // Achievement checker
  useEffect(() => {
    const checkAndUnlockAchievements = () => {
        const newUnlocks: string[] = [];
        achievements.forEach(achievement => {
            if (!unlockedAchievementIds.has(achievement.id) && achievement.condition(userProfile, npcRelationships)) {
                newUnlocks.push(achievement.id);
            }
        });
        if (newUnlocks.length > 0) {
            setUnlockedAchievementIds(prev => new Set([...prev, ...newUnlocks]));
            // Optional: Show a notification for new achievements
        }
    };
    checkAndUnlockAchievements();
  }, [userProfile, npcRelationships, unlockedAchievementIds]);

  const addCurrency = (xpToAdd: number, sovereignsToAdd: number) => {
    if (xpToAdd > 0) {
        const newText: FloatingText = { id: Date.now() + Math.random(), text: `+${xpToAdd} XP`, x: Math.random() * 50 + 25, y: 50, type: 'xp' };
        setFloatingTexts(prev => [...prev, newText]);
    }
    if (sovereignsToAdd > 0) {
        const newText: FloatingText = { id: Date.now() + Math.random(), text: `+${sovereignsToAdd}`, x: Math.random() * 50 + 25, y: 60, type: 'sovereigns' };
        setFloatingTexts(prev => [...prev, newText]);
    }

    setTimeout(() => {
        setFloatingTexts(prev => prev.slice(xpToAdd > 0 && sovereignsToAdd > 0 ? 2 : 1));
    }, 2000);

    setUserProfile(prev => {
        let newXp = prev.xp + xpToAdd;
        let newLevel = prev.level;
        let newXpToNextLevel = prev.xpToNextLevel;
        let newMaxHp = prev.maxHp;
        let didLevelUp = false;

        while (newXp >= newXpToNextLevel) {
            newXp -= newXpToNextLevel;
            newLevel++;
            newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
            newMaxHp += 15;
            didLevelUp = true;
        }

        return {
            ...prev,
            level: newLevel,
            xp: newXp,
            xpToNextLevel: newXpToNextLevel,
            sovereigns: prev.sovereigns + sovereignsToAdd,
            maxHp: newMaxHp,
            hp: didLevelUp ? newMaxHp : prev.hp,
        };
    });
  };
  
  const updateAttribute = (attribute: AttributeName, amount: number) => {
      setUserProfile(prev => ({
          ...prev, 
          attributes: {
            ...prev.attributes,
            [attribute]: prev.attributes[attribute] + amount
          }
        }));
  }
  
  const updateNPCRelationship = (npcId: string, newStatus: NPCRelationshipStatus) => {
    setNpcRelationships(prev => ({
        ...prev,
        [npcId]: { ...prev[npcId], status: newStatus }
    }));
  };

   const updateNPCMood = (npcId: string, newMood: string) => {
    setNpcRelationships(prev => ({
        ...prev,
        [npcId]: { ...prev[npcId], mood: newMood }
    }));
  };

  const updateReputation = (payload: { type: ReputationType, amount: number }) => {
    setUserProfile(prev => {
        if (prev.reputation.type === payload.type || prev.reputation.type === 'Neutral') {
            return {
                ...prev,
                reputation: { type: payload.type, value: prev.reputation.value + payload.amount }
            };
        }
        // If changing reputation type, reset value
        return {
            ...prev,
            reputation: { type: payload.type, value: payload.amount }
        };
    });
  };

  const spendSovereigns = (amount: number): boolean => {
      if (userProfile.sovereigns >= amount) {
          setUserProfile(prev => ({ ...prev, sovereigns: prev.sovereigns - amount }));
          return true;
      }
      return false;
  };

  const addSoulShards = (amount: number) => {
      setUserProfile(prev => ({ ...prev, soulShards: prev.soulShards + amount }));
  };

  const spendSoulShards = (amount: number): boolean => {
      if (userProfile.soulShards >= amount) {
          setUserProfile(prev => ({ ...prev, soulShards: prev.soulShards - amount }));
          return true;
      }
      return false;
  };

    const spendXp = (ability: AbilityName): boolean => {
        const currentRating = userProfile.abilities[ability];
        if (currentRating >= 5) return false; // Max rating
        
        const cost = (currentRating + 1) * 3;
        if (userProfile.xp >= cost) {
            setUserProfile(prev => ({
                ...prev,
                xp: prev.xp - cost,
                abilities: {
                    ...prev.abilities,
                    [ability]: prev.abilities[ability] + 1
                }
            }));
            return true;
        }
        return false;
    }

    const updateHealth = (newHp: number) => {
        setUserProfile(prev => ({
            ...prev,
            hp: Math.max(0, Math.min(prev.maxHp, newHp))
        }));
    };

    const healUser = (amount: number) => {
        updateHealth(userProfile.hp + amount);
    };

    const addBuff = (buff: Buff) => {
      setUserProfile(prev => {
          const otherBuffs = prev.activeBuffs.filter(b => b.id !== buff.id);
          return {
              ...prev,
              activeBuffs: [...otherBuffs, buff]
          };
      });
  };

  const tickBuffs = () => {
      setUserProfile(prev => {
          const updatedBuffs = prev.activeBuffs
              .map(buff => ({ ...buff, duration: buff.duration - 1 }))
              .filter(buff => buff.duration > 0);
          return { ...prev, activeBuffs: updatedBuffs };
      });
  };

  const addItem = (item: RPGItem) => {
      setInventory(prev => [...prev, { ...item, id: Date.now() + Math.random() }]);
  };

  const useItem = (itemId: number) => {
      const item = inventory.find(i => i.id === itemId);
      if (item && item.effect) {
          if (item.effect.type === 'heal') {
              healUser(item.effect.payload.amount);
          }
          // could add buff effects here
          setInventory(prev => prev.filter(i => i.id !== itemId));
      }
  };

  const addLore = (loreId: string) => {
      setCollectedLoreIds(prev => new Set(prev).add(loreId));
  };

  const startMission = (missionId: string, agentId: string): boolean => {
    const mission = availableMissions.find(m => m.id === missionId);
    const agent = hiredAgents.find(a => a.id === agentId);

    if (!mission || !agent || agent.status !== 'Idle' || agent.specialty !== mission.requiredSpecialty) {
        return false;
    }

    const completionTime = Date.now() + mission.duration * 1000;
    const newActiveMission: ActiveMission = { missionId, agentId, completionTime };

    setActiveMissions(prev => [...prev, newActiveMission]);
    setHiredAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'On Mission' } : a));

    return true;
  };

  const resolveMission = (missionId: string): { success: boolean, rewards: string } => {
    const completed = activeMissions.find(m => m.missionId === missionId);
    if (!completed || completed.completionTime > Date.now()) return { success: false, rewards: '' };

    const mission = availableMissions.find(m => m.id === missionId);
    const agent = hiredAgents.find(a => a.id === completed.agentId);

    if (!mission || !agent) return { success: false, rewards: '' };

    const successChance = mission.baseSuccessChance + agent.successModifier;
    const isSuccess = Math.random() < successChance;
    
    let rewardsString = "";

    if (isSuccess) {
        addCurrency(mission.rewards.xp, mission.rewards.sovereigns);
        rewardsString += `+${mission.rewards.xp} XP, +${mission.rewards.sovereigns} Sov.`;

        if (mission.rewards.soulShards) {
          addSoulShards(mission.rewards.soulShards);
          rewardsString += `, +${mission.rewards.soulShards} Shards`;
        }
        if (mission.rewards.loreId) {
          addLore(mission.rewards.loreId);
          rewardsString += `, +Lore`;
        }
        if (mission.rewards.reputation) {
          updateReputation(mission.rewards.reputation);
          rewardsString += `, +Reputation`;
        }
    } else {
        const consolationXp = Math.floor(mission.rewards.xp * 0.1);
        addCurrency(consolationXp, 0);
        rewardsString = `+${consolationXp} XP (Consolation)`;
    }

    setActiveMissions(prev => prev.filter(m => m.missionId !== missionId));
    setHiredAgents(prev => prev.map(a => a.id === completed.agentId ? { ...a, status: 'Idle' } : a));
    
    return { success: isSuccess, rewards: rewardsString };
  };

  const upgradeSanctumModule = (moduleId: SanctumModuleType) => {
    const module = sanctumState[moduleId];
    if (module.level >= module.maxLevel) return;

    const cost = module.upgradeCosts[module.level];
    if (userProfile.sovereigns >= cost.sovereigns && userProfile.soulShards >= cost.soulShards) {
        if (spendSovereigns(cost.sovereigns) && spendSoulShards(cost.soulShards)) {
            setSanctumState(prev => ({
                ...prev,
                [moduleId]: {
                    ...prev[moduleId],
                    level: prev[moduleId].level + 1,
                }
            }));
        }
    }
  };


  const sectionProps = {
    userProfile,
    character,
    npcRelationships,
    currentQuestId,
    inventory,
    collectedLoreIds,
    unlockedAchievementIds,
    hiredAgents,
    activeMissions,
    sanctumState,
    initialState,
    setInitialState,
    addCurrency,
    spendSovereigns,
    addSoulShards,
    spendSoulShards,
    spendXp,
    updateHealth,
    healUser,
    addBuff,
    tickBuffs,
    updateAttribute,
    updateNPCRelationship,
    updateNPCMood,
    setCurrentQuestId,
    setCharacter,
    updateReputation,
    addItem,
    useItem,
    addLore,
    startMission,
    resolveMission,
    upgradeSanctumModule,
  };

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.Gaming:
        return <GamingHub {...sectionProps} />;
      case AppSection.Utilities:
        return <UtilitySuite {...sectionProps} />;
      case AppSection.Meditation:
        return <MeditationZone {...sectionProps} />;
      default:
        return <GamingHub {...sectionProps} />;
    }
  };

  const navItems = [
    { id: AppSection.Gaming, label: 'Dominion', icon: Swords },
    { id: AppSection.Utilities, label: 'Forge', icon: Hammer },
    { id: AppSection.Meditation, label: 'Haven', icon: Moon },
  ];

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col relative">
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[100]">
        {floatingTexts.map(ft => (
          <div key={ft.id} className="floating-text" style={{ 
            left: `${ft.x}%`, 
            top: `${ft.y}%`, 
            color: ft.type === 'xp' ? '#facc15' : '#ca8a04',
          }}>
            {ft.text}
          </div>
        ))}
      </div>
      {echoWhisper && <EchoWhisperComponent {...echoWhisper} />}
      <header className="p-4 flex items-center justify-between border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-10">
        <div className="flex items-center">
            <Skull className="w-8 h-8 mr-3 text-red-500" />
            <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-gray-300 font-cinzel flex items-center">
            Nexus Hub 
            <span className="ml-2 text-red-500 text-xl" style={{textShadow: '0 0 5px #ef4444'}}>Ω</span>
            </h1>
        </div>
        <div className="flex items-center space-x-2">
            <div className="relative group flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-bold text-sm">Lvl {userProfile.level}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <p className="font-bold">Level</p>
                    <p>Your overall power level. Increases stats and unlocks new abilities.</p>
                </div>
            </div>
            <div className="relative group flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <HandMetal className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="font-bold text-sm">{userProfile.attributes.dominance}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <p className="font-bold">Dominance</p>
                    <p>Your sheer force of will. Influences narrative choices and social encounters.</p>
                </div>
            </div>
            <div className="relative group flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <HeartPulse className="w-4 h-4 text-red-400 mr-2" />
                <span className="font-bold text-sm">{userProfile.hp} / {userProfile.maxHp}</span>
                 <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <p className="font-bold">Health</p>
                    <p>Your life force. If it reaches zero, you are defeated.</p>
                </div>
            </div>
            <div className="relative group flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <Hexagon className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="font-bold text-sm">{userProfile.xp} / {userProfile.xpToNextLevel}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <p className="font-bold">Experience</p>
                    <p>Gain XP to level up, or spend it to improve your abilities.</p>
                </div>
            </div>
            <div className="relative group flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="font-bold text-sm">{userProfile.sovereigns}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <p className="font-bold">Sovereigns</p>
                    <p>The primary currency of the underworld for goods and services.</p>
                </div>
            </div>
            <div className="relative group flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <Gem className="w-4 h-4 text-purple-400 mr-2" />
                <span className="font-bold text-sm">{userProfile.soulShards}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <p className="font-bold">Soul Shards</p>
                    <p>A rare, potent currency for forbidden lore and arcane rituals.</p>
                </div>
            </div>
            {userProfile.activeBuffs.map(buff => {
                const BuffIcon = icons[buff.icon] || Gem;
                return (
                    <div key={buff.id} className="relative group flex items-center bg-gray-800/50 px-2 py-1 rounded-full animate-pop-in">
                        <BuffIcon className="w-4 h-4 text-green-400" />
                        <span className="font-bold text-xs ml-1.5">{buff.duration}</span>
                        <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            <p className="font-bold">{buff.name}</p>
                            <p>{buff.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
      </header>
      
      <main className="flex-grow p-4 pb-24 overflow-y-auto">
        {renderSection()}
      </main>
      
      <BottomNav
        items={navItems}
        activeItem={activeSection}
        onItemClick={(id) => setActiveSection(id as AppSection)}
      />
    </div>
  );
};

export default App;
