import { RPGQuest } from '../types';

export const quests: RPGQuest[] = [
    // --- SHARED INTRO QUEST ---
    {
        id: 1,
        title: "A Taste of Power",
        description: "The city sprawls before you, a buffet of blood and secrets. An opportunity presents itself: a minor Syndicate deal is going down at the docks. An easy way to make your presence known.",
        choices: [
            {
                text: "Intervene. Show them who's in charge.",
                narrativeLog: "Your hunger for control is palpable. The pawns at the docks will serve as your first lesson to this city: fear has a new name.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'dominance', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Feared', amount: 5 } },
                    { type: 'addCurrency', payload: { xp: 50, sovereigns: 20 } },
                    { type: 'updateRelationship', payload: { npcId: 'mr_jones', newStatus: 'Rival' } },
                    { type: 'updateNPCMood', payload: { npcId: 'mr_jones', newMood: 'Annoyed' } },
                    { 
                        type: 'branchOnArchetype', 
                        payload: {
                            Vampire: [{ type: 'setQuest', payload: { questId: 2 } }],
                            Werewolf: [{ type: 'setQuest', payload: { questId: 12 } }],
                            default: [{ type: 'setQuest', payload: { questId: 100 } }],
                        }
                    }
                ]
            },
            {
                text: "Observe from the shadows. Knowledge is power.",
                narrativeLog: "Patience is a virtue, even for a predator. You watch, you learn, you wait for the perfect moment to strike. Their secrets are now your weapons.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'wits', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Devious', amount: 3 } },
                    { type: 'addCurrency', payload: { xp: 30, sovereigns: 0 } },
                    { type: 'addLore', payload: { loreId: 'syndicate_routes' } },
                    { type: 'setQuest', payload: { questId: 3 } },
                ]
            }
        ]
    },
    // --- VAMPIRE QUESTLINE ---
    {
        id: 2,
        archetype: 'Vampire',
        title: "Blood Money",
        description: "Your display at the docks has angered Mr. Jones, the Syndicate Fixer. He sends word: 'Repay the debt, or become it.' However, the elegant socialite Cassandra has also taken notice, inviting you to a high-society art gala.",
        choices: [
            {
                text: "Attend the gala. Mingle with the elite.",
                narrativeLog: "You choose the gilded cage over the gutter. The city's elite are lambs, and you are the wolf in their finery. Cassandra's interest is a new, potent weapon.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'dominance', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Honorable', amount: 2 } },
                    { type: 'updateRelationship', payload: { npcId: 'cassandra', newStatus: 'Loyal' } },
                    { type: 'updateNPCMood', payload: { npcId: 'cassandra', newMood: 'Pleased' } },
                    { type: 'setQuest', payload: { questId: 4 } },
                ]
            },
            {
                text: "Confront Mr. Jones. No one threatens you.",
                narrativeLog: "You answer threats with violence. A message must be sent, written in the blood of those who dare challenge your rise. Mr. Jones will learn his place.",
                consequences: [
                    { type: 'startSocialConflict', payload: { conflictId: 1 } }
                ]
            }
        ]
    },
    // --- WEREWOLF QUESTLINE ---
    {
        id: 12,
        archetype: 'Werewolf',
        title: "A Sniff of Trouble",
        description: "Your disruption at the docks has drawn the attention of Garou, the alpha of the local Get of Fenris pack. He sees your strength as a challenge to his territory. He demands a show of respect.",
        choices: [
            {
                text: "Challenge his champion to a brawl. Prove your strength.",
                narrativeLog: "Words are wind. True strength is proven with tooth and claw. You will meet their challenge head-on, and they will know the fury of a true predator.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'strength', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Feared', amount: 4 } },
                    { type: 'addCurrency', payload: { xp: 120, sovereigns: 10 } },
                    { type: 'updateRelationship', payload: { npcId: 'garou', newStatus: 'Rival' } },
                    { type: 'updateNPCMood', payload: { npcId: 'garou', newMood: 'Impressed' } },
                    { type: 'setQuest', payload: { questId: 16 } },
                ]
            },
            {
                text: "Offer a tribute. A tactical submission for now.",
                narrativeLog: "There is no shame in bending when the wind blows strong. You offer a token of respect, a feint to hide your true ambition. Let the alpha think he has tamed you. His arrogance will be his undoing.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'dominance', amount: -1 } },
                    { type: 'updateReputation', payload: { type: 'Devious', amount: 3 } },
                    { type: 'addCurrency', payload: { xp: 20, sovereigns: 0 } },
                    { type: 'updateRelationship', payload: { npcId: 'garou', newStatus: 'Neutral' } },
                    { type: 'updateNPCMood', payload: { npcId: 'garou', newMood: 'Dismissive' } },
                    { type: 'setQuest', payload: { questId: 17 } },
                ]
            }
        ]
    },
    // --- CONTINUATION QUESTS ---
    {
        id: 3,
        title: "Shadows Have Eyes",
        description: "Your silent observation paid off. You know the Syndicate's routes and have identified a key lieutenant. This knowledge is a blade waiting for a hand to wield it.",
        choices: [
           {
                text: "Sell the intel to a rival faction.",
                narrativeLog: "You trade one secret for another, turning the underworld's gears to your own advantage. Let them bleed each other dry.",
                consequences: [
                    { type: 'updateReputation', payload: { type: 'Devious', amount: 5 } },
                    { type: 'addCurrency', payload: { xp: 50, sovereigns: 150 } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
           },
           {
                text: "Use the intel to blackmail the lieutenant.",
                narrativeLog: "Why kill when you can control? The lieutenant becomes your puppet, a source of income and information within the Syndicate's heart.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'dominance', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Feared', amount: 3 } },
                    { type: 'updateRelationship', payload: { npcId: 'mr_jones', newStatus: 'Rival' } },
                    { type: 'updateNPCMood', payload: { npcId: 'mr_jones', newMood: 'Wary' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
           }
        ]
    },
    {
        id: 4,
        archetype: 'Vampire',
        title: "A Dance of Knives",
        description: "Cassandra's favor has put you in the spotlight. Now, the Ventrue Primogen, Helena, summons you to her sky-terrace penthouse. She speaks of order and tradition, her eyes judging your worth... and your threat.",
        choices: [
            {
                text: "Pledge fealty. A valuable alliance.",
                narrativeLog: "You bend the knee, for now. Helena's power is ancient, her influence vast. It is better to be her weapon than her target. The long game begins.",
                consequences: [
                    { type: 'updateReputation', payload: { type: 'Honorable', amount: 4 } },
                    { type: 'updateRelationship', payload: { npcId: 'helena', newStatus: 'Loyal' } },
                    { type: 'updateNPCMood', payload: { npcId: 'helena', newMood: 'Pleased' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            },
            {
                text: "Subtly defy her. Power respects only power.",
                narrativeLog: "You do not bow. You meet her gaze and speak of your own ambitions. You have earned her cautious respect, and her eternal suspicion.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'dominance', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Feared', amount: 2 } },
                    { type: 'updateRelationship', payload: { npcId: 'helena', newStatus: 'Rival' } },
                    { type: 'updateNPCMood', payload: { npcId: 'helena', newMood: 'Intrigued' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            }
        ]
    },
    {
        id: 5,
        archetype: 'Vampire',
        title: "War with the Syndicate",
        description: "Your war with Mr. Jones has escalated. His organization is in tatters, but in a final act of desperation, he has unearthed and awakened something ancient from a sealed crypt beneath the city. He has lost control of it.",
        choices: [
            {
                text: "Hunt the creature. Clean up your own mess.",
                narrativeLog: "You created this problem; you will end it. The creature is a threat to your territory and your power. Its demise will be a final, bloody message to your enemies.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'strength', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Honorable', amount: 5 } },
                    { type: 'addCurrency', payload: { xp: 250, sovereigns: 100 } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            },
            {
                text: "Let it run rampant in a rival's territory.",
                narrativeLog: "Chaos is a ladder. You divert the ancient horror towards the territory of Marcus, the Brujah Anarch. Let two of your problems eliminate each other.",
                consequences: [
                    { type: 'updateReputation', payload: { type: 'Devious', amount: 6 } },
                    { type: 'updateRelationship', payload: { npcId: 'marcus', newStatus: 'Enemy' } },
                    { type: 'updateNPCMood', payload: { npcId: 'marcus', newMood: 'Furious' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            }
        ]
    },
    {
        id: 16,
        archetype: 'Werewolf',
        title: "A Rival Alpha",
        description: "Your victory has earned Garou's grudging respect, but has also marked you as a threat. He challenges you to a ritual hunt in the spirit wilds. To refuse is to show weakness and be cast out.",
        choices: [
            {
                text: "Accept the hunt. Prove your worth to the spirits.",
                narrativeLog: "You accept the challenge. In the spirit wilds, under the moon's gaze, you will prove you are the superior predator. This is not about dominance, but destiny.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'wits', amount: 1 } },
                    { type: 'updateReputation', payload: { type: 'Honorable', amount: 5 } },
                    { type: 'updateRelationship', payload: { npcId: 'garou', newStatus: 'Loyal' } },
                    { type: 'updateNPCMood', payload: { npcId: 'garou', newMood: 'Respectful' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            },
            {
                text: "Sabotage the ritual. Weaken his spiritual authority.",
                narrativeLog: "You play a dirtier game. You corrupt his ritual, severing his ties to the pack's totem spirits. He may keep his title, but you have stolen his soul.",
                consequences: [
                    { type: 'updateReputation', payload: { type: 'Devious', amount: 5 } },
                    { type: 'updateRelationship', payload: { npcId: 'garou', newStatus: 'Enemy' } },
                    { type: 'updateNPCMood', payload: { npcId: 'garou', newMood: 'Hateful' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            }
        ]
    },
    {
        id: 17,
        archetype: 'Werewolf',
        title: "The Caged Wolf",
        description: "Your feigned submission worked. Garou sees you as a lesser wolf. This slight gives you cover to move, but your rage simmers. A group of young, discontent pack members approach you in secret, whispering of rebellion.",
        choices: [
            {
                text: "Lead their rebellion. Seize control.",
                narrativeLog: "The time for submission is over. You will harness the pack's discontent and challenge the old alpha. The price of failure is death, but the prize is everything.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'dominance', amount: 2 } },
                    { type: 'updateReputation', payload: { type: 'Feared', amount: 7 } },
                    { type: 'updateRelationship', payload: { npcId: 'garou', newStatus: 'Enemy' } },
                    { type: 'updateNPCMood', payload: { npcId: 'garou', newMood: 'Furious' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            },
            {
                text: "Report them to Garou. Earn his trust.",
                narrativeLog: "You choose loyalty over ambition. By exposing the traitors, you prove your worth to the alpha. You are now his trusted enforcer, a wolf at his right hand. Your own ambitions can wait.",
                consequences: [
                    { type: 'updateReputation', payload: { type: 'Honorable', amount: 5 } },
                    { type: 'updateRelationship', payload: { npcId: 'garou', newStatus: 'Loyal' } },
                    { type: 'updateNPCMood', payload: { npcId: 'garou', newMood: 'Trusting' } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            }
        ]
    },
    // Generic continuation quests
    {
        id: 100,
        title: "An Unwritten Path",
        description: "Your actions at the docks have sent ripples through the city, but your specific path is not yet chronicled. The shadows wait to see what you will become.",
        choices: []
    },
    {
        id: 101,
        title: "A New Chapter",
        description: "One door has closed, and another has opened. The consequences of your actions have settled, but the city never sleeps. New threats and opportunities are already gathering on the horizon.",
        choices: []
    },
    // Alchemy-triggered quest
    {
        id: 200,
        title: "Sable Visions",
        description: "The fumes from your Sable Lotus brew fill your mind with unsettling images of a forgotten place. A forgotten crypt mentioned in hushed tones, promising power... and danger. Perhaps it is worth investigating.",
        choices: [
            {
                text: "Seek out the crypt.",
                narrativeLog: "The visions are too potent to ignore. You will follow these dark threads and claim whatever power lies dormant in that forgotten place.",
                consequences: [
                    { type: 'updateAttribute', payload: { attribute: 'wits', amount: 1 } },
                    { type: 'addCurrency', payload: { xp: 50, sovereigns: 0 } },
                    { type: 'setQuest', payload: { questId: 101 } } // Leads to a future quest branch
                ]
            },
            {
                text: "Ignore the visions. Too risky.",
                narrativeLog: "You push the fleeting images from your mind. Some doors are best left unopened, some secrets better left buried.",
                consequences: [
                    { type: 'addCurrency', payload: { xp: 10, sovereigns: 0 } },
                    { type: 'setQuest', payload: { questId: 101 } }
                ]
            }
        ]
    }
];
