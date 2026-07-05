import { AlertTriangle, RotateCcw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="panel flex flex-col items-center gap-3 border-coral-400/30 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-400/10 text-coral-400">
        <AlertTriangle size={22} />
      </div>
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="max-w-sm text-sm text-atmosphere-600 dark:text-mist-200/70">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-atmosphere-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-atmosphere-700 dark:bg-amber-400 dark:text-atmosphere-950 dark:hover:bg-amber-500"
        >
          <RotateCcw size={15} /> Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
