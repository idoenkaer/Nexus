
import React, { useState, useRef, useEffect } from 'react';
import { Hammer, Calculator, QrCode, Flashlight, HardDrive, Wifi, Battery, BookUser, FlaskConical, Terminal, Loader2, Database } from 'lucide-react';
import { Section } from './Section';
import { Card } from './Card';
import { SharedAppProps } from '../types';
import { AlchemistLab } from './AlchemistLab';
import { OmegaOracle } from './OmegaOracle';
import { Grimoire } from './Grimoire';
import { lore as allLore } from '../data/lore';
import { NexusCheckpoint } from './NexusCheckpoint';
import { InitialStateType } from '../App';

// A simple calculator component
const CalculatorComponent: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [history, setHistory] = useState('');

    const handleButtonClick = (value: string) => {
        if (value === 'C') {
            setDisplay('0');
            setHistory('');
        } else if (value === '=') {
            try {
                // In a real app, use a safe evaluation library, not eval()
                const result = eval(history + display);
                setHistory(history + display + '=');
                setDisplay(String(result));
            } catch (error) {
                setDisplay('Error');
                setHistory('');
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            setHistory(display + value);
            setDisplay('0');
        }
        else {
            setDisplay(prev => (prev === '0' ? value : prev + value));
        }
    };

    const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','C','=','+'];

    return (
        <div className="p-2 bg-gray-900 rounded-lg">
            <div className="bg-gray-800 text-right p-2 rounded-md mb-2">
                <div className="text-xs text-gray-400 h-4">{history}</div>
                <div className="text-2xl font-bold">{display}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {buttons.map(btn => (
                    <button key={btn} onClick={() => handleButtonClick(btn)} className="p-3 bg-gray-700 rounded-md hover:bg-gray-600 text-lg font-semibold transition-colors aspect-square">
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

const GlyphDecoder: React.FC<Pick<SharedAppProps, 'addCurrency' | 'addSoulShards' | 'addLore' | 'collectedLoreIds'>> = ({ addCurrency, addSoulShards, addLore, collectedLoreIds }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setScanResult("ERROR: Camera access denied or unavailable.");
                setIsScanning(false);
            }
        };

        if (isScanning) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [isScanning]);
    
    const handleScan = () => {
        setIsLoading(true);
        setScanResult(null);
        
        // Simulate scanning process
        setTimeout(() => {
            const outcome = Math.random();
            let resultMessage = "";

            if (outcome < 0.1) { // 10% rare
                addSoulShards(1);
                resultMessage = "DECODED: +1 Soul Shard. A potent find.";
            } else if (outcome < 0.4) { // 30% uncommon
                const availableLore = allLore.filter(l => !collectedLoreIds.has(l.id));
                if (availableLore.length > 0) {
                    const newLore = availableLore[Math.floor(Math.random() * availableLore.length)];
                    addLore(newLore.id);
                    resultMessage = `DECODED: Lore Acquired - "${newLore.title}".`;
                } else {
                     const sovereigns = Math.floor(Math.random() * 16) + 10; // 10-25
                    addCurrency(0, sovereigns);
                    resultMessage = `DECODED: Encrypted data packet resolves to ${sovereigns} Sovereigns.`;
                }
            } else { // 60% common
                const sovereigns = Math.floor(Math.random() * 16) + 10; // 10-25
                addCurrency(0, sovereigns);
                resultMessage = `DECODED: Encrypted data packet resolves to ${sovereigns} Sovereigns.`;
            }

            setScanResult(resultMessage);
            setIsLoading(false);
        }, 1500);
    };

    if (!isScanning) {
        return (
            <div className="text-center">
                <p className="text-gray-400 mb-4">Focus the decoder on an arcane glyph to analyze its data stream. Results are unpredictable.</p>
                <button onClick={() => setIsScanning(true)} className="px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-500 transition-colors hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    Activate Scanner
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-sm h-64 bg-black rounded-lg mb-4 relative overflow-hidden flex items-center justify-center glyph-scanner-view">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {isLoading && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-red-400 mb-2"/>
                        <p className="text-red-300 font-mono">ANALYZING...</p>
                    </div>
                )}
            </div>

            {scanResult ? (
                 <div className="text-center w-full">
                    <p className="p-3 bg-gray-900/50 rounded-md text-purple-300 font-semibold animate-pop-in">{scanResult}</p>
                    <button onClick={() => { setScanResult(null); setIsScanning(false); }} className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-500 transition-colors">
                        Deactivate Scanner
                    </button>
                </div>
            ) : (
                <button onClick={handleScan} disabled={isLoading} className="px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-500 transition-colors disabled:bg-gray-600">
                    {isLoading ? 'Scanning...' : 'Capture Glyph'}
                </button>
            )}
        </div>
    );
};

interface UtilitySuiteProps extends SharedAppProps {
    initialState: InitialStateType | null;
    setInitialState: (state: InitialStateType) => void;
}


export const UtilitySuite: React.FC<UtilitySuiteProps> = (props) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const renderTool = () => {
      switch (activeTool) {
        case 'ledger':
            return (
                <div className="mt-4 animate-pop-in">
                  <Card title="The Ledger" icon={Calculator}>
                      <CalculatorComponent />
                  </Card>
                </div>
            );
        case 'crucible':
            return (
                <div className="mt-4 animate-pop-in">
                    <Card title="Alchemical Crucible" icon={FlaskConical}>
                        <AlchemistLab {...props} />
                    </Card>
                </div>
            );
        case 'omega-oracle':
            return (
                <div className="mt-4 animate-pop-in">
                    <Card title="Omega Oracle" icon={Terminal}>
                        <OmegaOracle {...props} />
                    </Card>
                </div>  
            );
        case 'grimoire':
            return (
                <div className="mt-4 animate-pop-in">
                    <Card title="The Grimoire" icon={BookUser}>
                        <Grimoire {...props} />
                    </Card>
                </div>
            );
        case 'glyph-decoder':
            return (
                 <div className="mt-4 animate-pop-in">
                    <Card title="Glyph Decoder" icon={QrCode}>
                        <GlyphDecoder {...props} />
                    </Card>
                </div>
            );
        case 'nexus-checkpoint':
            return (
                 <div className="mt-4 animate-pop-in">
                    <Card title="Nexus Checkpoint" icon={Database}>
                        <NexusCheckpoint {...props} />
                    </Card>
                </div>
            );
        default:
            return null;
      }
  }
  
  return (
    <div className="space-y-8">
      <Section title="The Alchemist's Forge" icon={Hammer}>
        <p className="text-gray-400 mb-6 italic">"Here, forbidden instruments of power are yours to command. Calculate costs, brew volatile concoctions, and impose your will upon the mundane world."</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card title="Omega Oracle" subtitle="Peer into the data stream" icon={Terminal} onClick={() => setActiveTool(activeTool === 'omega-oracle' ? null : 'omega-oracle')} />
            <Card title="Alchemical Crucible" subtitle="Brew volatile concoctions" icon={FlaskConical} onClick={() => setActiveTool(activeTool === 'crucible' ? null : 'crucible')} />
            <Card title="The Grimoire" subtitle="Access your collected lore" icon={BookUser} onClick={() => setActiveTool(activeTool === 'grimoire' ? null : 'grimoire')} />
            <Card title="Nexus Checkpoint" subtitle="Aggregate semantic data" icon={Database} onClick={() => setActiveTool(activeTool === 'nexus-checkpoint' ? null : 'nexus-checkpoint')} />
            <Card title="The Ledger" subtitle="Calculate your dark tithes" icon={Calculator} onClick={() => setActiveTool(activeTool === 'ledger' ? null : 'ledger')} />
            <Card title="Glyph Decoder" subtitle="Scan arcane markings" icon={QrCode} onClick={() => setActiveTool(activeTool === 'glyph-decoder' ? null : 'glyph-decoder')} />
            <Card title="Stygian Torch" subtitle="Pierce the oppressive dark" icon={Flashlight} className="opacity-50 hover:-translate-y-0 hover:border-gray-700/50 hover:shadow-lg" />
            <Card title="Core Charge" subtitle="Assess the vessel's anima" icon={Battery} className="opacity-50 hover:-translate-y-0 hover:border-gray-700/50 hover:shadow-lg" />
        </div>
        {renderTool()}
      </Section>
    </div>
  );
};