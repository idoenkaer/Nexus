import type { LucideIcon } from 'lucide-react';
import React from 'react';

export enum AppSection {
  Gaming = 'gaming',
  Utilities = 'utilities',
  Meditation = 'meditation',
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Buff {
  id: string;
  name: string;
  description: string;
  icon: string;
  effects: {
    stat: 'attack' | 'defense' | 'dominance';
    value: number;
  }[];
  duration: number; // in combat turns
}

export type ReputationType = 'Feared' | 'Honorable' | 'Devious' | 'Neutral';
export interface Reputation {
  type: ReputationType;
  value: number;
}

// New Attribute and Ability System
export interface Attributes {
  // Physical
  strength: number;
  dexterity: number;
  // Social
  dominance: number; // Represents Charisma, Manipulation, Appearance combined for simplicity
  // Mental
  intelligence: number;
  wits: number;
}
export type AttributeName = keyof Attributes;

export type AbilityName = 'Brawl' | 'Intimidation' | 'Investigation' | 'Stealth' | 'Occult';
export type Abilities = Record<AbilityName, number>;


export interface UserProfileState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  sovereigns: number;
  soulShards: number;
  hp: number;
  maxHp: number;
  attributes: Attributes;
  abilities: Abilities;
  activeBuffs: Buff[];
  reputation: Reputation;
}

export interface Ritual {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: {
    sovereigns: number;
    soulShards: number;
  };
  buff: Buff;
}

export type NPCRelationshipStatus = 'Loyal' | 'Neutral' | 'Rival' | 'Enemy';

export interface NPCRelationship {
    status: NPCRelationshipStatus;
    mood: string; // e.g., 'Pleased', 'Wary', 'Furious'
}

export interface NPC {
    id: string;
    name: string;
    title: string;
    icon: LucideIcon;
    relationship: NPCRelationship;
    description: string;
}

export type NPCRelationships = Record<string, NPCRelationship>;

export interface RPGQuestConsequence {
    type: 'addCurrency' | 'updateAttribute' | 'updateRelationship' | 'setQuest' | 'branchOnArchetype' | 'updateReputation' | 'updateNPCMood' | 'startSocialConflict' | 'addLore';
    payload: any;
}

export interface RPGQuestChoice {
    text: string;
    consequences: RPGQuestConsequence[];
    narrativeLog: string;
}

export interface RPGQuest {
    id: number;
    archetype?: ArchetypeName;
    title: string;
    description: string;
    choices: RPGQuestChoice[];
}

export interface SharedAppProps extends RewardProps {
    npcRelationships: NPCRelationships;
    currentQuestId: number;
    character: Character;
    inventory: RPGItem[];
    collectedLoreIds: Set<string>;
    unlockedAchievementIds: Set<string>;
    hiredAgents: Agent[];
    activeMissions: ActiveMission[];
    sanctumState: SanctumState;
    updateAttribute: (attribute: AttributeName, amount: number) => void;
    spendXp: (ability: AbilityName) => boolean;
    updateNPCRelationship: (npcId: string, newStatus: NPCRelationshipStatus) => void;
    updateNPCMood: (npcId: string, newMood: string) => void;
    setCurrentQuestId: (questId: number) => void;
    setCharacter: (character: Character) => void;
    updateReputation: (payload: { type: ReputationType, amount: number }) => void;
    addItem: (item: RPGItem) => void;
    useItem: (itemId: number) => void;
    addLore: (loreId: string) => void;
    startMission: (missionId: string, agentId: string) => boolean;
    resolveMission: (missionId: string) => { success: boolean, rewards: string };
    upgradeSanctumModule: (moduleId: SanctumModuleType) => void;
}

export interface RewardProps {
    userProfile: UserProfileState;
    addCurrency: (xp: number, sovereigns: number) => void;
    spendSovereigns: (amount: number) => boolean;
    addSoulShards: (amount: number) => void;
    spendSoulShards: (amount: number) => boolean;
    updateHealth: (newHp: number) => void;
    healUser: (amount: number) => void;
    addBuff: (buff: Buff) => void;
    tickBuffs: () => void;
}

export type ArchetypeName = 'Vampire' | 'Werewolf' | 'Warlock' | 'Syndicate' | 'Hunter';
export type OriginName = 'Fallen Noble' | 'Street Urchin' | 'Cult Escapee';

export interface Origin {
  name: OriginName,
  title: string,
  description: string,
  icon: LucideIcon,
  applyBonus: (profile: UserProfileState, relationships: NPCRelationships) => { profile: UserProfileState, relationships: NPCRelationships }
}

export interface Character {
  name: string;
  archetype: ArchetypeName;
  origin?: OriginName;
}

export interface Enemy {
  name:string;
  avatar: LucideIcon;
  hp: number;
  maxHp: number;
  attack: number;
  reward: {
      xp: number;
      sovereigns: number;
  };
}

export interface RPGItem {
    id: number;
    name: string;
    description: string;
    cost: number;
    icon: string;
    type: 'Potion' | 'Misc';
    effect?: {
        type: 'heal';
        payload: { amount: number };
    };
}

export interface NarrativeLog {
  id: number;
  text: string;
  timestamp: number;
}

export interface SocialConflictChoice {
  text: string;
  // Use diceCheck instead of the old check
  diceCheck?: { 
    attribute: AttributeName; 
    ability: AbilityName; 
    difficulty: number;
    successesNeeded?: number;
  };
  consequences: RPGQuestConsequence[];
  narrativeLog: string;
  successLog?: string;
  failureLog?: string;
}

export interface SocialConflict {
  id: number;
  npcId: string;
  title: string;
  description: string;
  objective: string;
  choices: SocialConflictChoice[];
  successThreshold: number; // e.g., number of successful choices needed
  onSuccess: {
      narrativeLog: string;
      consequences: RPGQuestConsequence[];
  };
  onFailure: {
      narrativeLog: string;
      consequences: RPGQuestConsequence[];
  }
}

export interface AlchemicalIngredient {
  id: number;
  name: string;
  description: string;
  use: string;
}

export interface LoreFragment {
  id: string;
  title: string;
  content: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  // FIX: Changed icon type to LucideIcon to match data and component prop types.
  icon: LucideIcon;
  condition: (profile: UserProfileState, relationships: NPCRelationships) => boolean;
  bonusDescription: string;
}

// --- Shadow Syndicate Types ---
export type AgentSpecialty = 'Infiltration' | 'Combat' | 'Intel';

export interface Agent {
  id: string;
  name: string;
  specialty: AgentSpecialty;
  successModifier: number; // e.g., 0.1 for +10%
  status: 'Idle' | 'On Mission';
  cost: number;
}

export interface SyndicateMission {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  requiredSpecialty: AgentSpecialty;
  baseSuccessChance: number; // from 0 to 1
  rewards: {
    xp: number;
    sovereigns: number;
    soulShards?: number;
    loreId?: string;
    reputation?: { type: ReputationType, amount: number };
  };
}

export interface ActiveMission {
  missionId: string;
  agentId: string;
  completionTime: number; // Date.now() + duration * 1000
}

export interface EchoWhisper {
  id: number;
  text: string;
  x: number;
  y: number;
}

// --- Sanctum Types ---
export type SanctumModuleType = 'vault' | 'trophyDisplay' | 'restingPlace' | 'arcaneLibrary';

export interface SanctumModule {
  id: SanctumModuleType;
  name: string;
  description: string;
  // FIX: Changed icon type to LucideIcon to match data and component prop types.
  icon: LucideIcon;
  level: number;
  maxLevel: number;
  bonusDescription: string;
  upgradeCosts: { sovereigns: number, soulShards: number }[];
}

export type SanctumState = Record<SanctumModuleType, SanctumModule>;

// --- Checkpoint Types ---
export interface CheckpointReport {
    timestamp: string;
    levelDelta: number;
    sovereignsDelta: number;
    soulShardsDelta: number;
    dominanceDelta: number;
    relationshipChanges: string[];
    oracleAssessment: string;
}
