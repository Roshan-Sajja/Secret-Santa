import { Gift, Snowflake } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-[var(--olive-dark)] border-b border-[var(--olive-muted)]/30 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Gift className="text-[var(--festive-red)] w-8 h-8" />
              <Snowflake className="absolute -top-1 -right-1 text-[var(--tan)] w-4 h-4 animate-pulse" />
            </div>
            <span className="font-['Playfair_Display'] text-xl font-semibold text-[var(--tan)]">
              Secret Santa
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#" active>Home</NavLink>
            <NavLink href="#">How It Works</NavLink>
            <NavLink href="#">About</NavLink>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 bg-[var(--festive-red)] text-[var(--tan)] rounded-lg font-medium text-sm hover:bg-[var(--festive-red)]/90 transition-colors shadow-md"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`text-sm font-medium transition-colors relative ${
        active 
          ? 'text-[var(--tan)]' 
          : 'text-[var(--olive-muted)] hover:text-[var(--tan)]'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--festive-red)] rounded-full"
        />
      )}
    </a>
  );
}

