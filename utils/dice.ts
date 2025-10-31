// utils/dice.ts
export interface DiceRollResult {
    successes: number;
    results: number[];
    isBotch: boolean;
    isCritical: boolean;
}

/**
 * Rolls a pool of d10s and calculates successes.
 * - Success: A die result that is >= difficulty.
 * - Critical Success (Storyteller Style): Any '10' counts as a success and allows for an additional die to be rolled.
 * - Botch: No successes are rolled, and at least one '1' is present.
 * @param poolSize The number of d10s to roll.
 * @param difficulty The target number for a success (e.g., 6).
 * @returns An object containing the number of successes, the array of results, and botch status.
 */
export const rollDice = (poolSize: number, difficulty: number): DiceRollResult => {
    const results: number[] = [];
    let successes = 0;
    let ones = 0;
    let diceToRoll = poolSize;

    if (diceToRoll <= 0) { // Handle zero or negative dice pools (chance roll)
        diceToRoll = 1;
    }

    while (diceToRoll > 0) {
        diceToRoll--;
        const roll = Math.floor(Math.random() * 10) + 1;
        results.push(roll);

        if (roll >= difficulty) {
            successes++;
        }
        if (roll === 1) {
            ones++;
        }
        if (roll === 10) { // Critical success grants an extra roll in some systems
            // For simplicity, we'll just count it as a success for now, but this is where re-roll logic would go.
        }
    }
    
    // In many Storyteller systems, ones cancel successes if there are no successes.
    // We will define a botch as "rolling a 1 with no successes".
    const isBotch = successes === 0 && ones > 0 && poolSize > 0;

    return { 
        successes, 
        results, 
        isBotch,
        isCritical: successes > 0 && results.includes(10) // A simple definition of a critical
    };
};
