import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  id?: string;
  activeAudioId?: string | null;
  src: string;
  variant: "user" | "assistant" | "preview";
  onPlay?: (id: string) => void;
}

// Generate deterministic waveform bars from a seed string
function generateWaveform(seed: string, barCount: number): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < barCount; i++) {
    hash = (hash * 16807 + 12345) & 0x7fffffff;
    const value = 0.2 + ((hash % 1000) / 1000) * 0.8;
    bars.push(value);
  }
  return bars;
}

export default function AudioPlayer({
  id = "",
  activeAudioId = null,
  src,
  variant,
  onPlay,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  const isPreview = variant === "preview";
  const barCount = isPreview ? 48 : 32;
  const waveformBars = useRef(generateWaveform(src, barCount)).current;

  // Pause when another player starts
  useEffect(() => {
    if (activeAudioId !== null && activeAudioId !== id) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [activeAudioId, id]);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setProgress(current / total);
      setCurrentTime(current);
    }
    animationRef.current = requestAnimationFrame(updateProgress);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateProgress]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      onPlay?.(id);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      // Handle Infinity duration from webm blobs
      if (
        audioRef.current.duration === Infinity ||
        isNaN(audioRef.current.duration)
      ) {
        audioRef.current.currentTime = 1e101;
        audioRef.current.addEventListener(
          "timeupdate",
          function handler() {
            audioRef.current!.currentTime = 0;
            setDuration(audioRef.current!.duration);
            audioRef.current!.removeEventListener("timeupdate", handler);
          },
          { once: true }
        );
      } else {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration || !isFinite(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio);
    setCurrentTime(ratio * duration);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isUser = variant === "user";

  // Color schemes
  const playBtnClass = isUser
    ? "bg-white/20 hover:bg-white/30 text-white"
    : "bg-primary/10 hover:bg-primary/15 text-primary";

  const timeClass = isUser ? "text-white/70" : "text-on-surface-variant/60";

  const barActiveColor = isUser ? "bg-white" : "bg-primary";
  const barInactiveColor = isUser ? "bg-white/30" : "bg-primary/20";

  const containerClass = isPreview
    ? "flex items-center gap-3 w-full"
    : "flex items-center gap-3 min-w-[200px] max-w-[280px]";

  const btnSize = isPreview ? "w-8 h-8" : "w-10 h-10";
  const iconSize = isPreview ? 14 : 18;
  const barHeight = isPreview ? "h-6" : "h-6";

  return (
    <div className={containerClass}>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play / Pause Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`${btnSize} rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${playBtnClass}`}
      >
        {isPlaying ? (
          <Pause size={iconSize} fill="currentColor" />
        ) : (
          <Play
            size={iconSize}
            fill="currentColor"
            className="translate-x-0.5"
          />
        )}
      </motion.button>

      {/* Waveform */}
      <div
        className={`grow flex items-center justify-between gap-0.5 ${barHeight} cursor-pointer min-w-0`}
        onClick={handleWaveformClick}
      >
        {waveformBars.map((height, i) => {
          const barProgress = i / waveformBars.length;
          const isActive = barProgress <= progress;
          return (
            <motion.div
              key={i}
              className={`rounded-full w-0.75 transition-colors duration-150 ${isActive ? barActiveColor : barInactiveColor}`}
              style={{ height: `${height * 100}%`, minHeight: 3 }}
              initial={false}
              animate={
                isPlaying && isActive
                  ? { scaleY: [1, 1.25, 1] }
                  : { scaleY: 1 }
              }
              transition={
                isPlaying && isActive
                  ? {
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.015,
                    }
                  : { duration: 0.15 }
              }
            />
          );
        })}
      </div>

      {/* Duration */}
      <div className="shrink-0">
        <span className={`text-xs font-bold tabular-nums ${timeClass}`}>
          {isPlaying || currentTime > 0
            ? formatTime(currentTime)
            : formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
