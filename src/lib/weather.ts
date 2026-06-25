// WMO weather interpretation codes -> label + emoji.
const CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Dense drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "⛈️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Storm + hail", icon: "⛈️" },
  99: { label: "Severe storm", icon: "⛈️" },
};

export function describeWeather(code: number) {
  return CODES[code] ?? { label: "—", icon: "🌡️" };
}

export type WeatherResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
};

// Simple agronomic advisory derived from current conditions + rain outlook.
export function farmAdvisory(w: WeatherResponse): string {
  const rainSoon = w.daily.precipitation_probability_max
    .slice(0, 3)
    .some((p) => p >= 60);
  const hot = w.current.temperature_2m >= 33;
  const dry = w.daily.precipitation_sum.slice(0, 5).every((p) => p < 1);
  if (rainSoon) return "Rain likely within 3 days — hold off on spraying and fertilizer application.";
  if (hot && dry) return "Hot and dry spell — prioritise irrigation and mulching to protect young crops.";
  if (dry) return "Dry outlook — schedule irrigation and monitor soil moisture closely.";
  return "Conditions are favourable for field operations and harvesting.";
}
