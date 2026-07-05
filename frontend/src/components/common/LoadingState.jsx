import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';

const LoadingState = ({ label = 'Reading the instruments…' }) => {
  return (
    <div className="panel flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        className="text-amber-500"
      >
        <CloudSun size={44} strokeWidth={1.5} />
      </motion.div>
      <p className="eyebrow animate-pulse-soft">{label}</p>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-atmosphere-200/40 dark:bg-atmosphere-700">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400"
          animate={{ x: ['-100%', '220%'] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default LoadingState;
