import { Origin, UserProfileState, NPCRelationships } from '../types';
import { History, Drama, ShieldAlert } from 'lucide-react';

export const origins: Origin[] = [
    {
        name: 'Fallen Noble',
        title: 'Fallen Noble',
        icon: History,
        description: 'Born to power, now an outcast. Your name once commanded respect; now it is but a whisper in the dark.',
        applyBonus: (profile: UserProfileState, relationships: NPCRelationships) => {
            const newProfile = { 
                ...profile, 
                attributes: {
                    ...profile.attributes,
                    dominance: profile.attributes.dominance + 1 
                }
            };
            return { profile: newProfile, relationships };
        }
    },
    {
        name: 'Street Urchin',
        title: 'Street Urchin',
        icon: Drama,
        description: 'You grew up in the gutter, surviving on scraps and secrets. The city\'s underbelly is your home turf.',
        applyBonus: (profile: UserProfileState, relationships: NPCRelationships) => {
            const newProfile = { ...profile, sovereigns: profile.sovereigns + 75 };
            // FIX: Add explicit type annotation to prevent TypeScript from inferring 'status' as a generic 'string' instead of the specific 'NPCRelationshipStatus' type.
            const newRelationships: NPCRelationships = {
                ...relationships,
                silas: { ...relationships.silas, status: 'Neutral', mood: 'Intrigued' }
            };
            return { profile: newProfile, relationships: newRelationships };
        }
    },
    {
        name: 'Cult Escapee',
        title: 'Cult Escapee',
        icon: ShieldAlert,
        description: 'You escaped a dark cult that worshipped forbidden entities. You are haunted, but you also carry their secrets.',
        applyBonus: (profile: UserProfileState, relationships: NPCRelationships) => {
            const newProfile = { 
                ...profile, 
                soulShards: profile.soulShards + 3,
                abilities: {
                    ...profile.abilities,
                    Occult: profile.abilities.Occult + 1
                }
            };
            return { profile: newProfile, relationships };
        }
    },
];
