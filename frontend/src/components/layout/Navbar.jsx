import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import { MontraLogo } from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedButton } from '../common/Button';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Students', href: '#accounts' },
  { label: 'For Employees', href: '#accounts' },
  { label: 'For Business', href: '#accounts' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-[max(env(safe-area-inset-top),0.75rem)] left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none"
      >
        <nav
          className={`max-w-6xl mx-auto h-16 rounded-full glass-4 px-4 sm:px-6 flex items-center justify-between pointer-events-auto border border-white/80 dark:border-white/15 shadow-xl transition-all duration-300 ${
            scrolled ? 'shadow-violet-500/10 dark:shadow-black/50' : 'shadow-black/5'
          }`}
        >
          {/* Logo */}
          <Link to="/" aria-label="Montra home" className="flex items-center pl-1">
            <MontraLogo size="sm" textColor={isDark ? "text-white" : "text-gray-900"} />
          </Link>

          {/* Desktop Nav Links */}
          {isLanding && (
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full glass-1 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-violet-600" />}
            </button>

            <AnimatedButton
              id="nav-login-btn"
              action="login"
              variant="ghost"
              size="sm"
              to="/login"
              hue={260}
            >
              Sign In
            </AnimatedButton>
            <AnimatedButton
              id="nav-register-btn"
              action="getStarted"
              size="sm"
              to="/register"
              hue={160}
              rightIcon={<ArrowRight size={13} />}
            >
              Get Started
            </AnimatedButton>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full glass-1 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-violet-600" />}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-full glass-1 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 sm:inset-x-4 top-[max(calc(env(safe-area-inset-top)+4.75rem),5.25rem)] z-50 glass-3 rounded-3xl border border-white/90 dark:border-white/20 shadow-2xl p-5 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {isLanding && navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-violet-600 transition-colors py-2 px-3 rounded-xl hover:bg-white/40 dark:hover:bg-white/10"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-white/60 dark:border-white/10 mt-1">
                <AnimatedButton
                  id="mobile-nav-login-btn"
                  action="login"
                  variant="secondary"
                  size="md"
                  fullWidth
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  hue={260}
                >
                  Sign In
                </AnimatedButton>
                <AnimatedButton
                  id="mobile-nav-register-btn"
                  action="getStarted"
                  size="md"
                  fullWidth
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  hue={160}
                  rightIcon={<ArrowRight size={14} />}
                >
                  Get Started Free
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
