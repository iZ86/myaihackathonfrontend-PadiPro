import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  CloudRain,
  CloudLightning,
  CloudSun,
  Wind,
  Droplets,
  AlertCircle,
  Sprout,
  Cloud,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset,
  Zap,
  Cloudy,
  Umbrella,
} from "lucide-react";
import type { ForecastDay } from "@datatypes/weatherType";
import { getWeatherDailyByMobileNoAPI } from "@features/weather/api/weathers";

const getWeatherIcon = (type: string) => {
  switch (type) {
    case "SUNNY":
      return Sun;
    case "PARTLY_CLOUDY":
      return CloudSun;
    case "CLOUDY":
      return Cloud;
    case "LIGHT_RAIN":
    case "RAIN":
    case "SHOWERS":
      return CloudRain;
    case "THUNDERSTORM":
    case "SCATTERED_THUNDERSTORMS":
    case "STRONG_TSTORMS":
      return CloudLightning;
    default:
      return Cloud;
  }
};

const getDayName = (
  date: { year: number; month: number; day: number },
  index: number,
) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(date.year, date.month - 1, date.day);
  return days[d.getDay()];
};

const formatTime = (isoString?: string) => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function WeatherForecast() {
  const [data, setData] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    const getWeatherDailyByMobileNo = async (
      token: string,
      mobileNo: string,
    ) => {
      const response: Response | undefined = await getWeatherDailyByMobileNoAPI(
        token,
        mobileNo,
      );

      if (response) {
        if (response.ok) {
          const responseJson = await response.json();
          setData(responseJson.data.forecastDays);
          setLoading(false);
          setError(null);
          return;
        }
      } else {
        console.error("No response received from weather API.");
        setError("Unable to fetch weather data. Please try again later.");
      }

      setData([]);
      setLoading(false);
    };

    // TODO: Replace with actual token and mobile no.
    getWeatherDailyByMobileNo("randomToken", "60125821900");
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-headline font-bold text-primary">
          Fetching latest field data...
        </p>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Oops! Connection Lost
        </h2>
        <p className="text-on-surface-variant max-w-xs">
          {error || "Unable to update field weather."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 hero-gradient text-white rounded-full font-bold shadow-lg"
        >
          Retry Sync
        </button>
      </div>
    );
  }

  const currentDay = data[0];

  return (
    <>
      {/* Current Weather Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-4xl p-8 hero-gradient shadow-lg text-white"
      >
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="font-label text-sm uppercase tracking-widest opacity-80 mb-1">
              Current Forecast
            </p>
            <h2 className="text-2xl font-bold font-headline mb-4">
              Kumasi, Ashanti
            </h2>
            <div className="flex items-end gap-2 text-white">
              <span className="text-7xl font-extrabold font-headline leading-none">
                {Math.round(currentDay.maxTemperature.degrees)}°
              </span>
              <span className="text-lg font-medium mb-2 capitalize">
                {currentDay.daytimeForecast.weatherCondition.description.text}
              </span>
            </div>
            {currentDay.maxHeatIndex && (
              <p className="text-xs font-medium opacity-80 mt-1">
                RealFeel® {Math.round(currentDay.maxHeatIndex.degrees)}°
              </p>
            )}
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {React.createElement(
              getWeatherIcon(currentDay.daytimeForecast.weatherCondition.type),
              { className: "w-24 h-24 opacity-90 text-white" },
            )}
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-tighter opacity-70">
              Humidity
            </span>
            <div className="flex items-center gap-1 font-bold">
              <Droplets className="w-4 h-4" />
              <span>{currentDay.daytimeForecast.relativeHumidity}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-tighter opacity-70">
              Wind
            </span>
            <div className="flex items-center gap-1 font-bold">
              <Wind className="w-4 h-4" />
              <span>{currentDay.daytimeForecast.wind.speed.value} km/h</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-tighter opacity-70">
              Rainfall
            </span>
            <div className="flex items-center gap-1 font-bold">
              <CloudRain className="w-4 h-4" />
              <span>
                {currentDay.daytimeForecast.precipitation.qpf.quantity} mm
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </motion.section>

      {/* Agricultural Insights Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary-fixed p-6 rounded-2xl shadow-sm space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-on-primary-fixed rounded-lg text-primary-fixed">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-headline font-bold text-on-primary-fixed">
            Agronomic Advice
          </h3>
        </div>
        <p className="text-on-primary-fixed-variant text-sm leading-relaxed">
          {currentDay.daytimeForecast.relativeHumidity > 75
            ? `High humidity (${currentDay.daytimeForecast.relativeHumidity}%) increases vulnerability to fungal growth. Consider preventive measures.`
            : "Conditions are stable for crop maintenance. Morning humidity is within optimal ranges."}
        </p>
        <div className="flex items-center gap-2 text-on-primary-fixed-variant font-bold text-xs uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>
            {currentDay.daytimeForecast.precipitation.probability.percent > 50
              ? "Delay fertilization due to high rain probability"
              : "Ideal window for Nitrogen application"}
          </span>
        </div>
      </motion.section>

      {/* Daily Forecast List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 pb-8"
      >
        <div className="flex justify-between items-center px-2">
          <h3 className="font-headline font-bold text-xl text-primary">
            Daily Forecast
          </h3>
          <span className="text-[10px] uppercase font-bold text-outline-variant">
            Next {data.length} Days
          </span>
        </div>
        <div className="space-y-4 px-1">
          {data.map((item, i) => {
            const isExpanded = expandedDay === i;

            return (
              <div
                key={i}
                className={`bg-white rounded-3xl shadow-sm border border-surface-container overflow-hidden transition-all duration-300 ${isExpanded ? "ring-2 ring-primary/20" : ""}`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4 w-1/3">
                    <span className="font-bold text-on-surface text-sm">
                      {getDayName(item.displayDate, i)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-1/3 justify-center">
                    {React.createElement(
                      getWeatherIcon(
                        currentDay.daytimeForecast.weatherCondition.type,
                      ),
                      { className: "w-6 h-6 text-primary" },
                    )}
                    <span className="text-xs font-medium text-on-surface-variant hidden md:inline truncate capitalize">
                      {item.daytimeForecast.weatherCondition.description.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-5 w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">
                        {Math.round(item.maxTemperature.degrees)}°
                      </span>
                      <span className="text-outline font-medium text-xs">
                        {Math.round(item.minTemperature.degrees)}°
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-outline" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-outline" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-surface-container bg-surface-container-low/30"
                    >
                      <div className="p-6 space-y-6">
                        {/* Weather Detail Grid */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Day & Night Comparison */}
                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl flex flex-col gap-2">
                              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                                Daytime
                              </span>
                              <div className="flex items-center justify-between">
                                {item.daytimeForecast.weatherCondition.type.includes(
                                  "SUN",
                                ) ? (
                                  <Sun className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <Cloudy className="w-5 h-5 text-primary" />
                                )}
                                <span className="font-bold text-on-surface">
                                  {Math.round(item.maxTemperature.degrees)}°
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                                <Umbrella className="w-3 h-3" />
                                <span>
                                  {
                                    item.daytimeForecast.precipitation
                                      .probability.percent
                                  }
                                  % Chance
                                </span>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl flex flex-col gap-2">
                              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                                Nighttime
                              </span>
                              <div className="flex items-center justify-between">
                                <Cloud className="w-5 h-5 text-primary" />
                                <span className="font-bold text-on-surface">
                                  {Math.round(item.minTemperature.degrees)}°
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                                <Umbrella className="w-3 h-3" />
                                <span>
                                  {
                                    item.nighttimeForecast.precipitation
                                      .probability.percent
                                  }
                                  % Chance
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Metrics */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-xl shadow-xs">
                                <Sun className="w-4 h-4 text-amber-500" />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-outline">
                                  UV Index
                                </p>
                                <p className="text-sm font-bold">
                                  {item.daytimeForecast.uvIndex ?? 0} High
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-xl shadow-xs">
                                <Cloudy className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-outline">
                                  Cloud Cover
                                </p>
                                <p className="text-sm font-bold">
                                  {item.daytimeForecast.cloudCover ?? 0}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-xl shadow-xs">
                                <Zap className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-outline">
                                  Thunderstorm Chance
                                </p>
                                <p className="text-sm font-bold">
                                  {item.daytimeForecast
                                    .thunderstormProbability ?? 0}
                                  %
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-xl shadow-xs">
                                <Wind className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-outline">
                                  Wind Speed
                                </p>
                                <p className="text-sm font-bold">
                                  {item.daytimeForecast.wind.speed.value}{" "}
                                  {item.daytimeForecast.wind.speed.unit ===
                                  "KILOMETERS_PER_HOUR"
                                    ? "km/h"
                                    : item.daytimeForecast.wind.speed.unit}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sun Events */}
                        {item.sunEvents && (
                          <div className="bg-white p-4 rounded-2xl flex justify-around items-center border border-surface-container/50">
                            <div className="flex items-center gap-3">
                              <Sunrise className="w-5 h-5 text-amber-500" />
                              <div>
                                <p className="text-[10px] uppercase font-bold text-outline">
                                  Sunrise
                                </p>
                                <p className="text-xs font-bold">
                                  {formatTime(item.sunEvents.sunriseTime)}
                                </p>
                              </div>
                            </div>
                            <div className="w-px h-8 bg-surface-container"></div>
                            <div className="flex items-center gap-3">
                              <Sunset className="w-5 h-5 text-amber-600" />
                              <div>
                                <p className="text-[10px] uppercase font-bold text-outline">
                                  Sunset
                                </p>
                                <p className="text-xs font-bold">
                                  {formatTime(item.sunEvents.sunsetTime)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Agri Tip */}
                        <div className="bg-primary/5 p-4 rounded-xl flex items-center gap-3">
                          <AlertCircle className="w-4 h-4 text-primary" />
                          <p className="text-[11px] text-primary font-medium">
                            {item.daytimeForecast.uvIndex &&
                            item.daytimeForecast.uvIndex > 7
                              ? "Extreme UV today. Advise field workers to prioritize shaded tasks between 11 AM - 3 PM."
                              : "Optimal conditions for general crop maintenance."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>
    </>
  );
}
