import { motion } from 'motion/react';
import { Wand2, RotateCcw } from 'lucide-react';

interface ActionControlsProps {
  onGenerate: () => void;
  onReset: () => void;
  canGenerate: boolean;
}

export default function ActionControls({ onGenerate, onReset, canGenerate }: ActionControlsProps) {
  return (
    // Main CTA buttons for the flow
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-10"
    >
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: canGenerate ? 1.02 : 1 }}
          whileTap={{ scale: canGenerate ? 0.98 : 1 }}
          onClick={onGenerate}
          disabled={!canGenerate}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--festive-red)] text-white rounded-xl hover:bg-[var(--festive-red)]/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-md text-lg font-medium"
        >
          <Wand2 size={22} />
          Generate Pairings
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-4 bg-card text-foreground rounded-xl hover:bg-muted transition-all border-2 border-border"
        >
          <RotateCcw size={20} />
          Reset
        </motion.button>
      </div>
    </motion.section>
  );
}
