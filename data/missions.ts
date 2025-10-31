import { SyndicateMission } from '../types';

export const availableMissions: SyndicateMission[] = [
    {
        id: 'mission-01',
        title: 'Data Heist',
        description: "A rival corporation has sensitive data stored on a 'secure' server. Acquire it.",
        duration: 60, // 60 seconds
        requiredSpecialty: 'Infiltration',
        baseSuccessChance: 0.7,
        rewards: {
            xp: 100,
            sovereigns: 250,
            loreId: 'cryptic_warning',
        }
    },
    {
        id: 'mission-02',
        title: 'Asset Extraction',
        description: "One of our deep-cover assets needs to be pulled out of a hostile zone. Expect resistance.",
        duration: 120, // 2 minutes
        requiredSpecialty: 'Combat',
        baseSuccessChance: 0.6,
        rewards: {
            xp: 150,
            sovereigns: 300,
            reputation: { type: 'Honorable', amount: 3 }
        }
    },
    {
        id: 'mission-03',
        title: 'Whisper Campaign',
        description: "Spread disinformation about a target to destabilize their operations.",
        duration: 90, // 1.5 minutes
        requiredSpecialty: 'Intel',
        baseSuccessChance: 0.8,
        rewards: {
            xp: 80,
            sovereigns: 150,
            reputation: { type: 'Devious', amount: 3 }
        }
    },
     {
        id: 'mission-04',
        title: 'Hard Target Neutralization',
        description: "A rival operative has become a thorn in our side. Eliminate them.",
        duration: 180, // 3 minutes
        requiredSpecialty: 'Combat',
        baseSuccessChance: 0.5,
        rewards: {
            xp: 250,
            sovereigns: 500,
            reputation: { type: 'Feared', amount: 5 },
            soulShards: 1,
        }
    },
];
