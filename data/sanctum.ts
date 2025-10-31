import { SanctumState } from '../types';
import { Vault, Award, BedDouble, Library } from 'lucide-react';

export const initialSanctumState: SanctumState = {
    vault: {
        id: 'vault',
        name: 'The Vault',
        description: 'A secure repository for your ill-gotten gains. Each upgrade increases your maximum Sovereign capacity.',
        icon: Vault,
        level: 0,
        maxLevel: 5,
        bonusDescription: '+1000 Max Sovereigns per level.',
        upgradeCosts: [
            { sovereigns: 250, soulShards: 0 },
            { sovereigns: 750, soulShards: 1 },
            { sovereigns: 2000, soulShards: 2 },
            { sovereigns: 5000, soulShards: 3 },
            { sovereigns: 10000, soulShards: 5 },
        ]
    },
    trophyDisplay: {
        id: 'trophyDisplay',
        name: 'Trophy Display',
        description: 'A monument to your accomplishments. This area displays your unlocked achievements, a testament to your growing legend.',
        icon: Award,
        level: 1,
        maxLevel: 1,
        bonusDescription: 'Showcases your earned achievements.',
        upgradeCosts: []
    },
    restingPlace: {
        id: 'restingPlace',
        name: 'Resting Place',
        description: 'A crypt, sarcophagus, or bed of nails. Whatever your preference, this is where you recuperate, slowly mending your wounds over time.',
        icon: BedDouble,
        level: 0,
        maxLevel: 3,
        bonusDescription: 'Provides passive HP regeneration.',
        upgradeCosts: [
            { sovereigns: 500, soulShards: 2 },
            { sovereigns: 1500, soulShards: 4 },
            { sovereigns: 4000, soulShards: 6 },
        ]
    },
    arcaneLibrary: {
        id: 'arcaneLibrary',
        name: 'Arcane Library',
        description: 'A collection of forbidden texts and grimoires. The whispers from the pages grant you insight, passively increasing your XP gain.',
        icon: Library,
        level: 0,
        maxLevel: 5,
        bonusDescription: '+1% passive XP gain per level.',
        upgradeCosts: [
            { sovereigns: 1000, soulShards: 3 },
            { sovereigns: 2500, soulShards: 5 },
            { sovereigns: 6000, soulShards: 8 },
            { sovereigns: 12000, soulShards: 12 },
            { sovereigns: 25000, soulShards: 20 },
        ]
    }
};
