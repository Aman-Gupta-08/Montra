import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button, AnimatedButton } from './Button';

/**
 * DeleteConfirmModal — reusable delete confirmation dialog with Glass Tier 3 styling
 */
export function DeleteConfirmModal({ isOpen, open, onClose, onConfirm, title, description, message, isLoading, loading }) {
  const show = isOpen ?? open;
  const isBusy = isLoading ?? loading;
  const desc = description || message;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !isBusy) onClose?.();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show, isBusy, onClose]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="!fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={!isBusy ? onClose : undefined}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="!fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none safe-area-all"
          >
            <div className="glass-modal glossy-panel rounded-2xl sm:rounded-3xl shadow-2xl border border-white/90 dark:border-white/20 w-full max-w-sm pointer-events-auto overflow-hidden">
              <div className="p-5 sm:p-6 relative z-10">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl glass-1 border border-red-500/25 bg-red-500/10 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-500/10">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {title || 'Delete this item?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                      {desc || 'This action cannot be undone.'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isBusy}
                    className="text-secondary-text hover:text-primary-text transition-colors p-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/10 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 sm:px-6 pb-5 sm:pb-6 relative z-10">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isBusy}
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  id="confirm-delete-btn"
                  action="delete"
                  onClick={onConfirm}
                  loading={isBusy}
                  size="sm"
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * SlidePanel — animated right-side panel for Add/Edit forms with Strong Glass
 */
export function SlidePanel({ isOpen, open, onClose, title, children, width = 'max-w-lg' }) {
  const show = isOpen ?? open;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show, onClose]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="!fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className={`!fixed inset-x-0 bottom-0 top-0 sm:left-auto sm:right-0 z-[101] bg-white dark:bg-[#13151f] text-gray-900 dark:text-white border-l border-gray-200 dark:border-white/15 shadow-2xl w-full max-w-full sm:${width} flex flex-col overscroll-contain`}
            style={{
              height: '100dvh',
              maxHeight: '100dvh',
            }}
          >
            {/* Header with Safe Area Top */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-3.5 sm:pb-4 border-b border-gray-200/80 dark:border-white/10 flex-shrink-0 bg-white/95 dark:bg-[#13151f] backdrop-blur-md z-10">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate pr-2">{title}</h2>
              <button
                type="button"
                id="close-slide-panel-btn"
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex-shrink-0 cursor-pointer"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            {/* Scrollable content with Safe Area Bottom */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] touch-scroll">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default DeleteConfirmModal;
