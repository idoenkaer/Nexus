

import React, { useState, useEffect, useCallback } from 'react';
import { generateTriviaQuestion } from '../services/geminiService';
import { TriviaQuestion, RewardProps } from '../types';
import { Loader2, Gem, CheckCircle, XCircle } from 'lucide-react';

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

const CATEGORIES = ["Science", "History", "Technology", "Pop Culture", "Geography", "Movies"];
const HINT_COST = 1;

export const TriviaGame: React.FC<RewardProps> = ({ userProfile, addCurrency, spendSoulShards }) => {
    const [question, setQuestion] = useState<TriviaQuestion | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
    const [score, setScore] = useState(0);
    const [hintUsed, setHintUsed] = useState<boolean>(false);
    const [removedOptionIndex, setRemovedOptionIndex] = useState<number | null>(null);

    const fetchNewQuestion = useCallback(async () => {
        setLoading(true);
        setError(null);
        setQuestion(null);
        setSelectedAnswer(null);
        setAnswerState('unanswered');
        setHintUsed(false);
        setRemovedOptionIndex(null);
        const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const newQuestion = await generateTriviaQuestion(randomCategory);
        if (newQuestion) {
            setQuestion(newQuestion);
        } else {
            setError("Failed to load a new question. Please try again.");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchNewQuestion();
    }, [fetchNewQuestion]);

    const handleAnswerClick = (index: number) => {
        if (answerState !== 'unanswered') return;
        
        setSelectedAnswer(index);
        if (index === question?.correctAnswerIndex) {
            setAnswerState('correct');
            setScore(s => s + 10);
            addCurrency(10, 2); // Award 10 XP and 2 Sovereigns
        } else {
            setAnswerState('incorrect');
        }
    };

    const handleUseHint = () => {
        if (!question || hintUsed || userProfile.soulShards < HINT_COST) return;
        
        if (spendSoulShards(HINT_COST)) {
            setHintUsed(true);
            const wrongAnswers = question.options
                .map((_, i) => i)
                .filter(i => i !== question.correctAnswerIndex);
            
            const toRemove = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
            setRemovedOptionIndex(toRemove);
        }
    };

    const getButtonClass = (index: number) => {
        if (index === removedOptionIndex) return "bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed";

        if (answerState === 'unanswered') {
            return "bg-gray-700 hover:bg-red-500/50 border-gray-600";
        }
        if (index === question?.correctAnswerIndex) {
            return "bg-green-500/30 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]";
        }
        if (index === selectedAnswer) {
            return "bg-red-500/30 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]";
        }
        return "bg-gray-700/50 border-gray-600 opacity-50";
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold">
                <p>Score: <span className="font-bold text-red-400">{score}</span></p>
                <div className="flex items-center space-x-2">
                    <button onClick={handleUseHint} disabled={loading || hintUsed || userProfile.soulShards < HINT_COST || answerState !== 'unanswered'} className="flex items-center px-3 py-1 text-xs bg-purple-600 rounded-md hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        <Gem className="w-3 h-3 mr-1.5"/> Hint ({HINT_COST})
                    </button>
                    <button onClick={fetchNewQuestion} disabled={loading} className="px-3 py-1 text-xs bg-red-600 rounded-md hover:bg-red-500 disabled:bg-gray-600 transition-colors hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        New
                    </button>
                </div>
            </div>

            {loading && <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-red-400" /></div>}
            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {question && !loading && (
                <div>
                    <p className="text-md font-medium mb-4 text-gray-200">{question.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                disabled={answerState !== 'unanswered' || index === removedOptionIndex}
                                className={`p-3 rounded-lg border text-left transition-all duration-300 ${getButtonClass(index)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {answerState !== 'unanswered' && (
                <div className="mt-4 p-3 rounded-lg flex items-center justify-center text-white animate-pop-in"
                    style={{ 
                        background: answerState === 'correct' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        boxShadow: answerState === 'correct' ? '0 0 15px rgba(34, 197, 94, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
                    }}>
                    {answerState === 'correct' ? 
                        <CheckCircle className="w-5 h-5 mr-2 text-green-400"/> : 
                        <XCircle className="w-5 h-5 mr-2 text-red-400"/>}
                    <span className="font-semibold">{answerState === 'correct' ? 'Correct! (+10 XP, +2 Sovereigns)' : 'Incorrect!'}</span>
                </div>
            )}
        </div>
    );
};