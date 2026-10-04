import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, Sliders, Moon, Sun, Eye } from 'lucide-react';
import { AnimatedButton, BUTTON_ACTIONS } from './Button';

export function ButtonShowcaseModal({ isOpen, onClose }) {
  const [globalState, setGlobalState] = useState('default'); // 'default' | 'loading' | 'success' | 'error' | 'disabled'
  const [selectedVariant, setSelectedVariant] = useState('primary');
  const [selectedSize, setSelectedSize] = useState('md');
  const [actionSimulations, setActionSimulations] = useState({});

  if (!isOpen) return null;

  const handleSimulateClick = (actionKey) => {
    // Simulate real asynchronous API life-cycle without blocking
    setActionSimulations((prev) => ({ ...prev, [actionKey]: 'loading' }));

    setTimeout(() => {
      setActionSimulations((prev) => ({ ...prev, [actionKey]: 'success' }));
      setTimeout(() => {
        setActionSimulations((prev) => ({ ...prev, [actionKey]: 'default' }));
      }, 1600);
    }, 1200);
  };

  const actionKeys = Object.keys(BUTTON_ACTIONS);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#121316] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Montra Animated Button Design System
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold">
                    19 Actions
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Primary HTML+CSS motion reference engine with action-specific micro-interactions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-showcase-btn"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-black/20 flex flex-wrap items-center justify-between gap-4">
            {/* Global State Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-200/80 dark:border-white/10">
              <span className="text-xs font-semibold px-2.5 text-gray-500">State:</span>
              {['default', 'loading', 'success', 'error', 'disabled'].map((st) => (
                <button
                  key={st}
                  id={`btn-state-toggle-${st}`}
                  onClick={() => setGlobalState(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    globalState === st
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Variant Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-200/80 dark:border-white/10">
              <span className="text-xs font-semibold px-2.5 text-gray-500">Variant:</span>
              {['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'liquid'].map((v) => (
                <button
                  key={v}
                  id={`btn-variant-toggle-${v}`}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedVariant === v
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Size Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-200/80 dark:border-white/10">
              <span className="text-xs font-semibold px-2.5 text-gray-500">Size:</span>
              {['sm', 'md', 'lg'].map((sz) => (
                <button
                  key={sz}
                  id={`btn-size-toggle-${sz}`}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                    selectedSize === sz
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of All 19 Action Buttons */}
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50/40 dark:bg-black/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {actionKeys.map((actionKey) => {
                const config = BUTTON_ACTIONS[actionKey];
                const simState = actionSimulations[actionKey] || globalState;

                const isLoading = simState === 'loading';
                const isSuccess = simState === 'success';
                const isError = simState === 'error';
                const isDisabled = simState === 'disabled';

                return (
                  <div
                    key={actionKey}
                    className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/10 shadow-xs flex flex-col justify-between gap-3 group hover:border-violet-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 capitalize">
                          {actionKey}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                          {config.hue}°
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 group-hover:text-violet-500 transition-colors">
                        Click to test
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-center">
                      <AnimatedButton
                        id={`showcase-btn-${actionKey}`}
                        action={actionKey}
                        variant={selectedVariant}
                        size={selectedSize}
                        loading={isLoading}
                        success={isSuccess}
                        error={isError}
                        disabled={isDisabled}
                        onClick={() => handleSimulateClick(actionKey)}
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Rest: {config.text}</span>
                      <span>Next: {config.loadingText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/[0.02] flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Reference letter-anim &bull; Inner/Outer shadows &bull; Ambient boundary &bull; Sweep highlight &bull; Zero delay on API</span>
            </span>
            <span>WCAG 2.1 AAA Compliant</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ButtonShowcaseModal;
