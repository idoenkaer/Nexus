import { Achievement } from '../types';
import { Angry, UserCheck, Drama } from 'lucide-react';

export const achievements: Achievement[] = [
    {
        id: 'feared_1',
        name: 'Iron Fist',
        icon: Angry,
        description: 'Your name is spoken in hushed, fearful tones. You have established a reputation for brutality.',
        condition: (profile) => profile.reputation.type === 'Feared' && profile.reputation.value >= 10,
        bonusDescription: 'Bonus: Intimidation checks are slightly easier.'
    },
    {
        id: 'honorable_1',
        name: 'Saint of the Gutters',
        icon: UserCheck,
        description: 'Even in the darkness, you adhere to a code. Some see this as a weakness, others as a strength.',
        condition: (profile) => profile.reputation.type === 'Honorable' && profile.reputation.value >= 10,
        bonusDescription: 'Bonus: Gain slightly more Sovereigns from honorable actions.'
    },
    {
        id: 'devious_1',
        name: 'The Whisperer',
        icon: Drama,
        description: 'You play the game of shadows better than most. Your schemes have begun to bear fruit.',
        condition: (profile) => profile.reputation.type === 'Devious' && profile.reputation.value >= 10,
        bonusDescription: 'Bonus: Gain slightly more XP from devious actions.'
    },
];