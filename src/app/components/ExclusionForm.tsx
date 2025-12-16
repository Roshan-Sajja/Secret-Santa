import { useState } from 'react';
import { AlertCircle, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exclusion, Participant } from '../types';

interface ExclusionFormProps {
  participants: Participant[];
  exclusions: Exclusion[];
  onAdd: (giverId: string, receiverId: string) => void;
}

export default function ExclusionForm({ participants, exclusions, onAdd }: ExclusionFormProps) {
  const [selectedGiver, setSelectedGiver] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [exclusionError, setExclusionError] = useState('');

  const handleAddExclusion = () => {
    setExclusionError('');

    if (!selectedGiver || !selectedReceiver) {
      setExclusionError('Please select both giver and receiver');
      return;
    }

    if (selectedGiver === selectedReceiver) {
      setExclusionError('Cannot exclude self-pairing (already prevented)');
      return;
    }

    const isDuplicate = exclusions.some(
      e => e.giverId === selectedGiver && e.receiverId === selectedReceiver
    );

    if (isDuplicate) {
      setExclusionError('This exclusion already exists');
      return;
    }

    onAdd(selectedGiver, selectedReceiver);
    setSelectedGiver('');
    setSelectedReceiver('');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-foreground mb-2 font-medium">Giver</label>
          <select
            value={selectedGiver}
            onChange={(e) => {
              setSelectedGiver(e.target.value);
              setExclusionError('');
            }}
            className="w-full px-4 py-3 border border-border rounded-xl bg-input-background transition-all focus:outline-none focus:ring-2 focus:ring-[var(--festive-red)]/20 focus:border-[var(--festive-red)] hover:border-[var(--olive-muted)] appearance-none cursor-pointer"
            disabled={participants.length < 2}
          >
            <option value="">Select giver</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-foreground mb-2 font-medium">Cannot Give To</label>
          <select
            value={selectedReceiver}
            onChange={(e) => {
              setSelectedReceiver(e.target.value);
              setExclusionError('');
            }}
            className="w-full px-4 py-3 border border-border rounded-xl bg-input-background transition-all focus:outline-none focus:ring-2 focus:ring-[var(--festive-red)]/20 focus:border-[var(--festive-red)] hover:border-[var(--olive-muted)] appearance-none cursor-pointer"
            disabled={participants.length < 2}
          >
            <option value="">Select receiver</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AnimatePresence>
        {exclusionError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[var(--festive-red)] text-sm mb-4 flex items-center gap-1.5"
          >
            <AlertCircle size={14} />
            {exclusionError}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleAddExclusion}
        disabled={participants.length < 2}
        className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--olive-dark)] text-[var(--tan)] rounded-xl hover:bg-[var(--olive-dark)]/90 transition-all border border-[var(--olive-muted)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Ban size={18} />
        Add Exclusion
      </motion.button>
    </div>
  );
}
