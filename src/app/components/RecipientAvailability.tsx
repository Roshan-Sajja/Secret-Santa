import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Check, Gift, Users, X } from 'lucide-react';
import { getFeasibility } from '../utils/pairing';
import { Exclusion, Participant } from '../types';

interface RecipientAvailabilityProps {
  participants: Participant[];
  exclusions: Exclusion[];
}

export default function RecipientAvailability({ participants, exclusions}: RecipientAvailabilityProps) {
  const { availability, matrix } = useMemo(() => {
    if (participants.length === 0) {
      return { availability: [], matrix: new Map<string, Map<string, boolean>>() };
    }

  const exclusionMap = new Map<string, Set<string>>();
  participants.forEach(p => {
    exclusionMap.set(p.id, new Set([p.id]));
  });

  exclusions.forEach(exclusion => {
    const set = exclusionMap.get(exclusion.giverId);
    if (set) {
      set.add(exclusion.receiverId);
    }
  });

    const availability = participants.map(receiver => {
      let giverCount = 0;
      participants.forEach(giver => {
        if (giver.id === receiver.id) return;
        const excluded = exclusionMap.get(giver.id) ?? new Set<string>();
        if (!excluded.has(receiver.id)) {
          giverCount++;
        }
      });
      const maxPossible = participants.length - 1;
      return { participant: receiver, giverCount, maxPossible };
    });

    const matrix = new Map<string, Map<string, boolean>>();
    participants.forEach(receiver => {
      const giverMap = new Map<string, boolean>();
      participants.forEach(giver => {
        if (giver.id === receiver.id) return;
        const excluded = exclusionMap.get(giver.id) ?? new Set<string>();
        giverMap.set(giver.id, !excluded.has(receiver.id));
      });
      matrix.set(receiver.id, giverMap);
    });

    return { availability, matrix };
  }, [participants, exclusions]);
  
  const feasibility = useMemo(
    () => getFeasibility(participants, exclusions),
    [participants, exclusions]
  );

  if (participants.length === 0) return null;

    return (
      <div className="mt-6 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--festive-red)]/10 flex items-center justify-center">
              <Gift className="w-4 h-4 text-[var(--festive-red)]" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold">Potential gift givers</h4>
              <p className="text-xs text-muted-foreground">Who can give to whom (after exclusions)</p>
            </div>
          </div>
          {feasibility !== 'none' && (
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                feasibility === 'solvable'
                  ? 'text-[var(--success)]'
                  : 'text-[var(--warning)]'
              }`}
            >
              {feasibility === 'solvable' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>{feasibility === 'solvable' ? 'Likely Solvable' : 'Possibly Unsolvable'}</span>
            </div>
          )}
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-[var(--olive-dark)]/5">
                <th className="px-4 py-3 text-left text-sm text-muted-foreground font-medium">
                  Recipient
                </th>
                <th className="px-4 py-3 text-right text-sm text-muted-foreground font-medium">
                  Available givers
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {availability.map((row, index) => {
                  const isCritical = row.giverCount === 0;
                  const isWarning = row.giverCount === 1;
                  return (
                    <motion.tr
                      key={row.participant.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-border/50 last:border-0 ${
                        index % 2 === 0 ? 'bg-card' : 'bg-[var(--tan)]/10'
                      }`}
                    >
                      <td className="px-4 py-3 text-foreground font-medium">{row.participant.name}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            isCritical
                              ? 'text-[var(--error)]'
                              : isWarning
                              ? 'text-[var(--warning)]'
                              : 'text-[var(--success)]'
                          }`}
                        >
                          {row.giverCount} / {row.maxPossible}
                          {(isCritical || isWarning) && <AlertTriangle className="w-4 h-4" />}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
