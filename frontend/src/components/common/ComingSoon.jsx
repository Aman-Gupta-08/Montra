import { motion } from 'framer-motion';

/**
 * ComingSoon — stub page for routes not yet fully implemented
 */
export function ComingSoon({ title, description, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-4xl"
        style={{ background: 'linear-gradient(135deg, #EDEBF7 0%, #E6F7E4 100%)' }}
      >
        {Icon ? <Icon size={36} className="text-violet-500" /> : '🚧'}
      </div>
      <h2 className="text-2xl font-bold text-primary-text dark:text-white mb-3">{title}</h2>
      <p className="text-secondary-text max-w-md leading-relaxed">
        {description || 'This feature is coming soon. We\'re working hard to bring it to you.'}
      </p>
    </motion.div>
  );
}
