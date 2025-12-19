import { Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exclusion, Participant } from '../types';

interface ExclusionListProps {
  exclusions: Exclusion[];
  participants: Participant[];
  onRemove: (id: string) => void;
}

export default function ExclusionList({ exclusions, participants, onRemove }: ExclusionListProps) {
  return (
    // Quick table showing every exclusion currently active
    <AnimatePresence mode="wait">
      {exclusions.length > 0 && (
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
                  Giver
                </th>
                <th className="px-6 py-4 text-center text-sm text-muted-foreground font-medium w-16">
                  
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium">
                  Cannot Give To
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium w-20">
                  
                </th>
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-border/50 last:border-0 transition-colors hover:bg-[var(--tan)]/10 ${
                        index % 2 === 0 ? 'bg-card' : 'bg-[var(--olive-dark)]/[0.02]'
                      }`}
                    >
                      <td className="px-6 py-4 text-foreground font-medium">{giver?.name}</td>
                      <td className="px-6 py-4 text-center">
                        <ArrowRight className="w-4 h-4 text-[var(--festive-red)] mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-foreground font-medium">{receiver?.name}</td>
                      <td className="px-6 py-4">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
