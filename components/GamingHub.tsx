import React, { useState, useEffect } from 'react';
import { Swords, Puzzle, Target, ListTodo, Star, Coins, Users, Briefcase, Home } from 'lucide-react';
import { Section } from './Section';
import { Card } from './Card';
import { TriviaGame } from './TriviaGame';
import { RPGCharacterCard } from './RPGCharacterCard';
import { CombatZone } from './CombatZone';
import { NarrativeLog, SharedAppProps } from '../types';
import { generateNarrative } from '../services/geminiService';
import { NexusChronicle } from './NexusChronicle';
import { Echox25Whisper } from './Echox25Whisper';
import { WebOfInfluence } from './WebOfInfluence';
import { SocialConflictZone } from './SocialConflictZone';
import { ShadowSyndicate } from './ShadowSyndicate';
import { Sanctum } from './Sanctum';

interface GamifiedProductivityProps {
    addCurrency: (xp: number, sovereigns: number) => void;
}

const GamifiedProductivity: React.FC<GamifiedProductivityProps> = ({ addCurrency }) => {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Scout rival territory', done: false, reward: { xp: 50, sovereigns: 10 } },
        { id: 2, text: 'Train your combat skills', done: true, reward: { xp: 25, sovereigns: 5 } },
        { id: 3, text: 'Decode an ancient text', done: false, reward: { xp: 20, sovereigns: 5 } },
    ]);

    const toggleTask = (id: number) => {
        const newTasks = tasks.map(task => {
            if (task.id === id && !task.done) {
                addCurrency(task.reward.xp, task.reward.sovereigns);
                return { ...task, done: true };
            }
            return task;
        });
        setTasks(newTasks);
    };

    return (
        <Card title="Nightly Contracts" icon={ListTodo} className="bg-gray-800/70">
            <ul className="space-y-2">
                {tasks.map(task => (
                    <li key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center justify-between p-2 rounded-md transition-colors ${task.done ? 'bg-gray-700/30' : 'bg-gray-700/80 cursor-pointer hover:bg-gray-700'}`}>
                        <div className="flex items-center">
                            <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center ${task.done ? 'bg-green-500' : 'bg-gray-800 border border-gray-600'}`}>
                                {task.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`${task.done ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.text}</span>
                        </div>
                        {!task.done && (
                            <div className="flex items-center space-x-2 text-xs">
                                <div className="flex items-center text-yellow-400"><Star className="w-3 h-3 mr-1"/>{task.reward.xp}</div>
                                <div className="flex items-center text-yellow-600"><Coins className="w-3 h-3 mr-1"/>{task.reward.sovereigns}</div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

export const GamingHub: React.FC<SharedAppProps> = (props) => {
  const [narrativeLogs, setNarrativeLogs] = useState<NarrativeLog[]>([]);
  const [activeConflictId, setActiveConflictId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'main' | 'sanctum'>('main');

  const addNarrativeLog = async (prompt: string) => {
      const narrativeText = await generateNarrative(prompt);
      if (narrativeText) {
          setNarrativeLogs(prev => [...prev, {
              id: Date.now() + Math.random(),
              text: narrativeText,
              timestamp: Date.now()
          }]);
      }
  };
  
  const allProps = { ...props, addNarrativeLog };

  useEffect(() => {
    if (narrativeLogs.length === 0) {
        addNarrativeLog("Generate a brief, grim welcome for a new predator awakening in the Hunting Grounds, a realm of shadow and blood.");
    }
  }, []);

  if (activeConflictId) {
    return <SocialConflictZone 
        conflictId={activeConflictId} 
        {...allProps} 
        onComplete={() => setActiveConflictId(null)} 
    />;
  }

  if (activeView === 'sanctum') {
    return <Sanctum {...props} onBack={() => setActiveView('main')} />;
  }

  return (
    <div className="space-y-8">
      <Section title="The Hunting Grounds" icon={Swords}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RPGCharacterCard {...allProps} setActiveConflictId={setActiveConflictId} />
            <div className="md:col-span-2 space-y-4">
              <NexusChronicle logs={narrativeLogs} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="Forbidden Lore" subtitle="Test your knowledge of the night" icon={Puzzle}>
                    <TriviaGame {...props} />
                </Card>
                <Echox25Whisper {...props} character={props.character} />
              </div>
              <GamifiedProductivity addCurrency={props.addCurrency} />
            </div>
        </div>
      </Section>

      <Section title="The Sanctum" icon={Home}>
        <Card title="Enter Your Sanctum" icon={Home} subtitle="Your personal, upgradable hideout." onClick={() => setActiveView('sanctum')}>
            <p className="text-sm text-gray-400">Forge your seat of power. Upgrade modules to gain passive bonuses and unlock new functionalities. A ruler's strength is reflected in their domain.</p>
        </Card>
      </Section>

      <Section title="Shadow Syndicate" icon={Briefcase}>
        <ShadowSyndicate {...props} />
      </Section>

      <Section title="Web of Influence" icon={Users}>
        <WebOfInfluence {...props} />
      </Section>

      <Section title="The Arena" icon={Swords}>
        <CombatZone {...allProps} />
      </section>
    </div>
  );
};
