
import React, { useState } from 'react';
import { Voicemail, Gem, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { RewardProps } from '../types';
import { Character } from '../types';
import { generateWhisper } from '../services/geminiService';

interface Echox25WhisperProps extends RewardProps {
    character: Character;
}

const WHISPER_COST = 1;

export const Echox25Whisper: React.FC<Echox25WhisperProps> = ({ userProfile, spendSoulShards, character }) => {
    const [whisper, setWhisper] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const handleGetWhisper = async () => {
        if (userProfile.soulShards < WHISPER_COST) {
            setFeedbackMessage("You lack the soul shards to pay the price.");
            setTimeout(() => setFeedbackMessage(null), 3000);
            return;
        }

        if (spendSoulShards(WHISPER_COST)) {
            setIsLoading(true);
            setFeedbackMessage(null);
            setWhisper(null);

            const result = await generateWhisper(character);
            
            setWhisper(result);
            setIsLoading(false);
        }
    };

    const isErrorWhisper = whisper?.includes("fade into static");

    return (
        <Card title="Echox25 Whisper" icon={Voicemail} subtitle="Pay the price for forbidden knowledge.">
            <div className="flex flex-col items-center justify-center text-center h-40 space-y-4 p-2 relative">
                {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                ) : whisper ? (
                    <blockquote className={`text-lg font-cinzel animate-pop-in ${isErrorWhisper ? 'text-red-400' : 'text-purple-200'}`}>
                        &ldquo;{whisper}&rdquo;
                    </blockquote>
                ) : (
                    <p className="text-gray-400 italic text-sm">
                        The æther crackles. A voice, not of this world, offers a sliver of truth... for a price.
                    </p>
                )}
                {feedbackMessage && (
                    <div className="absolute bottom-0 text-xs text-red-400 animate-pop-in">
                        {feedbackMessage}
                    </div>
                )}
            </div>

            <button
                onClick={handleGetWhisper}
                disabled={isLoading || userProfile.soulShards < WHISPER_COST}
                className="w-full mt-2 flex items-center justify-center bg-purple-800/80 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            >
                <Gem className="w-4 h-4 mr-2" />
                Receive Whisper ({WHISPER_COST} Soul Shard)
            </button>
        </Card>
    );
};