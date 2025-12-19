import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    // Hero headline under the navbar
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 text-center"
    >
      <h1 className="mb-4 text-foreground">
        Create magical gift exchanges with smart pairing and customizable exclusion rules
      </h1>
    </motion.header>
  );
}
