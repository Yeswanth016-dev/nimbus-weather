import axios from 'axios';

/**
 * Builds practical, deterministic clothing/activity advice from the raw
 * weather numbers. This is the default (and offline-safe) path — it never
 * depends on an external LLM being configured.
 */
const buildRuleBasedAdvice = (weather) => {
  const { temp, feelsLike, condition, humidity, windSpeed, uvIndex } = weather;
  const lines = [];

  if (feelsLike <= 5) lines.push('Bundle up: heavy coat, gloves, and a hat — it feels near freezing.');
  else if (feelsLike <= 15) lines.push('Wear a warm jacket or layered sweater; evenings will feel cool.');
  else if (feelsLike <= 24) lines.push('Light layers work well — a long-sleeve shirt or light jacket is plenty.');
  else if (feelsLike <= 30) lines.push('Dress light and breathable; short sleeves and breathable fabrics recommended.');
  else lines.push('Stay cool: light clothing, sun protection, and frequent hydration are a must.');

  const conditionLower = (condition || '').toLowerCase();
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    lines.push('Carry an umbrella or waterproof jacket — precipitation is likely.');
  } else if (conditionLower.includes('snow')) {
    lines.push('Wear insulated, waterproof footwear for snowy conditions underfoot.');
  } else if (conditionLower.includes('thunderstorm')) {
    lines.push('Postpone outdoor plans if possible — thunderstorms are active in the area.');
  } else if (conditionLower.includes('clear')) {
    lines.push('Good conditions for outdoor activities — consider a walk, run, or picnic.');
  }

  if (uvIndex !== null && uvIndex !== undefined && uvIndex >= 6) {
    lines.push(`UV index is ${uvIndex} — apply sunscreen and consider sunglasses if you're outdoors.`);
  }

  if (windSpeed >= 10) {
    lines.push('Winds are strong — secure loose items and expect it to feel cooler than the thermometer suggests.');
  }

  if (humidity >= 80) {
    lines.push('High humidity — light, moisture-wicking fabric will feel more comfortable than heavier layers.');
  }

  return lines.join(' ');
};

/**
 * If ANTHROPIC_API_KEY is configured, ask a real model to turn the same
 * weather numbers into a short, friendly recommendation. Falls back to the
 * rule-based advice above on any failure so the feature never breaks.
 */
export const generateWeatherAdvice = async (weather, locationName) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const fallback = buildRuleBasedAdvice(weather);

  if (!apiKey) {
    return { advice: fallback, source: 'rule-based' };
  }

  try {
    const { data } = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `Given this weather in ${locationName}: temperature ${weather.temp}°C (feels like ${weather.feelsLike}°C), condition "${weather.condition}", humidity ${weather.humidity}%, wind ${weather.windSpeed} m/s, UV index ${weather.uvIndex ?? 'unknown'}. In 2-3 short sentences, recommend what to wear and what activities suit the day. Be concise and practical.`,
          },
        ],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 12000,
      }
    );

    const text = data?.content?.find((block) => block.type === 'text')?.text;
    return { advice: text?.trim() || fallback, source: text ? 'llm' : 'rule-based' };
  } catch {
    return { advice: fallback, source: 'rule-based' };
  }
};
