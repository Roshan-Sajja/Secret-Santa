import { Gift, Snowflake } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    // Animated navbar at the top of the page
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-[var(--olive-dark)] border-b border-[var(--olive-muted)]/30 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center h-16">
          {/* Brand section with gift icon and title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Gift className="text-[var(--festive-red)] w-8 h-8" />
              <Snowflake className="absolute -top-1 -right-1 text-[var(--tan)] w-4 h-4 animate-pulse" />
            </div>
            {/* App name text */}
            <span className="font-['Playfair_Display'] text-xl font-semibold text-[var(--tan)]">
              Secret Santa
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
