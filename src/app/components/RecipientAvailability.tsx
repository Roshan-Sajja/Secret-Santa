import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Check, Gift, Users, X } from 'lucide-react';
import { getFeasibility } from '../utils/pairing';
import { Exclusion, Participant } from '../types';

interface RecipientAvailabilityProps {
  participants: Participant[];
  exclusions: Exclusion[];
  embedded?: boolean;
}

export default function RecipientAvailability({ participants, exclusions, embedded = false }: RecipientAvailabilityProps) {
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

  if (embedded) {
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

  return (
    <AnimatePresence>
      {participants.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-[var(--olive-dark)]/5">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--festive-red)]/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-[var(--festive-red)]" />
                </div>
                <div>
                <h3 className="text-foreground font-semibold">Potential Gift Givers</h3>
                <p className="text-sm text-muted-foreground">Who can give to each person</p>
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

            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="px-6 py-3 text-left text-sm text-muted-foreground font-medium">
                      Recipient
                    </th>
                  <th className="px-6 py-3 text-left text-sm text-muted-foreground font-medium">
                      Potential Givers
                  </th>
                  <th className="px-6 py-3 text-right text-sm text-muted-foreground font-medium">
                      Count
                  </th>
                </tr>
              </thead>
              <tbody>
                  <AnimatePresence mode="popLayout">
                  {availability.map((row, index) => {
                      const percentage = row.maxPossible > 0 
                        ? Math.round((row.giverCount / row.maxPossible) * 100) 
                        : 0;
                      const isCritical = row.giverCount === 0;
                      const isWarning = row.giverCount === 1;
                      
                    return (
                      <motion.tr
                        key={row.participant.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                          className={`border-b border-border/50 last:border-0 transition-colors ${
                            isCritical 
                              ? 'bg-[var(--error-bg)]' 
                              : isWarning 
                              ? 'bg-[var(--warning-bg)]/50' 
                              : index % 2 === 0 
                              ? 'bg-card' 
                              : 'bg-[var(--tan)]/5'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--festive-red)]/10 flex items-center justify-center">
                                <Gift className="w-4 h-4 text-[var(--festive-red)]" />
                              </div>
                              <span className="text-foreground font-medium">{row.participant.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                  className={`h-full rounded-full ${
                                    isCritical 
                                      ? 'bg-[var(--error)]' 
                                      : isWarning 
                                      ? 'bg-[var(--warning)]' 
                                      : 'bg-[var(--success)]'
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-10 text-right">
                                {percentage}%
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-2">
                              {participants.map(giver => {
                                if (giver.id === row.participant.id) return null;
                                const canGive = matrix.get(row.participant.id)?.get(giver.id) ?? false;
                                return (
                                  <motion.div
                                    key={giver.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
                                      canGive 
                                        ? 'bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30' 
                                        : 'bg-[var(--error)]/10 text-[var(--error)]/60 border border-[var(--error)]/20'
                                    }`}
                                    title={`${giver.name} ${canGive ? 'can' : 'cannot'} give to ${row.participant.name}`}
                                  >
                                    {canGive ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <X className="w-3 h-3" />
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <motion.div 
                              key={row.giverCount}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center justify-end gap-2 text-sm font-semibold"
                            >
                              <span
                                className={`flex items-center gap-1.5 ${
                                  isCritical
                                    ? 'text-[var(--error)]'
                                    : isWarning
                                    ? 'text-[var(--warning)]'
                                    : 'text-[var(--success)]'
                                }`}
                              >
                                {row.giverCount} / {row.maxPossible}
                            </span>
                              {(isCritical || isWarning) && (
                                <AlertTriangle
                                  className={`w-4 h-4 ${
                                    isCritical
                                      ? 'text-[var(--error)]'
                                      : 'text-[var(--warning)]'
                                  }`}
                                />
                              )}
                            </motion.div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            </div>

            {participants.length >= 2 && (
              <div className="px-6 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                    <span>Can give to them</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[var(--error)]/40" />
                    <span>Cannot give to them</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>{participants.length} participants</span>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
