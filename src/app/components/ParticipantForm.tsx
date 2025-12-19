import { useState } from 'react';
import { AlertCircle, UserPlus, Database, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateEmail, isEmailDuplicate } from '../utils/validation';
import { Participant } from '../types';

interface ParticipantFormProps {
  participants: Participant[];
  onAdd: (name: string, email: string) => void;
  onLoadSample: () => void;
  onRemove: (id: string) => void;
}

export default function ParticipantForm({ participants, onAdd, onLoadSample, onRemove }: ParticipantFormProps) {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Basic guardrails before adding someone to the table
  const handleAddParticipant = () => {
    setNameError('');
    setEmailError('');

    if (!newName.trim()) {
      setNameError('Name is required');
      return;
    }

    if (!newEmail.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError('Invalid email format');
      return;
    }

    if (isEmailDuplicate(newEmail, participants)) {
      setEmailError('Email already exists');
      return;
    }

    onAdd(newName.trim(), newEmail.trim());
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-foreground font-semibold">
            {participants.length > 0 ? 'Add/Remove members' : 'Add members'}
          </h3>
          <p className="text-sm text-muted-foreground">Manage everyone in one place</p>
        </div>
        <span className="text-xs text-muted-foreground">{participants.length} total</span>
      </div>

      <div className="mb-5">
        <AnimatePresence mode="wait">
          {participants.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-border rounded-xl overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[var(--olive-dark)]/5">
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground font-medium">Email</th>
                    <th className="px-4 py-3 w-14" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {participants.map((participant, index) => (
                      <motion.tr
                        key={participant.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                        className={`border-b border-border/50 last:border-0 ${
                          index % 2 === 0 ? 'bg-card' : 'bg-[var(--olive-dark)]/[0.02]'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--festive-red)]/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-[var(--festive-red)]" />
                            </div>
                            <span className="text-foreground font-medium">{participant.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{participant.email}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onRemove(participant.id)}
                            className="text-muted-foreground hover:text-[var(--festive-red)] p-2 rounded-lg hover:bg-[var(--festive-red)]/10 transition-all"
                            aria-label="Remove participant"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-dashed border-border/80 p-4 text-sm text-muted-foreground bg-muted/30"
            >
              No participants yet. Add someone below or load sample data.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-border/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm text-foreground mb-2 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNameError('');
              }}
              className={`w-full px-4 py-3 border rounded-xl bg-input-background transition-all focus:outline-none focus:ring-2 focus:ring-[var(--festive-red)]/20 focus:border-[var(--festive-red)] ${
                nameError ? 'border-[var(--festive-red)]' : 'border-border hover:border-[var(--olive-muted)]'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
            />
            <AnimatePresence>
              {nameError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[var(--festive-red)] text-sm mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle size={14} />
                  {nameError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError('');
              }}
              className={`w-full px-4 py-3 border rounded-xl bg-input-background transition-all focus:outline-none focus:ring-2 focus:ring-[var(--festive-red)]/20 focus:border-[var(--festive-red)] ${
                emailError ? 'border-[var(--festive-red)]' : 'border-border hover:border-[var(--olive-muted)]'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
            />
            <AnimatePresence>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[var(--festive-red)] text-sm mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle size={14} />
                  {emailError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAddParticipant}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--festive-red)] text-white rounded-xl hover:bg-[var(--festive-red)]/90 transition-all shadow-md hover:shadow-lg"
          >
            <UserPlus size={18} />
            Add Participant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--olive-dark)] text-[var(--tan)] rounded-xl hover:bg-[var(--olive-dark)]/90 transition-all border border-[var(--olive-muted)]/30"
          >
            <Database size={18} />
            Load Sample Data
          </motion.button>
        </div>
      </div>
    </div>
  );
}
