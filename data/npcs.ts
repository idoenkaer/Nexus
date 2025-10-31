import { NPC } from '../types';
import { Briefcase, Crown, Dog, FileSearch, Sparkles, Sword } from 'lucide-react';

export const npcs: NPC[] = [
  { 
    id: 'helena', 
    name: 'Helena', 
    title: 'Ventrue Primogen', 
    icon: Crown, 
    relationship: { status: 'Neutral', mood: 'Wary' },
    description: "Helena is the embodiment of vampiric aristocracy. Ancient, patient, and utterly ruthless, she plays the long game. She views the city as a chessboard and all its inhabitants as pawns. Her favor is a potent weapon, but her enmity is a death sentence."
  },
  { 
    id: 'marcus', 
    name: 'Marcus', 
    title: 'Brujah Anarch', 
    icon: Sword, 
    relationship: { status: 'Rival', mood: 'Hostile' },
    description: "A scholar in life, a warrior in undeath. Marcus is a firebrand who despises the rigid power structures of the old clans. He fights for a brutal meritocracy where strength and passion rule. He respects power but despises tyranny."
  },
  { 
    id: 'silas', 
    name: 'Silas', 
    title: 'Nosferatu Info Broker', 
    icon: FileSearch, 
    relationship: { status: 'Neutral', mood: 'Suspicious' },
    description: "Silas dwells in the city's digital and physical sewers. He and his clan are the masters of secrets, trading information for blood and favors. He is paranoid and grotesque, but his information is flawless and invaluable. Every secret has a price."
  },
  { 
    id: 'garou', 
    name: 'Garou', 
    title: 'Get of Fenris Alpha', 
    icon: Dog, 
    relationship: { status: 'Rival', mood: 'Territorial' },
    description: "The undisputed alpha of the city's largest werewolf pack. Garou is a warrior-king, deeply traditional and suspicious of outsiders. He values strength, honor, and the sanctity of his territory above all else. To him, you are a blight to be tolerated or purged."
  },
  { 
    id: 'cassandra', 
    name: 'Cassandra', 
    title: 'Toreador Artiste', 
    icon: Sparkles, 
    relationship: { status: 'Loyal', mood: 'Intrigued' },
    description: "A patron of the arts and a master of social manipulation. Cassandra's influence is woven through the city's high society. She is drawn to beauty, power, and novelty. She sees you as a fascinating, dangerous new piece in her collection."
  },
  { 
    id: 'mr_jones', 
    name: 'Mr. Jones', 
    title: 'Syndicate Fixer', 
    icon: Briefcase, 
    relationship: { status: 'Neutral', mood: 'Pragmatic' },
    description: "The public face of a shadowy human syndicate that profits from the supernatural underworld. Mr. Jones is pragmatic, cold, and professional. He deals in weapons, information, and mortals. To him, everything is a transaction."
  },
];
