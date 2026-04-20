export type ForecastDetails = {
  weatherCondition: {
    description: { text: string; };
    type: string;
  };
  relativeHumidity: number;
  precipitation: {
    probability: { percent: number; };
    qpf: { quantity: number; unit: string; };
  };
  wind: {
    speed: { value: number; unit: string; };
    direction?: { cardinal: string; };
  };
  uvIndex?: number;
  cloudCover?: number;
  thunderstormProbability?: number;
};

export type ForecastDay = {
  displayDate: { year: number; month: number; day: number; };
  daytimeForecast: ForecastDetails;
  nighttimeForecast: ForecastDetails;
  maxTemperature: { degrees: number; };
  minTemperature: { degrees: number; };
  feelsLikeMaxTemperature?: { degrees: number; };
  feelsLikeMinTemperature?: { degrees: number; };
  sunEvents?: { sunriseTime: string; sunsetTime: string; };
  maxHeatIndex?: { degrees: number; };
};