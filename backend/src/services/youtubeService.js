import axios from 'axios';

/**
 * Finds a single travel/city-guide video for the searched location.
 * Returns null (instead of throwing) when no API key is configured or the
 * lookup fails, so this bonus feature never breaks the core weather flow.
 */
export const findTravelVideo = async (cityName) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === 'your_youtube_api_key_here') return null;

  try {
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${cityName} travel guide`,
        type: 'video',
        maxResults: 1,
        safeSearch: 'strict',
        key: apiKey,
      },
    });

    const video = data?.items?.[0];
    if (!video) return null;

    return {
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails?.medium?.url,
    };
  } catch {
    return null;
  }
};
