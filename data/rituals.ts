import { Ritual } from '../types';

export const rituals: Ritual[] = [
    {
        id: 'ritual_blood_fury',
        name: 'Ritual of Blood Fury',
        description: 'A dark pact that grants immense, temporary power in exchange for a sliver of your essence. Your attacks become devastatingly brutal.',
        icon: 'Sword',
        cost: { sovereigns: 100, soulShards: 2 },
        buff: {
            id: 'buff_blood_fury',
            name: 'Blood Fury',
            description: '+10 to Attack for 3 turns.',
            icon: 'Sword',
            effects: [{ stat: 'attack', value: 10 }],
            duration: 3,
        }
    },
    {
        id: 'ritual_shadow_shroud',
        name: 'Ritual of the Shadow Shroud',
        description: 'Weave the very shadows into a protective cloak. For a time, you are harder to harm, an untouchable phantom.',
        icon: 'Shield',
        cost: { sovereigns: 75, soulShards: 1 },
        buff: {
            id: 'buff_shadow_shroud',
            name: 'Shadow Shroud',
            description: '+8 to Defense for 3 turns.',
            icon: 'Shield',
            effects: [{ stat: 'defense', value: 8 }],
            duration: 3,
        }
    },
    {
        id: 'ritual_sovereigns_gaze',
        name: `Sovereign's Gaze`,
        description: 'Channel your innate authority into an aura of pure command, making others more susceptible to your will.',
        icon: 'Crown',
        cost: { sovereigns: 200, soulShards: 5 },
        buff: {
            id: 'buff_sovereigns_gaze',
            name: `Sovereign's Gaze`,
            description: '+5 to Dominance for 5 turns.',
            icon: 'Crown',
            effects: [{ stat: 'dominance', value: 5 }],
            duration: 5,
        }
    }
];
