import { useState } from 'react';
import { AlertCircle, Ban, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exclusion, Participant } from '../types';
import RecipientAvailability from './RecipientAvailability';

interface ExclusionFormProps {
  participants: Participant[];
  exclusions: Exclusion[];
  onAdd: (giverId: string, receiverId: string) => void;
  onRemove: (id: string) => void;
}

export default function ExclusionForm({ participants, exclusions, onAdd, onRemove }: ExclusionFormProps) {
  const [selectedGiver, setSelectedGiver] = useState('');
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [exclusionError, setExclusionError] = useState('');

  const toggleReceiver = (receiverId: string) => {
    setSelectedReceivers(prev =>
      prev.includes(receiverId)
        ? prev.filter(id => id !== receiverId)
        : [...prev, receiverId]
    );
    setExclusionError('');
  };

  const handleAddExclusion = () => {
    setExclusionError('');

    if (!selectedGiver) {
      setExclusionError('Please choose who is giving');
      return;
    }

    if (selectedReceivers.length === 0) {
      setExclusionError('Select at least one person to exclude');
      return;
    }

    const newReceivers = selectedReceivers.filter(
      receiverId =>
        receiverId !== selectedGiver &&
        !exclusions.some(e => e.giverId === selectedGiver && e.receiverId === receiverId)
    );

    if (newReceivers.length === 0) {
      setExclusionError('All selected exclusions already exist');
      return;
    }

    newReceivers.forEach(receiverId => onAdd(selectedGiver, receiverId));
    setSelectedGiver('');
    setSelectedReceivers([]);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
        <h3 className="text-foreground font-semibold">
          {exclusions.length > 0 ? 'Add/Remove rules' : 'Add rules'}
        </h3>
        <p className="text-sm text-muted-foreground">Manage active rules in one place</p>
        </div>
        <span className="text-xs text-muted-foreground">{exclusions.length} total</span>
      </div>

      <AnimatePresence mode="wait">
        {exclusions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[var(--olive-dark)]/5">
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground font-medium">Giver</th>
                    <th className="px-4 py-3 w-10" />
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground font-medium">Cannot give to</th>
                    <th className="px-4 py-3 w-14" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {exclusions.map((exclusion, index) => {
                      const giver = participants.find(p => p.id === exclusion.giverId);
                      const receiver = participants.find(p => p.id === exclusion.receiverId);
                      return (
                        <motion.tr
                          key={exclusion.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.15 }}
                          className={`border-b border-border/50 last:border-0 ${
                            index % 2 === 0 ? 'bg-card' : 'bg-[var(--olive-dark)]/[0.02]'
                          }`}
                        >
                          <td className="px-4 py-3 text-foreground font-medium">{giver?.name}</td>
                          <td className="px-4 py-3 text-center">
                            <ArrowRight className="w-4 h-4 text-[var(--festive-red)] mx-auto" />
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">{receiver?.name}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onRemove(exclusion.id)}
                              className="text-muted-foreground hover:text-[var(--festive-red)] p-2 rounded-lg hover:bg-[var(--festive-red)]/10 transition-all"
                              aria-label="Remove exclusion"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {exclusions.length === 0 && (
        <div className="mb-5 rounded-xl border border-dashed border-border/80 p-4 text-sm text-muted-foreground bg-muted/30">
          No exclusions yet. Select a giver below and choose who they cannot give to.
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm text-foreground mb-2 font-medium">Giver</label>
        <select
          value={selectedGiver}
          onChange={(e) => {
            setSelectedGiver(e.target.value);
            setExclusionError('');
            setSelectedReceivers([]);
          }}
          className="w-full px-4 py-3 border border-border rounded-xl bg-input-background transition-all focus:outline-none focus:ring-2 focus:ring-[var(--festive-red)]/20 focus:border-[var(--festive-red)] hover:border-[var(--olive-muted)] appearance-none cursor-pointer"
          disabled={participants.length < 3}
        >
          <option value="">Select giver</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {selectedGiver ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-foreground font-medium">People they cannot give to</label>
            <span className="text-xs text-muted-foreground">
              {selectedReceivers.length} selected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {participants
              .filter(p => p.id !== selectedGiver)
              .map(p => {
                const isChecked = selectedReceivers.includes(p.id);
                const alreadyExcluded = exclusions.some(
                  e => e.giverId === selectedGiver && e.receiverId === p.id
                );
                const isDisabled = alreadyExcluded;
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                      isChecked
                        ? 'border-[var(--festive-red)] bg-[var(--festive-red)]/5'
                        : 'border-border hover:border-[var(--olive-muted)]'
                    } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[var(--festive-red)]"
                      checked={isChecked}
                      onChange={() => !isDisabled && toggleReceiver(p.id)}
                      disabled={isDisabled}
                    />
                    <div className="flex-1">
                      <div className="text-foreground font-medium">{p.name}</div>
                      {alreadyExcluded && (
                        <div className="text-xs text-muted-foreground">Already excluded</div>
                      )}
                    </div>
                  </label>
                );
              })}
            {participants.filter(p => p.id !== selectedGiver).length === 0 && (
              <p className="text-sm text-muted-foreground">Add at least 2 participants to set rules.</p>
            )}
          </div>
        </div>
      ) : null}

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
        disabled={participants.length < 3}
        className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--olive-dark)] text-[var(--tan)] rounded-xl hover:bg-[var(--olive-dark)]/90 transition-all border border-[var(--olive-muted)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Ban size={18} />
        Add Exclusion
      </motion.button>

      <RecipientAvailability
        participants={participants}
        exclusions={exclusions}
        embedded
      />
    </div>
  );
}
