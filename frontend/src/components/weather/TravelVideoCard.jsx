import { Film } from 'lucide-react';

const TravelVideoCard = ({ video, cityName }) => {
  if (!video) return null;

  return (
    <div className="panel overflow-hidden p-4">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Film size={15} className="text-coral-400" />
        <p className="eyebrow">Explore {cityName}</p>
      </div>
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe
          title={video.title}
          src={`https://www.youtube.com/embed/${video.videoId}`}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowFullScreen
        />
      </div>
      <p className="mt-2 truncate px-1 text-xs text-atmosphere-500 dark:text-mist-200/50">{video.title}</p>
    </div>
  );
};

export default TravelVideoCard;
