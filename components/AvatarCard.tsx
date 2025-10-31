

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Shield } from 'lucide-react';

interface AvatarCardProps {
    name: string;
    level?: number;
    avatarIcon: LucideIcon;
    hp: number;
    maxHp: number;
    isDefending?: boolean;
    isPlayer?: boolean;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({ name, level, avatarIcon: Icon, hp, maxHp, isDefending = false, isPlayer = false }) => {
    const hpPercentage = maxHp > 0 ? (hp / maxHp) * 100 : 0;

    const getHpBarColor = () => {
        if (hpPercentage > 50) return 'bg-green-500';
        if (hpPercentage > 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const cardClasses = `
        bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-lg p-4
        shadow-lg transition-all duration-300
        ${isPlayer ? 'border-gray-300/50' : 'border-red-500/50'}
    `;

    return (
        <div className={cardClasses}>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Icon className={`w-16 h-16 ${isPlayer ? 'text-gray-200' : 'text-red-300'}`} />
                    {isDefending && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 p-1 rounded-full animate-pulse">
                             <Shield className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-bold font-cinzel text-white">{name}</h3>
                        {level && <span className="text-sm font-semibold text-gray-400">Lvl {level}</span>}
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
                            <span>HP</span>
                            <span>{hp} / {maxHp}</span>
                        </div>
                        <div className="w-full bg-gray-900/50 rounded-full h-3 shadow-inner">
                            <div 
                                className={`h-3 rounded-full transition-all duration-500 ${getHpBarColor()}`} 
                                style={{ width: `${hpPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};