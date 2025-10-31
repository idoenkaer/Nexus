import React, { useState } from 'react';
import { RewardProps, Ritual } from '../types';
import { rituals } from '../data/rituals';
import { Gem, Coins, Sword, Shield, Crown } from 'lucide-react';

const icons: { [key: string]: React.ElementType } = {
  Sword, Shield, Crown, Gem
};

export const RitualAltar: React.FC<RewardProps> = ({ userProfile, spendSovereigns, spendSoulShards, addBuff }) => {
    const [feedback, setFeedback] = useState<string | null>(null);

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(null), 3000);
    };
    
    const handlePerformRitual = (ritual: Ritual) => {
        if (userProfile.sovereigns < ritual.cost.sovereigns) {
            showFeedback("Not enough Sovereigns.");
            return;
        }
        if (userProfile.soulShards < ritual.cost.soulShards) {
            showFeedback("Not enough Soul Shards.");
            return;
        }

        if (spendSovereigns(ritual.cost.sovereigns) && spendSoulShards(ritual.cost.soulShards)) {
            addBuff(ritual.buff);
            showFeedback(`${ritual.name} complete!`);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-gray-400 text-sm">Perform a ritual to gain a temporary, powerful boon. The price is paid in coin and essence.</p>
            
            <div className="space-y-3">
                {rituals.map(ritual => {
                    const Icon = icons[ritual.icon] || Gem;
                    const canAfford = userProfile.sovereigns >= ritual.cost.sovereigns && userProfile.soulShards >= ritual.cost.soulShards;

                    return (
                        <div key={ritual.id} className="bg-gray-900/50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <Icon className="w-8 h-8 mr-4 text-purple-400" />
                                <div>
                                    <p className="font-semibold text-red-300">{ritual.name}</p>
                                    <p className="text-xs text-gray-400">{ritual.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end space-x-3 mb-2">
                                    <div className="flex items-center text-xs text-yellow-500"><Coins className="w-3 h-3 mr-1" /> {ritual.cost.sovereigns}</div>
                                    <div className="flex items-center text-xs text-purple-400"><Gem className="w-3 h-3 mr-1" /> {ritual.cost.soulShards}</div>
                                </div>
                                <button
                                    onClick={() => handlePerformRitual(ritual)}
                                    disabled={!canAfford}
                                    className="px-4 py-1 text-xs font-semibold bg-purple-700 rounded-md hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                >
                                    Perform
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {feedback && <p className="text-center text-purple-300 text-sm mt-2 animate-pop-in">{feedback}</p>}
        </div>
    );
};
