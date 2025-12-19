import { Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../types';

interface ParticipantListProps {
  participants: Participant[];
  onRemove: (id: string) => void;
}

export default function ParticipantList({ participants, onRemove }: ParticipantListProps) {
  return (
    // Only show the table once we have at least one person added
    <AnimatePresence mode="wait">
      {participants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-card border border-border rounded-xl overflow-hidden shadow-sm"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-[var(--olive-dark)]/5">
                <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium w-20">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {participants.map((participant, index) => (
                  <motion.tr
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className={`border-b border-border/50 last:border-0 transition-colors hover:bg-[var(--tan)]/10 ${
                      index % 2 === 0 ? 'bg-card' : 'bg-[var(--olive-dark)]/[0.02]'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--festive-red)]/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-[var(--festive-red)]" />
                        </div>
                        <span className="text-foreground font-medium">{participant.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {participant.email}
                    </td>
                    <td className="px-6 py-4">
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
      )}
    </AnimatePresence>
  );
}
