import React, { useState, useEffect, useRef } from 'react';
import { Moon, Wind, BarChart3, Music, Leaf, Gem, BrainCircuit, Waves, Power, Loader2, Play, Pause, XCircle } from 'lucide-react';
import { Section } from './Section';
import { Card } from './Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RewardProps } from '../types';
import { RitualAltar } from './RitualAltar';
import { generateMeditationAudio } from '../services/geminiService';

const moodData = [
  { name: 'Mon', mood: 4 },
  { name: 'Tue', mood: 3 },
  { name: 'Wed', mood: 5 },
  { name: 'Thu', mood: 4 },
  { name: 'Fri', mood: 5 },
  { name: 'Sat', mood: 4 },
  { name: 'Sun', mood: 3 },
];

const ProgressTracker: React.FC = () => (
    <Card title="Mental Fortitude" icon={BarChart3}>
        <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                        contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.5rem' 
                        }} 
                    />
                    <Bar dataKey="mood" fill="url(#darkGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                        <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4}/>
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Your Fortitude This Week (1-5)</p>
    </Card>
);


const BreathingExercise: React.FC<{ addSoulShards: (amount: number) => void }> = ({ addSoulShards }) => {
  const [text, setText] = useState('Get Ready...');
  const [isActive, setIsActive] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const cyclesCompleted = useRef(0);

  useEffect(() => {
    if (!isActive) {
        if (cyclesCompleted.current > 0) {
            addSoulShards(cyclesCompleted.current);
            setRewardMessage(`You earned ${cyclesCompleted.current} Soul Shard(s)!`);
            setTimeout(() => setRewardMessage(null), 3000);
        }
        cyclesCompleted.current = 0;
        setText('Get Ready...');
        return;
    }

    const cycle = () => {
      setText('Inhale');
      setTimeout(() => {
        setText('Hold');
        setTimeout(() => {
          setText('Exhale');
          setTimeout(() => {
            cyclesCompleted.current += 1;
          }, 4000); // Out duration
        }, 2000); // Hold duration
      }, 4000); // Inhale duration
    };

    cycle();
    const interval = setInterval(cycle, 10000); // Total cycle time: 4s in + 2s hold + 4s out

    return () => clearInterval(interval);
  }, [isActive, addSoulShards]);
  
  const handleToggle = () => {
    setIsActive(!isActive);
    setRewardMessage(null); // Clear previous messages
  }

  const isExpanding = isActive && (text === 'Inhale' || text === 'Hold');

  return (
    <Card title="Focus Meditation" icon={Wind}>
        <div className="relative flex flex-col items-center justify-center h-48 space-y-4 overflow-hidden">
            <div 
                className={`absolute inset-0 transition-all duration-3000 ease-in-out ${isExpanding ? 'scale-150' : 'scale-100'}`}
                style={{
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0) 60%)'
                }}
            ></div>
            <div 
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-[3000ms] ease-in-out ${isExpanding ? 'scale-110' : 'scale-75'}`}
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0) 70%)'
                }}
            >
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center shadow-2xl shadow-black">
                     <p className="text-lg font-semibold text-red-200">{text}</p>
                </div>
            </div>
            
            <button onClick={handleToggle} className="z-10 px-4 py-2 bg-red-600 rounded-md hover:bg-red-500 transition-colors text-sm font-medium w-24 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                {isActive ? 'Stop' : 'Start'}
            </button>
            {rewardMessage && 
                <div className="absolute bottom-4 flex items-center text-sm text-purple-300 animate-pop-in z-10">
                    <Gem className="w-4 h-4 mr-2" /> {rewardMessage}
                </div>
            }
        </div>
    </Card>
  );
};

// Helper functions for audio decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// New Guided Meditations Component
const meditationTopics = [
    { id: 'silence', title: 'Silence the Static', icon: BrainCircuit, prompt: 'Guide me through silencing the digital noise in my mind. Help me find the core signal beneath the static.' },
    { id: 'void', title: 'Embrace the Void', icon: Waves, prompt: 'Lead me on a journey into the calm, empty void between data packets. A meditation on stillness in a world of constant flow.' },
    { id: 'core', title: 'Find the Core', icon: Power, prompt: 'Help me focus on my inner power source, the unshakable core within the fragile shell of chrome and flesh.' },
];

const GuidedMeditations: React.FC<RewardProps> = (props) => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeMeditation, setActiveMeditation] = useState<{ id: string; source: AudioBufferSourceNode; buffer: AudioBuffer } | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on mount and clean up on unmount
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const currentContext = audioContextRef.current;
        return () => {
            currentContext?.close();
        };
    }, []);

     // Effect for cleaning up audio source on unmount or when it changes
    useEffect(() => {
        return () => {
            if (activeMeditation) {
                activeMeditation.source.stop();
            }
        }
    }, [activeMeditation]);

    const playAudio = (buffer: AudioBuffer, topicId: string) => {
        if (!audioContextRef.current) return;
        if (activeMeditation) {
            activeMeditation.source.stop();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();

        const newMeditation = { id: topicId, source, buffer };
        setActiveMeditation(newMeditation);
        
        source.onended = () => {
            setActiveMeditation(current => (current?.id === topicId ? null : current));
            // Reward on completion
            props.addCurrency(15, 0); // 15 XP for completing meditation
        };
    };
    
    const handleSelectTopic = async (topic: typeof meditationTopics[0]) => {
        if (isLoading || activeMeditation?.id === topic.id) return;

        setIsLoading(topic.id);
        setError(null);
        
        const base64Audio = await generateMeditationAudio(topic.prompt);
        
        if (base64Audio && audioContextRef.current) {
            try {
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                playAudio(audioBuffer, topic.id);
            } catch (e) {
                console.error("Error decoding audio:", e);
                setError("Failed to process audio stream.");
            }
        } else {
            setError("Meditation unavailable. The Aether is silent. (API Disabled)");
        }
        
        setIsLoading(null);
    };

    const handleStop = () => {
        if(activeMeditation) {
            activeMeditation.source.stop();
            setActiveMeditation(null);
        }
    }

    return (
        <Card title="Guided Meditations" icon={Music}>
            <p className="text-gray-400 text-sm mb-4">Focus your mind. Let the whispers from the Aether guide you to a state of calm focus. Each session completed strengthens your resolve.</p>
            {error && (
                <div className="flex items-center justify-center p-2 mb-3 bg-red-900/50 rounded-md text-red-300 animate-pop-in">
                    <XCircle className="w-4 h-4 mr-2" />
                    <p className="text-sm font-semibold">{error}</p>
                </div>
            )}
            <div className="space-y-3">
                {meditationTopics.map(topic => {
                    const isPlaying = activeMeditation?.id === topic.id;
                    return (
                        <div key={topic.id} className="bg-gray-900/50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <topic.icon className={`w-6 h-6 mr-4 ${isPlaying ? 'text-purple-400 animate-pulse' : 'text-purple-300'}`} />
                                <div>
                                    <p className="font-semibold text-red-300">{topic.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => isPlaying ? handleStop() : handleSelectTopic(topic)}
                                disabled={!!isLoading && isLoading !== topic.id}
                                className="w-24 flex items-center justify-center px-4 py-2 text-sm font-semibold bg-purple-700 rounded-md hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading === topic.id ? <Loader2 className="w-5 h-5 animate-spin"/> : (isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>)}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};


export const MeditationZone: React.FC<RewardProps> = (props) => {
  const [activeRitual, setActiveRitual] = useState(false);
  const [showMeditations, setShowMeditations] = useState(false);

  return (
    <div className="space-y-8">
      <Section title="The Shadow Haven" icon={Moon}>
        <p className="text-gray-400 mb-6 italic">"In the crushing darkness, the only sanctuary is within. Sharpen your mind, for it is your greatest weapon and your most vulnerable fortress."</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BreathingExercise addSoulShards={props.addSoulShards} />
          <ProgressTracker />
          <Card 
            title="Ritual Altar" 
            subtitle="Channel power from beyond" 
            icon={Gem}
            onClick={() => { setActiveRitual(!activeRitual); setShowMeditations(false); }}
          />
          <Card 
            title="Guided Meditations" 
            subtitle="Harness the Aether's whispers" 
            icon={Music}
            onClick={() => { setShowMeditations(!showMeditations); setActiveRitual(false); }}
          />
        </div>
        {activeRitual && (
          <div className="mt-8 animate-pop-in">
            <Card title="Ritual Altar" icon={Gem}>
              <RitualAltar {...props} />
            </Card>
          </div>
        )}
        {showMeditations && (
          <div className="mt-8 animate-pop-in">
            <GuidedMeditations {...props} />
          </div>
        )}
      </section>
    </div>
  );
};
