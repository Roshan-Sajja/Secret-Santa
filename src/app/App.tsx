import { useState } from 'react';
import { Users, ShieldBan } from 'lucide-react';
import { motion } from 'motion/react';
import { Participant, Exclusion, GenerationResult } from './types';
import { SAMPLE_PARTICIPANTS } from './constants';
import { generatePairings } from './utils/pairing';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ParticipantList from './components/ParticipantList';
import ParticipantForm from './components/ParticipantForm';
import ExclusionList from './components/ExclusionList';
import ExclusionForm from './components/ExclusionForm';
import FeasibilityIndicator from './components/FeasibilityIndicator';
import ActionControls from './components/ActionControls';
import ResultsDisplay from './components/ResultsDisplay';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [result, setResult] = useState<GenerationResult | null>(null);

  // Add participant
  const handleAddParticipant = (name: string, email: string) => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name,
      email,
    };
    setParticipants([...participants, newParticipant]);
    setResult(null);
  };

  // Remove participant
  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
    setExclusions(exclusions.filter(e => e.giverId !== id && e.receiverId !== id));
    setResult(null);
  };

  // Load sample data
  const handleLoadSample = () => {
    const sampleParticipants: Participant[] = SAMPLE_PARTICIPANTS.map(p => ({
      ...p,
      id: crypto.randomUUID(),
    }));
    setParticipants(sampleParticipants);
    setExclusions([]);
    setResult(null);
  };

  // Add exclusion
  const handleAddExclusion = (giverId: string, receiverId: string) => {
    const newExclusion: Exclusion = {
      id: crypto.randomUUID(),
      giverId,
      receiverId,
    };
    setExclusions([...exclusions, newExclusion]);
    setResult(null);
  };

  // Remove exclusion
  const handleRemoveExclusion = (id: string) => {
    setExclusions(exclusions.filter(e => e.id !== id));
    setResult(null);
  };

  // Generate pairings
  const handleGenerate = () => {
    const generationResult = generatePairings(participants, exclusions);
    setResult(generationResult);
  };

  // Reset all
  const handleReset = () => {
    setParticipants([]);
    setExclusions([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero background gradient */}
      <div className="absolute top-16 left-0 right-0 h-80 bg-gradient-to-b from-[var(--tan)]/20 to-transparent pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <Header />

        {/* Participants Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--festive-red)]/10 flex items-center justify-center">
              <Users className="text-[var(--festive-red)] w-5 h-5" />
            </div>
            <div>
              <h2 className="text-foreground">Participants</h2>
              {participants.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {participants.length} {participants.length === 1 ? 'person' : 'people'} added
                </span>
              )}
            </div>
          </div>
          
          <ParticipantList 
            participants={participants} 
            onRemove={handleRemoveParticipant} 
          />

          <ParticipantForm
            participants={participants}
            onAdd={handleAddParticipant}
            onLoadSample={handleLoadSample}
          />
        </motion.section>

        {/* Exclusions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--olive-dark)]/10 flex items-center justify-center">
              <ShieldBan className="text-[var(--olive-dark)] w-5 h-5" />
            </div>
            <div>
              <h2 className="text-foreground">Exclusion Rules</h2>
              <span className="text-sm text-muted-foreground">
                {exclusions.length > 0 
                  ? `${exclusions.length} ${exclusions.length === 1 ? 'rule' : 'rules'} set`
                  : 'Prevent specific pairings'
                }
              </span>
            </div>
          </div>
          
          <ExclusionList
            exclusions={exclusions}
            participants={participants}
            onRemove={handleRemoveExclusion}
          />

          <ExclusionForm
            participants={participants}
            exclusions={exclusions}
            onAdd={handleAddExclusion}
          />
        </motion.section>

        <FeasibilityIndicator 
          participants={participants} 
          exclusions={exclusions} 
        />

        <ActionControls
          onGenerate={handleGenerate}
          onReset={handleReset}
          canGenerate={participants.length >= 2}
        />

        <ResultsDisplay result={result} />
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border text-center"
        >
          <p className="text-sm text-muted-foreground">
            Made with warmth for the holiday season
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
