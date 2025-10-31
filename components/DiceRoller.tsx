import React, { useEffect, useState } from 'react';
import { Dices } from 'lucide-react';
import { DiceRollResult } from '../utils/dice';

interface DiceRollerProps {
    rollResult: DiceRollResult;
    difficulty: number;
    poolSize: number;
    title: string;
    onClose: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ rollResult, difficulty, poolSize, title, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation
        const timer = setTimeout(() => setVisible(true), 50);
        // Auto-close after a few seconds
        const closeTimer = setTimeout(onClose, 4000);
        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        }
    }, [onClose]);

    const getOutcomeText = () => {
        if (rollResult.isBotch) return "BOTCH!";
        if (rollResult.successes === 0) return "FAILURE";
        if (rollResult.successes >= 3) return "CRITICAL SUCCESS!";
        return "SUCCESS";
    }

    const outcomeColor = rollResult.isBotch || rollResult.successes === 0 ? 'text-red-500' : 'text-green-400';

    return (
        <div 
            className={`fixed inset-0 bg-black/80 flex items-center justify-center z-[100] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 w-full max-w-lg shadow-lg shadow-red-500/30 text-center animate-pop-in" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-cinzel text-red-300 mb-2 flex items-center justify-center">
                    <Dices className="w-6 h-6 mr-3" />
                    {title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">Rolling {poolSize} dice vs. Difficulty {difficulty}</p>
                
                <div className="flex flex-wrap justify-center gap-3 my-6">
                    {rollResult.results.map((res, i) => (
                        <div key={i} className={`
                            w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 rounded-md
                            ${res >= difficulty ? 'bg-green-500/20 border-green-500 text-white' : (res === 1 ? 'bg-red-500/20 border-red-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-300')}
                            transform transition-transform duration-500 delay-${i * 100} ${visible ? 'scale-100' : 'scale-0'}`
                        }>
                            {res}
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <p className={`text-3xl font-bold font-cinzel ${outcomeColor}`}>{getOutcomeText()}</p>
                    <p className="text-gray-300">{rollResult.successes} Successes</p>
                </div>
            </div>
        </div>
    );
};
