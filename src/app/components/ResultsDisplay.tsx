import { AlertCircle, Gift, ArrowRight, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GenerationResult } from '../types';

interface ResultsDisplayProps {
  result: GenerationResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <AnimatePresence>
      {result && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <PartyPopper className="w-6 h-6 text-[var(--festive-red)]" />
            <h2 className="text-foreground text-center">Results</h2>
            <PartyPopper className="w-6 h-6 text-[var(--festive-red)] scale-x-[-1]" />
          </div>

          {result.success ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[var(--success-bg)] border-b border-[var(--success-border)] px-6 py-4">
                <p className="text-sm text-[var(--success)] leading-relaxed flex items-start gap-2">
                  <Gift className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Success!</strong> In production, each participant would only see
                    their own assignment. This view is for demo purposes only.
                  </span>
                </p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[var(--olive-dark)]/5">
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium">
                      Giver
                    </th>
                    <th className="px-6 py-4 text-center text-sm text-muted-foreground font-medium w-20">
                      
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground font-medium">
                      Gives To
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.pairings.map((pairing, index) => (
                    <motion.tr
                      key={pairing.giver.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`border-b border-border/50 last:border-0 ${
                        index % 2 === 0 ? 'bg-card' : 'bg-[var(--olive-dark)]/[0.02]'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--tan)]/30 flex items-center justify-center text-sm font-semibold text-[var(--olive-dark)]">
                            {pairing.giver.name.charAt(0)}
                          </div>
                          <span className="text-foreground font-medium">{pairing.giver.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--festive-red)]/10">
                          <ArrowRight className="w-4 h-4 text-[var(--festive-red)]" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--festive-red)]/10 flex items-center justify-center">
                            <Gift className="w-4 h-4 text-[var(--festive-red)]" />
                          </div>
                          <span className="text-foreground font-medium">{pairing.receiver.name}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-2 border-[var(--error-border)] bg-[var(--error-bg)] rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--festive-red)]/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="text-[var(--festive-red)] w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[var(--festive-red)] font-semibold text-lg mb-3">{result.error}</h3>
                  <p className="text-foreground mb-3 font-medium">
                    Possible reasons:
                  </p>
                  <ul className="space-y-2 text-sm text-foreground mb-4">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[var(--festive-red)] mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground border-t border-[var(--error-border)] pt-4">
                    <strong>Suggestion:</strong> Try editing participants or removing some exclusions, then generate again.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
