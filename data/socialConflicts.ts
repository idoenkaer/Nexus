import { SocialConflict } from '../types';

export const socialConflicts: SocialConflict[] = [
    {
        id: 1,
        npcId: 'mr_jones',
        title: "An Offer You Can't Refuse",
        description: "You find Mr. Jones in his sterile, high-tech office overlooking the rain-slicked city. He doesn't look angry, merely... disappointed. 'Interfering with business is expensive,' he says calmly, a data-slate in his hand. 'And debts must be paid. One way, or another.'",
        objective: 'Convince Mr. Jones to stand down without resorting to bloodshed.',
        successThreshold: 2,
        onSuccess: {
            narrativeLog: "With a final, sharp nod, Mr. Jones closes the data-slate. 'A compelling argument. We will consider this matter... closed. For now.' You have earned a grudging respect from the Syndicate's fixer.",
            consequences: [
                { type: 'addCurrency', payload: { xp: 100, sovereigns: 0 } },
                { type: 'updateRelationship', payload: { npcId: 'mr_jones', newStatus: 'Neutral' } },
                { type: 'updateNPCMood', payload: { npcId: 'mr_jones', newMood: 'Wary' } },
                { type: 'setQuest', payload: { questId: 101 } },
            ]
        },
        onFailure: {
            narrativeLog: "Mr. Jones sighs, a flicker of annoyance in his eyes. 'A pity.' He taps a button on his desk. 'Your account is now flagged. The debt will be collected in blood.' The Syndicate will not forget this.",
            consequences: [
                { type: 'addCurrency', payload: { xp: 20, sovereigns: 0 } },
                { type: 'updateRelationship', payload: { npcId: 'mr_jones', newStatus: 'Enemy' } },
                { type: 'updateNPCMood', payload: { npcId: 'mr_jones', newMood: 'Furious' } },
                { type: 'setQuest', payload: { questId: 5 } },
            ]
        },
        choices: [
            {
                text: "[Intimidate] 'I am the cost of doing business now. Adapt.'",
                diceCheck: { attribute: 'dominance', ability: 'Intimidation', difficulty: 7 },
                narrativeLog: "You channel your sheer presence, an oppressive weight in the sterile office.",
                successLog: "Jones pauses, recalculating. He sees not a liability, but a potential force of nature. He seems to reconsider.",
                failureLog: "Your threat hangs in the air, but Jones seems unimpressed, merely tapping his stylus on the datapad.",
                consequences: [
                     { type: 'updateReputation', payload: { type: 'Feared', amount: 3 } },
                ]
            },
            {
                text: "[Stealth (Subtext)] 'It would be a shame if more of your shipments went missing.'",
                diceCheck: { attribute: 'wits', ability: 'Stealth', difficulty: 8 },
                narrativeLog: "You subtly imply your involvement in his recent losses, a veiled threat wrapped in silk.",
                successLog: "A flicker of understanding crosses his face. He recognizes you are a ghost, hard to pin down and dangerous to provoke.",
                failureLog: "He raises an eyebrow, unconvinced. 'Idle threats are cheap,' he replies coolly.",
                consequences: []
            },
            {
                text: "'This was a misunderstanding. I can be a valuable asset.'",
                narrativeLog: "You offer a branch. An appeal to his pragmatism. He listens, his expression unreadable, weighing risk against potential profit.",
                consequences: [
                    { type: 'updateReputation', payload: { type: 'Devious', amount: 2 } },
                ]
            },
            {
                text: "'I'll repay you double. Just tell me who to hit.'",
                narrativeLog: "You offer to become his weapon, to turn your power to his advantage. A dangerous, but potentially lucrative, proposition.",
                consequences: [
                    { type: 'addCurrency', payload: { xp: 20, sovereigns: -50 } }, // Represents the debt you take on
                    { type: 'updateReputation', payload: { type: 'Honorable', amount: 1 } },
                ]
            },
        ]
    }
];
