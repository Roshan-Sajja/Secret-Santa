import { useState } from 'react';
import { AlertCircle, UserPlus, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateEmail, isEmailDuplicate } from '../utils/validation';
import { Participant } from '../types';

interface ParticipantFormProps {
  participants: Participant[];
  onAdd: (name: string, email: string) => void;
  onLoadSample: () => void;
}

export default function ParticipantForm({ participants, onAdd, onLoadSample }: ParticipantFormProps) {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

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
  );
}
