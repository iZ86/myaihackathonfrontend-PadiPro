import { useState, useEffect, useCallback } from "react";
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
  Cloudy,
  Umbrella,
} from "lucide-react";
import type { ForecastDay } from "@datatypes/weatherType";
import { getWeatherDailyByMobileNoAPI } from "@features/weather/api/weathers";
import { useAuth } from "@context/auth/useAuth";
import { useLanguage } from "@context/lang/useLanguage";

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
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [weatherData, setWeatherData] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const getDatas = useCallback(
    async (token: string, mobileNo: string) => {
      setLoading(true);
      setError(null);
      try {
        const weatherResponse = await getWeatherDailyByMobileNoAPI(
          token,
          mobileNo,
        );

        if (!weatherResponse?.ok) {
          throw new Error(t.history.syncInterrupted);
        }

        const weatherJson = await weatherResponse.json();

        setWeatherData(weatherJson.data.forecastDays);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t.common.error);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    if (!user) return;
    if (user) getDatas("randomToken", user.mobile_no);
  }, [getDatas, user]);

  const getDayNameLocalized = (
    date: { year: number; month: number; day: number },
    index: number,
  ) => {
    if (language === "ms") {
      if (index === 0) return "Hari Ini";
      if (index === 1) return "Esok";
      const days = ["Ahad", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
      const d = new Date(date.year, date.month - 1, date.day);
      return days[d.getDay()];
    }
    return getDayName(date, index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-primary animate-pulse text-sm">
          {t.weather.syncing}
        </p>
      </div>
    );
  }

  if (error || !weatherData || weatherData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center bg-error-container/10 py-10 rounded-3xl border-2 border-dashed border-error/20">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="font-headline font-bold text-xl text-on-surface">
          {t.history.syncInterrupted}
        </h2>
        <p className="text-on-surface-variant text-sm max-w-60">
          {error || t.history.noRecords}
        </p>
        <button
          onClick={() => getDatas("randomToken", "60125821900")}
          className="mt-2 px-6 py-2.5 hero-gradient text-white rounded-full font-bold shadow-lg text-sm transition-transform active:scale-95"
        >
          {t.history.resync}
        </button>
      </div>
    );
  }

  const currentDay = weatherData[0];
  const CurrentIcon = getWeatherIcon(
    currentDay.daytimeForecast.weatherCondition.type,
  );

  return (
    <div className="space-y-6">
      {/* Current Weather Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-4xl p-8 hero-gradient shadow-xl text-white"
      >
        <div className="flex justify-between items-start relative z-10">
          <div className="max-w-[70%]">
            <p className="font-label text-xs uppercase tracking-widest opacity-80 mb-2">
              {t.weather.fieldMonitor}
            </p>
            <h2 className="text-2xl font-bold font-headline mb-0.5 leading-tight">
              {user?.name ? `${user.name}'s Estate` : t.weather.localField}
            </h2>
            <p className="text-[10px] font-medium opacity-70 mb-5 tracking-wider uppercase bg-white/10 w-fit px-2 py-0.5 rounded-full">
              {user?.location || t.weather.unmapped} •{" "}
              {user?.coords._latitude.toFixed(3) || "0.00"}°,{" "}
              {user?.coords._longitude.toFixed(3)}°
            </p>
            <div className="flex items-end gap-3 text-white">
              <span className="text-7xl font-extrabold font-headline leading-none">
                {Math.round(currentDay.maxTemperature.degrees)}°
              </span>
              <div className="flex flex-col mb-1">
                <span className="text-sm font-bold opacity-80 line-clamp-1 capitalize">
                  {currentDay.daytimeForecast.weatherCondition.description.text}
                </span>
                {currentDay.maxHeatIndex && (
                  <span className="text-[10px] font-medium opacity-60">
                    {t.weather.feelsLike}{" "}
                    {Math.round(currentDay.maxHeatIndex.degrees)}°
                  </span>
                )}
              </div>
            </div>
          </div>
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="drop-shadow-2xl"
          >
            <CurrentIcon className="w-24 h-24 text-white p-1" />
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6 relative z-10 border-t border-white/10 pt-6">
          {[
            {
              label: t.weather.humidity,
              value: `${currentDay.daytimeForecast.relativeHumidity}%`,
              icon: Droplets,
            },
            {
              label: t.weather.wind,
              value: `${currentDay.daytimeForecast.wind.speed.value} km/h`,
              icon: Wind,
            },
            {
              label: t.weather.rainfall,
              value: `${currentDay.daytimeForecast.precipitation.qpf.quantity} mm`,
              icon: CloudRain,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1.5 group cursor-default"
            >
              <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </span>
              <div className="flex items-center gap-1.5 font-bold">
                <stat.icon className="w-3.5 h-3.5 text-primary-fixed" />
                <span className="text-sm">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ambient background blur circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-fixed/20 rounded-full blur-[60px]"></div>
      </motion.section>

      {/* Agricultural Insights Card */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-primary leading-tight">
              {t.weather.advice}
            </h3>
            <p className="text-[10px] uppercase font-bold text-primary/60 tracking-wider">
              {t.weather.sensorInsights}
            </p>
          </div>
        </div>
        <div className="bg-white/50 p-4 rounded-2xl space-y-3">
          <p className="text-on-surface-variant text-xs leading-relaxed font-medium">
            {currentDay.daytimeForecast.relativeHumidity > 75
              ? language === "ms"
                ? `Kelembapan melampau dikesan (${currentDay.daytimeForecast.relativeHumidity}%). Risiko tinggi penyakit hawar selaput. Disyorkan pengawasan racun kulat segera.`
                : `Extreme humidity detected (${currentDay.daytimeForecast.relativeHumidity}%). High risk of sheath blight. Recommend urgent fungicidal surveillance.`
              : language === "ms"
                ? "Tahap kelembapan ideal untuk pertumbuhan tanaman fisiologi. Pengambilan nutrien pada masa ini adalah optimum."
                : "Ideal humidity levels for physiological crop growth. Nutrient uptake is currently optimal."}
          </p>
          <div className="flex items-center gap-2.5 text-primary font-bold text-[11px] bg-primary/10 w-fit px-3 py-1.5 rounded-full border border-primary/10">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              {currentDay.daytimeForecast.precipitation.probability.percent > 50
                ? language === "ms"
                  ? "Amaran Cuaca: Tangguhkan penyemburan segera"
                  : "Weather Warning: Postpone immediate spraying"
                : language === "ms"
                  ? "Cuaca Stabil: Tempoh pembajaan nitrogen yang sesuai"
                  : "Weather Stable: Perfect nitrogen window"}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Daily Forecast List */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 pb-8"
      >
        <div className="flex justify-between items-center px-2">
          <h3 className="font-headline font-bold text-xl text-primary">
            {t.weather.title}
          </h3>
          <span className="text-[10px] uppercase font-bold text-outline-variant bg-surface-container-low px-2 py-1 rounded-md">
            {weatherData?.length} {t.weather.tracker}
          </span>
        </div>

        <div className="space-y-4">
          {weatherData?.map((item, i) => {
            const isExpanded = expandedDay === i;
            const DayIcon = getWeatherIcon(
              item.daytimeForecast.weatherCondition.type,
            );

            return (
              <div
                key={i}
                className={`bg-white rounded-3xl shadow-sm border border-surface-container overflow-hidden transition-all duration-500 hover:shadow-md ${isExpanded ? "ring-2 ring-primary/20 bg-surface-container-low/20" : ""}`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4 w-1/3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isExpanded ? "bg-primary text-white" : "bg-surface-container text-primary"}`}
                    >
                      <span className="font-bold text-[11px] uppercase">
                        {getDayNameLocalized(item.displayDate, i).slice(0, 3)}
                      </span>
                    </div>
                    <span className="font-bold text-on-surface text-sm hidden sm:inline">
                      {getDayNameLocalized(item.displayDate, i)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-1/3 justify-center">
                    <DayIcon
                      className={`w-6 h-6 transition-transform duration-500 ${isExpanded ? "scale-110" : ""} text-primary`}
                    />
                    <span className="text-xs font-bold text-on-surface-variant hidden md:inline truncate capitalize opacity-70">
                      {item.daytimeForecast.weatherCondition.description.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-5 w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface text-sm">
                        {Math.round(item.maxTemperature.degrees)}°
                      </span>
                      <div className="w-0.5 h-4 bg-surface-container"></div>
                      <span className="text-outline font-medium text-xs">
                        {Math.round(item.minTemperature.degrees)}°
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-outline transition-transform duration-300 group-hover:translate-y-0.5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="border-t border-surface-container"
                    >
                      <div className="p-6 space-y-6 bg-surface-container-low/40">
                        {/* Weather Detail Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container/50 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                                {t.weather.dayCycles}
                              </span>
                              <Sun className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-on-surface-variant">
                                {t.weather.sunrise}
                              </span>
                              <span className="text-xs font-bold text-primary">
                                {formatTime(item.sunEvents?.sunriseTime)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-on-surface-variant">
                                {t.weather.sunset}
                              </span>
                              <span className="text-xs font-bold text-primary">
                                {formatTime(item.sunEvents?.sunsetTime)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container/50 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                                {t.weather.riskFactors}
                              </span>
                              <AlertCircle className="w-4 h-4 text-error/60" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-on-surface-variant">
                                {t.weather.uvIndex}
                              </span>
                              <span className="text-xs font-bold text-primary">
                                {item.daytimeForecast.uvIndex ?? 0}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-on-surface-variant">
                                {t.weather.stormChance}
                              </span>
                              <span className="text-xs font-bold text-primary">
                                {item.daytimeForecast.thunderstormProbability ??
                                  0}
                                %
                              </span>
                            </div>
                          </div>

                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container/50 flex flex-col gap-3 group">
                              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                                {t.weather.dayDynamics}
                              </span>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-lg font-extrabold text-on-surface">
                                    {Math.round(item.maxTemperature.degrees)}°
                                  </span>
                                  <span className="text-[10px] font-bold text-outline uppercase">
                                    {
                                      item.daytimeForecast.weatherCondition
                                        .description.text
                                    }
                                  </span>
                                </div>
                                <Umbrella className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                              </div>
                              <p className="text-[10px] font-bold text-primary">
                                {
                                  item.daytimeForecast.precipitation.probability
                                    .percent
                                }
                                % {t.weather.precip}
                              </p>
                            </div>

                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container/50 flex flex-col gap-3 group">
                              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                                {t.weather.nightShift}
                              </span>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-lg font-extrabold text-on-surface">
                                    {Math.round(item.minTemperature.degrees)}°
                                  </span>
                                  <span className="text-[10px] font-bold text-outline uppercase">
                                    {
                                      item.nighttimeForecast.weatherCondition
                                        .description.text
                                    }
                                  </span>
                                </div>
                                <Cloud className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                              </div>
                              <p className="text-[10px] font-bold text-primary">
                                {
                                  item.nighttimeForecast.precipitation
                                    .probability.percent
                                }
                                % {t.weather.precip}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Agri Metric List */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            {
                              icon: Wind,
                              label: t.weather.wind,
                              value: `${item.daytimeForecast.wind.speed.value} km/h`,
                            },
                            {
                              icon: Cloudy,
                              label: t.weather.clouds,
                              value: `${item.daytimeForecast.cloudCover ?? 0}%`,
                            },
                            {
                              icon: Droplets,
                              label: t.weather.rainfall,
                              value: `${item.daytimeForecast.precipitation.qpf.quantity}mm`,
                            },
                          ].map((stat, idx) => (
                            <div
                              key={idx}
                              className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center text-center gap-1 border border-primary/5"
                            >
                              <stat.icon className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[9px] uppercase font-bold text-primary/60">
                                {stat.label}
                              </span>
                              <span className="text-xs font-bold text-primary">
                                {stat.value}
                              </span>
                            </div>
                          ))}
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
    </div>
  );
}
