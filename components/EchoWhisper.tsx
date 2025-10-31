import React from 'react';
import { EchoWhisper as EchoWhisperType } from '../types';

export const EchoWhisper: React.FC<EchoWhisperType> = ({ text, x, y }) => {
    // Adjust position to keep it within viewport
    const adjustedX = Math.min(x, window.innerWidth - 210); // 200px width + 10px padding
    const adjustedY = Math.max(y, 10);

    return (
        <div 
            className="echo-whisper"
            style={{
                left: `${adjustedX}px`,
                top: `${adjustedY}px`,
            }}
        >
            {text}
        </div>
    );
};
