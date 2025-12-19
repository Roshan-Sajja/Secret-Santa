import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFeasibility } from '../utils/pairing';
import { Participant, Exclusion } from '../types';

interface FeasibilityIndicatorProps {
  participants: Participant[];
  exclusions: Exclusion[];
}

export default function FeasibilityIndicator({ participants, exclusions }: FeasibilityIndicatorProps) {
  // Lightweight status to warn if rules might be too strict
  const feasibility = getFeasibility(participants, exclusions);

  return (
    <AnimatePresence>
      {participants.length >= 2 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <div
            className={`border rounded-xl p-5 shadow-sm transition-colors ${
              feasibility === 'solvable'
                ? 'bg-[var(--success-bg)] border-[var(--success-border)]'
                : feasibility === 'warning'
                ? 'bg-[var(--warning-bg)] border-[var(--warning-border)]'
                : 'bg-muted border-border'
            }`}
          >
            <div className="flex items-start gap-4">
              {feasibility === 'solvable' && (
                <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-[var(--success)] w-5 h-5" />
                </div>
              )}
              {feasibility === 'warning' && (
                <div className="w-10 h-10 rounded-full bg-[var(--warning)]/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-[var(--warning)] w-5 h-5" />
                </div>
              )}
              <div className="flex-1">
                <h3 className={`font-semibold ${feasibility === 'solvable' ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                  {feasibility === 'solvable' && 'Likely Solvable'}
                  {feasibility === 'warning' && 'Possibly Unsolvable'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This is a heuristic based on your current exclusions
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
