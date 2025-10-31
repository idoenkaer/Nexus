
import React, { useState, useEffect } from 'react';
import { Terminal, Gem, Loader2 } from 'lucide-react';
import { SharedAppProps, Character } from '../types';
import { generateOmegaDossier } from '../services/geminiService';

const ORACLE_COST = 2;

// A simple hook for the typewriter effect
const useTypewriter = (text: string, speed = 20) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); // Reset on new text
        if (text) {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);

            return () => {
                clearInterval(typingInterval);
            };
        }
    }, [text, speed]);

    return displayText;
};

export const OmegaOracle: React.FC<Pick<SharedAppProps, 'userProfile' | 'spendSoulShards' | 'character'>> = ({ userProfile, spendSoulShards, character }) => {
    const [query, setQuery] = useState('');
    const [dossier, setDossier] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const typedDossier = useTypewriter(dossier || '');

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            showFeedback("Query cannot be empty.");
            return;
        }
        if (userProfile.soulShards < ORACLE_COST) {
            showFeedback("Insufficient Soul Shards to access the Oracle.");
            return;
        }

        if (spendSoulShards(ORACLE_COST)) {
            setIsLoading(true);
            setDossier(null);
            const result = await generateOmegaDossier(query, character);
            setDossier(result);
            setIsLoading(false);
            setQuery('');
        }
    };

    return (
        <>
            <p className="text-gray-400 text-sm mb-4">Submit your query to the Oracle. The price for truth is {ORACLE_COST} Soul Shards.</p>
            
            <form onSubmit={handleQuery} className="flex items-center space-x-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="QUERY: Target, Location, Anomaly..."
                    className="flex-grow bg-gray-900/80 border border-gray-700 rounded-md p-2 text-red-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !query.trim() || userProfile.soulShards < ORACLE_COST} 
                    className="flex items-center justify-center bg-red-800/80 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm hover:shadow-[0_0_15px_rgba(153,27,27,0.6)]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Gem className="w-4 h-4 mr-2" /> Submit ({ORACLE_COST})</>}
                </button>
            </form>

            {feedback && <p className="text-center text-red-400 text-sm mb-2 animate-pop-in">{feedback}</p>}

            <div className="mt-4 p-4 bg-black border border-red-900/50 rounded-lg min-h-[200px] font-mono text-sm text-red-400/90 relative overflow-hidden terminal-screen">
                <div className="scanline-overlay"></div>
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2"/>
                        <p className="text-red-500/80">ACCESSING ORACLE...</p>
                    </div>
                )}
                {typedDossier && (
                    <pre className="whitespace-pre-wrap animate-pop-in">
                        {typedDossier}
                        {!isLoading && <span className="blinking-cursor">_</span>}
                    </pre>
                )}
                {!isLoading && !dossier && (
                     <p className="text-gray-600">&gt; STANDING BY FOR QUERY...<span className="blinking-cursor">_</span></p>
                )}
            </div>
        </>
    );
};
