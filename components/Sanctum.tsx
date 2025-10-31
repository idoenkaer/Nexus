import React, { useMemo } from 'react';
import { Home, ArrowLeft, Coins, Gem, Check, X } from 'lucide-react';
import { SharedAppProps, SanctumModule } from '../types';
import { Section } from './Section';
import { Card } from './Card';
import { achievements } from '../data/achievements';

interface SanctumProps extends SharedAppProps {
    onBack: () => void;
}

const ModuleCard: React.FC<{
    module: SanctumModule;
    userProfile: SharedAppProps['userProfile'];
    onUpgrade: (moduleId: SanctumModule['id']) => void;
}> = ({ module, userProfile, onUpgrade }) => {

    const isMaxLevel = module.level >= module.maxLevel;
    const nextLevelCost = !isMaxLevel ? module.upgradeCosts[module.level] : null;
    const canAfford = nextLevelCost 
        ? userProfile.sovereigns >= nextLevelCost.sovereigns && userProfile.soulShards >= nextLevelCost.soulShards
        : false;

    return (
        <Card title={module.name} icon={module.icon} className="flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-baseline mb-2">
                     <p className="text-sm text-gray-400">{module.description}</p>
                     <span className="text-sm font-bold text-red-300 flex-shrink-0 ml-2">
                        Lvl {module.level} / {module.maxLevel}
                     </span>
                </div>
                <p className="text-xs italic text-purple-300 my-2">{module.bonusDescription}</p>
            </div>
            {!isMaxLevel && nextLevelCost ? (
                <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <h5 className="text-xs font-semibold text-gray-300 mb-2">Next Upgrade:</h5>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                             <div className={`flex items-center text-sm ${userProfile.sovereigns >= nextLevelCost.sovereigns ? 'text-yellow-500' : 'text-red-500'}`}>
                                <Coins className="w-4 h-4 mr-1.5" /> {nextLevelCost.sovereigns}
                            </div>
                             <div className={`flex items-center text-sm ${userProfile.soulShards >= nextLevelCost.soulShards ? 'text-purple-400' : 'text-red-500'}`}>
                                <Gem className="w-4 h-4 mr-1.5" /> {nextLevelCost.soulShards}
                            </div>
                        </div>
                        <button
                            onClick={() => onUpgrade(module.id)}
                            disabled={!canAfford}
                            className="px-4 py-2 text-sm font-semibold bg-red-600 rounded-md hover:bg-red-500 disabled:bg-gray-600 transition-colors"
                        >
                            Upgrade
                        </button>
                    </div>
                </div>
            ) : (
                 <div className="mt-4 pt-3 border-t border-gray-700/50 text-center">
                    <p className="text-sm font-semibold text-yellow-400">Max Level Reached</p>
                 </div>
            )}
        </Card>
    );
};


export const Sanctum: React.FC<SanctumProps> = (props) => {
    const { onBack, sanctumState, upgradeSanctumModule, unlockedAchievementIds, userProfile } = props;
    
    const unlockedAchievementsList = useMemo(() => achievements.filter(a => unlockedAchievementIds.has(a.id)), [unlockedAchievementIds]);

    return (
        <div className="animate-pop-in">
            <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dominion
            </button>
            <Section title="The Sanctum" icon={Home}>
                <p className="text-gray-400 mb-6 italic">"Your hidden sanctum, a nexus of power carved from the digital and the arcane. From here, your influence grows. Cultivate it, for the shadows are always watching."</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(sanctumState).map(module => {
                        if (module.id === 'trophyDisplay') {
                            return (
                                <Card key={module.id} title={module.name} icon={module.icon} className="md:col-span-2">
                                     <p className="text-sm text-gray-400 mb-4">{module.description}</p>
                                     {unlockedAchievementsList.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                            {unlockedAchievementsList.map(ach => {
                                                const Icon = ach.icon;
                                                return (
                                                    <div key={ach.id} className="relative group flex flex-col items-center text-center bg-gray-900/50 p-3 rounded-lg" title={ach.name}>
                                                        <Icon className="w-10 h-10 text-yellow-400" />
                                                        <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                                            <p className="font-bold">{ach.name}</p>
                                                            <p>{ach.description}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                     ) : (
                                        <p className="text-center text-gray-500 italic py-4">Your display is empty. Go forth and forge your legend.</p>
                                     )}
                                </Card>
                            )
                        }
                        return <ModuleCard key={module.id} module={module} userProfile={userProfile} onUpgrade={upgradeSanctumModule} />;
                    })}
                </div>
            </Section>
        </div>
    );
};
