import { Star } from 'lucide-react';

const FavoriteButton = ({ isFavorite, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
        isFavorite
          ? 'border-amber-400 bg-amber-400/10 text-amber-500'
          : 'border-black/10 text-atmosphere-500 hover:border-amber-400/60 hover:text-amber-500 dark:border-white/10 dark:text-mist-200/60'
      } ${className}`}
    >
      <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
};

export default FavoriteButton;
