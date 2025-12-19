import { motion } from 'motion/react';
import { Database, UserPlus, Ban, Gift } from 'lucide-react';

const steps = [
  {
    title: 'Load data or add participants',
    description: 'Start with the sample list or add names and emails to build your group.',
    icon: Database,
    accent: 'bg-[var(--festive-red)]/10 text-[var(--festive-red)]',
  },
  {
    title: 'Add exclusions',
    description: 'Block specific pairings (partners, yourself, etc.) with quick checkboxes.',
    icon: Ban,
    accent: 'bg-[var(--olive-dark)]/10 text-[var(--olive-dark)]',
  },
  {
    title: 'Generate pairings',
    description: 'Run the matcher to see valid Secret Santa pairings and adjust if needed.',
    icon: Gift,
    accent: 'bg-[var(--tan)]/40 text-[var(--olive-dark)]',
  },
];

export default function HowItWorks() {
  return (
    // Simple onboarding section so people know the flow
    <motion.section
      id="how-it-works"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-10"
    >
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">How it works</p>
            <h3 className="text-foreground font-semibold mt-1">3 quick steps</h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-[var(--festive-red)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--olive-dark)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--tan)]" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 * index }}
                className="h-full rounded-xl border border-border/70 bg-muted/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Step {index + 1}</div>
                    <h4 className="text-foreground font-semibold leading-snug">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
