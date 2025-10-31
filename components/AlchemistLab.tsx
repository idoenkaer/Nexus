
import React, { useState } from 'react';
import { FlaskConical, Gem, Loader2, Beaker } from 'lucide-react';
import { SharedAppProps } from '../types';
import { AlchemicalIngredient, RPGItem } from '../types';

const ingredients: AlchemicalIngredient[] = [
    { id: 1, name: 'Nightshade Sovereign', description: 'Glossy black berries on violet stems, leaves edged in silver.', use: 'Enhances stealth, but prolonged use tempts madness.' },
    { id: 2, name: 'Emberthorn Ivy', description: 'Twisting, dark green vines with blood-red thorns.', use: 'Used in potions of rage, fuels powerful but risky berserk effects.' },
    { id: 3, name: 'Mooncrest Blossom', description: 'Pale blue petals that glow under moonlight, faint silver scent.', use: 'Grants temporary protection from supernatural charm or mind control.' },
    { id: 4, name: 'Ironroot Mandrake', description: 'Gnarled root with the shape of a clenched fist, exudes metallic sap.', use: 'Ground into poultices for healing wounds resistant to normal medicine.' },
    { id: 5, name: 'Crimson Widow Moss', description: 'Deep red moss that creeps over gravestones and stone walls.', use: 'Brewed as a poison or loyalty elixir; amplifies obedience if willingly consumed.' },
    { id: 6, name: 'Wolfsbane Glory', description: 'Sharply pointed indigo flowers, leaves with wolf-paw pattern.', use: 'Repels shapechangers/lycanthropes; dangerous if mishandled.' },
    { id: 7, name: 'Sable Lotus', description: 'Jet black lotus with shimmering, hypnotic center.', use: 'Smoked or brewed for intense visions or memory recovery.' },
    { id: 8, name: 'Vitriol Fern', description: 'Metallic-looking dark green fronds, edges drip caustic resin.', use: 'Dissolves curses, but also weakens physical strength temporarily.' },
    { id: 9, name: 'Priest’s Morrow', description: 'Pale gold flower, blooms at dawn on haunted ground.', use: 'Used to sanctify sites, weaken undead, or break a blood oath.' },
    { id: 10, name: 'Veinleaf Orchid', description: 'Dusky purple orchid, petals streaked with crimson, pulse faintly.', use: 'Mixed into powerful charisma tonics; addictive with repeated use.' }
];

const recipes: Record<string, Omit<RPGItem, 'id' | 'cost'>> = {
    '4': { name: "Minor Healing Draught", description: "A simple but effective restorative.", icon: 'ShieldPlus', type: 'Potion', effect: { type: 'heal', payload: { amount: 15 } } },
    '2_4': { name: "Draught of Resilience", description: "Mends flesh and hardens it against future blows.", icon: 'ShieldPlus', type: 'Potion', effect: { type: 'heal', payload: { amount: 35 } } },
    '1_7': { name: "Potion of Sable Visions", description: "A dangerous concoction that can grant insight or madness.", icon: 'Gem', type: 'Misc' },
};

const BREW_COST = 1;
const MAX_SELECTION = 3;

export const AlchemistLab: React.FC<SharedAppProps> = ({ userProfile, spendSoulShards, addItem, setCurrentQuestId }) => {
    const [selectedIngredients, setSelectedIngredients] = useState<AlchemicalIngredient[]>([]);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleSelectIngredient = (ingredient: AlchemicalIngredient) => {
        const isSelected = selectedIngredients.find(i => i.id === ingredient.id);
        if (isSelected) {
            setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredient.id));
        } else {
            if (selectedIngredients.length >= MAX_SELECTION) {
                showFeedback(`You can only combine up to ${MAX_SELECTION} ingredients.`);
                return;
            }
            setSelectedIngredients([...selectedIngredients, ingredient]);
        }
    };

    const handleBrew = async () => {
        if (selectedIngredients.length === 0) {
            showFeedback("Select ingredients to brew.");
            return;
        }
        if (userProfile.soulShards < BREW_COST) {
            showFeedback("Not enough Soul Shards to conduct this experiment.");
            return;
        }

        if (spendSoulShards(BREW_COST)) {
            setIsLoading(true);
            setLastResult(null);
            
            // Simulate brewing process
            await new Promise(res => setTimeout(res, 1000));

            const recipeKey = selectedIngredients.map(i => i.id).sort().join('_');
            const recipe = recipes[recipeKey];
            const outcome = Math.random();

            if (recipe && recipeKey === '1_7' && outcome < 0.3) { // 30% chance for mutation on Sable Lotus recipe
                setLastResult("MUTATION! The fumes twist reality. Your mind is flooded with visions of a forgotten place...");
                setCurrentQuestId(200);
            } else if (recipe && outcome < 0.8) { // 80% success for known recipes
                const newItem = { ...recipe, id: Date.now(), cost: 0 };
                addItem(newItem as RPGItem);
                setLastResult(`SUCCESS! You brewed: ${newItem.name}.`);
            } else if (outcome < 0.95) { // 15% failure
                const dudItem = { id: Date.now(), name: "Inert Goop", description: "A bubbling, useless sludge. A failure.", cost: 0, icon: 'Misc', type: 'Misc' };
                addItem(dudItem as RPGItem);
                setLastResult("FAILURE. The concoction turns into an inert, useless goop.");
            } else { // 5% mutation on unknown recipes
                setLastResult("MUTATION! The mixture glows with an eerie light, then stabilizes into a strange, unknown substance.");
                const mutationItem = { id: Date.now(), name: "Unstable Concoction", description: "A volatile, unpredictable brew. Use with caution.", cost: 0, icon: 'Misc', type: 'Misc' };
                addItem(mutationItem as RPGItem);
            }
            
            setSelectedIngredients([]);
            setIsLoading(false);
        }
    };

    return (
        <>
            <p className="text-gray-400 text-sm mb-4">Select up to {MAX_SELECTION} ingredients to combine. The price for forbidden knowledge is {BREW_COST} Soul Shard.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {ingredients.map(ing => {
                    const isSelected = !!selectedIngredients.find(i => i.id === ing.id);
                    return (
                        <div key={ing.id} onClick={() => handleSelectIngredient(ing)} className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-red-500/20 border-red-500/50 scale-105' : 'bg-gray-900/50 border-gray-700 hover:border-gray-500'}`} title={ing.use}>
                            <p className="font-semibold text-sm text-red-300">{ing.name}</p>
                            <p className="text-xs text-gray-400">{ing.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Beaker className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-300">
                        {selectedIngredients.length > 0 ? selectedIngredients.map(i => i.name).join(', ') : 'No ingredients selected'}
                    </span>
                </div>
                <button onClick={handleBrew} disabled={isLoading || selectedIngredients.length === 0 || userProfile.soulShards < BREW_COST} className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Gem className="w-4 h-4 mr-2" /> Brew ({BREW_COST})</>}
                </button>
            </div>

            {feedback && <p className="text-center text-red-400 text-sm mt-2 animate-pop-in">{feedback}</p>}

            {(isLoading || lastResult) && (
                <div className="mt-4 p-4 bg-gray-900/70 border border-gray-700/50 rounded-lg animate-pop-in">
                    <h4 className="text-lg font-bold font-cinzel text-red-300 mb-2">Alchemical Result</h4>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-12">
                             <p className="text-gray-300 italic">Brewing... the alembic bubbles violently...</p>
                        </div>
                    ) : (
                        <p className="text-gray-300 whitespace-pre-wrap text-sm italic">{lastResult}</p>
                    )}
                </div>
            )}
        </>
    );
};