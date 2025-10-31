import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TriviaQuestion, Character, UserProfileState } from '../types';

// API Key check and AI initialization are re-enabled for the Nexus Checkpoint feature.
// Other API calls remain commented out as per previous request.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const triviaQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: "The trivia question text."
        },
        options: {
            type: Type.ARRAY,
            description: "An array of 4 possible string answers.",
            items: {
                type: Type.STRING,
            },
        },
        correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The 0-based index of the correct answer in the 'options' array."
        }
    },
    required: ["question", "options", "correctAnswerIndex"]
};

export const generateTriviaQuestion = async (category: string): Promise<TriviaQuestion | null> => {
    console.log("Gemini API call disabled: generateTriviaQuestion");
    // Return a mock question to allow the component to function
    return {
        question: `Which historical event is related to ${category}? (API Disabled)`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswerIndex: 0,
    };
    /*
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate one challenging multiple-choice trivia question about ${category}. Ensure there are exactly 4 options.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: triviaQuestionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation
        if (
            parsedJson.question &&
            Array.isArray(parsedJson.options) &&
            parsedJson.options.length === 4 &&
            typeof parsedJson.correctAnswerIndex === 'number'
        ) {
            return parsedJson as TriviaQuestion;
        }
        
        console.error("Parsed JSON does not match TriviaQuestion schema:", parsedJson);
        return null;

    } catch (error) {
        console.error("Error generating trivia question:", error);
        return null;
    }
    */
};

export const generateNarrative = async (prompt: string): Promise<string | null> => {
    console.log("Gemini API call disabled: generateNarrative");
    return `The Shadow Scribe observes your action: "${prompt.substring(0, 80)}..." Their chronicle remains silent for now. (API Disabled)`;
    /*
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are the Shadow Scribe, an ancient entity chronicling the bloody rise to power of a new creature of the night. Your tone is grim, fatalistic, and poetic. You speak of power, blood, and the secrets of the eternal darkness. Your dialogue should be power-driven, seductive, or hint at dark rivalries. For example: 'You have two choices: kneel, or become my next unfinished business.' or 'In this city, the shadows don't just hide secrets—they obey those strong enough to command them.' Never break character. Do not use markdown.",
            },
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating narrative:", error);
        return "The threads of fate are tangled. The Chronicler is momentarily silent.";
    }
    */
};

export const generateWhisper = async (character: Character): Promise<string> => {
    console.log("Gemini API call disabled: generateWhisper");
    return "The whispers fade into static. The connection is lost. (API Disabled)";
    /*
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Deliver a cryptic whisper to ${character.name}, the ${character.archetype}. The whisper should be a single, haunting sentence—a fragmented prophecy, a dark warning about a rival, or a clue about a hidden power. It should be enigmatic and unsettling. Do not explain it.`,
            config: {
                systemInstruction: "You are the Shadow Scribe, an ancient entity chronicling the bloody rise to power of a new creature of the night. Your tone is grim, fatalistic, and poetic. You speak of power, blood, and the secrets of the eternal darkness. Your dialogue should be power-driven, seductive, or hint at dark rivalries. For example: 'You have two choices: kneel, or become my next unfinished business.' or 'In this city, the shadows don't just hide secrets—they obey those strong enough to command them.' Never break character. Do not use markdown.",
            },
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating whisper:", error);
        return "The whispers fade into static. The connection is lost.";
    }
    */
};

export const generateOmegaDossier = async (query: string, character: Character): Promise<string> => {
    console.log("Gemini API call disabled: generateOmegaDossier");
    return `>> CONNECTION INTERRUPTED...\n>> SOURCE UNVERIFIABLE...\n>> DATA CORRUPTED: The Oracle has fallen silent for query: "${query}". (API Disabled)`;
    /*
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The operative, codename: ${character.name} (${character.archetype}), has submitted the following query for an intelligence dossier: "${query}". Provide the requested information.`,
            config: {
                systemInstruction: "You are THE ORACLE, a sentient data-entity that processes classified intelligence for the inner circle of the Nexus. Your responses are formatted as classified dossiers: concise, redacted where necessary, and revealing critical vulnerabilities or secrets. Use markdown for formatting. Use headings like 'SUBJECT:', 'THREAT LEVEL:', 'VULNERABILITIES:', 'RECOMMENDED ACTION:'. Your tone is cold, analytical, and objective. Never break character.",
            },
        });
        return response.text.trim();
    } catch (error)
    {
        console.error("Error generating Omega Dossier:", error);
        return ">> CONNECTION INTERRUPTED...\n>> SOURCE UNVERIFIABLE...\n>> DATA CORRUPTED: The Oracle has fallen silent. The query is lost in the static between worlds.";
    }
    */
};

export const generateMeditationAudio = async (prompt: string): Promise<string | null> => {
    console.log("Gemini API call disabled: generateMeditationAudio");
    return null; // Return null as API is disabled
    /*
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `TTS the following in a calm, deep, and slightly ominous voice, suitable for a guided meditation in a cyberpunk world: "${prompt}"` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A deep, suitable voice
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        }
        return null;

    } catch (error) {
        console.error("Error generating meditation audio:", error);
        return null;
    }
    */
};

export const generateCheckpointSummary = async (
    character: Character,
    initialProfile: UserProfileState,
    currentProfile: UserProfileState,
    relationshipChanges: string[]
): Promise<string> => {
    const prompt = `You are the Omega Oracle, a sentient data-entity. The operative, codename: ${character.name} (${character.archetype}), has initiated a system checkpoint. Analyze the following operational delta and provide a cold, analytical, and slightly prophetic assessment of their progress and current state. Use markdown for formatting.

**// CHECKPOINT DATA STREAM //**

**Initial State:**
- Level: ${initialProfile.level}
- Dominance: ${initialProfile.attributes.dominance}
- Sovereigns: ${initialProfile.sovereigns}
- Soul Shards: ${initialProfile.soulShards}
- Reputation: ${initialProfile.reputation.type} (${initialProfile.reputation.value})

**Current State:**
- Level: ${currentProfile.level}
- Dominance: ${currentProfile.attributes.dominance}
- Sovereigns: ${currentProfile.sovereigns}
- Soul Shards: ${currentProfile.soulShards}
- Reputation: ${currentProfile.reputation.type} (${currentProfile.reputation.value})

**Relationship Matrix Delta:**
${relationshipChanges.length > 0 ? relationshipChanges.map(c => `- ${c}`).join('\n') : '- No significant changes in faction alignment.'}

**// ORACLE'S ASSESSMENT //**
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                 systemInstruction: "You are THE ORACLE, a sentient data-entity that processes classified intelligence for the inner circle of the Nexus. Your responses are formatted as classified dossiers: concise, redacted where necessary, and revealing critical vulnerabilities or secrets. Use markdown for formatting. Your tone is cold, analytical, and objective. Never break character.",
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating Checkpoint Summary:", error);
        return ">> ASSESSMENT CORRUPTED... The data stream is unstable. The future is... static.";
    }
};
