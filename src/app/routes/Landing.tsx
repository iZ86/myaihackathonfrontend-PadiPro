"use client";

import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "motion/react";
import {
  MessageSquareText,
  Cloud,
  ScanLine,
  Leaf,
  ArrowRight,
  Play,
  CheckCircle2,
  Brain,
  Cpu,
  Zap,
  TrendingUp,
  Shield,
  Camera,
  Sprout,
  BarChart3,
  Bot,
  Sparkles,
  CloudRain,
  SquareStack,
  CloudSun,
  Sun,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

/* ─── useCounter ─────────────────────────────────────────────── */
function useCounter(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── Hero chat mockup ───────────────────────────────────────── */
function HeroChatMockup() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto"
      style={{ filter: "drop-shadow(0 32px 64px rgba(15,82,56,0.18))" }}
    >
      {/* Glow behind card */}
      <div
        className="absolute -inset-4 rounded-[2.5rem] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,82,56,0.1) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(252,249,243,0.97)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(15,82,56,0.12)",
        }}
      >
        {/* Card header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(15,82,56,0.08)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0f5238, #2d6a4f)",
              }}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#1c1c18",
                }}
              >
                PaddyAI
              </p>
              <p style={{ fontSize: "0.65rem", color: "#707973" }}>
                Smart Crop Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#0f5238" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#0f5238" }}
              />
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "#0f5238",
              }}
            >
              Live
            </span>
          </div>
        </div>

        {/* Messages area */}
        <div className="px-4 py-4 space-y-4 min-h-65">
          {/* User message */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3"
                  style={{
                    background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.9)",
                      marginBottom: "8px",
                    }}
                  >
                    Found spots on my rice leaves. What is this?
                  </p>
                  {/* Leaf image placeholder */}
                  <div
                    className="w-full h-24 rounded-xl overflow-hidden relative"
                    style={{
                      background:
                        "linear-gradient(135deg, #14532d 0%, #052e16 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(168,231,197,0.08) 8px, rgba(168,231,197,0.08) 9px)",
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: "32%",
                        left: "38%",
                        width: "30px",
                        height: "22px",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,171,105,0.85)",
                        boxShadow: "0 0 10px rgba(142,78,20,0.35)",
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: "55%",
                        left: "60%",
                        width: "20px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,171,105,0.6)",
                      }}
                    />
                    <p
                      className="absolute bottom-2 left-2"
                      style={{
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        color: "rgba(168,231,197,0.6)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Field Sample
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5 items-start"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(15,82,56,0.08)",
                    border: "1px solid rgba(15,82,56,0.15)",
                  }}
                >
                  <Brain className="w-3.5 h-3.5" style={{ color: "#0f5238" }} />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(15,82,56,0.1)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.2,
                      }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(15,82,56,0.5)" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI response */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5 items-start"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(15,82,56,0.08)",
                    border: "1px solid rgba(15,82,56,0.15)",
                  }}
                >
                  <Brain className="w-3.5 h-3.5" style={{ color: "#0f5238" }} />
                </div>
                <div
                  className="flex-1 px-4 py-3 rounded-2xl rounded-tl-sm space-y-3"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(15,82,56,0.1)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          color: "#1c1c18",
                        }}
                      >
                        Brown Spot Disease
                      </p>
                      <p
                        style={{
                          fontSize: "0.6rem",
                          color: "#707973",
                          marginTop: "1px",
                        }}
                      >
                        Helminthosporium oryzae
                      </p>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(142,78,20,0.1)",
                        border: "1px solid rgba(142,78,20,0.2)",
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        color: "#8e4e14",
                      }}
                    >
                      HIGH RISK
                    </div>
                  </div>
                  {[
                    { label: "Confidence", value: 94.7, color: "#0f5238" },
                    { label: "Severity", value: 72, color: "#8e4e14" },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div
                        className="flex justify-between mb-0.5"
                        style={{ fontSize: "0.6rem" }}
                      >
                        <span style={{ color: "#707973" }}>{bar.label}</span>
                        <span style={{ fontWeight: 700, color: bar.color }}>
                          {bar.value}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ background: "#e5e2dc" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: bar.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    className="flex items-center gap-1.5 pt-1"
                    style={{ borderTop: "1px solid rgba(15,82,56,0.08)" }}
                  >
                    <CheckCircle2
                      className="w-3 h-3 shrink-0"
                      style={{ color: "#0f5238" }}
                    />
                    <p style={{ fontSize: "0.62rem", color: "#707973" }}>
                      Treatment plan ready ·{" "}
                      <span style={{ color: "#0f5238", fontWeight: 700 }}>
                        View Plan →
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid rgba(15,82,56,0.08)" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{
              background: "#f6f3ed",
              border: "1px solid rgba(15,82,56,0.08)",
            }}
          >
            <span
              className="flex-1"
              style={{ fontSize: "0.72rem", color: "#bfc9c1" }}
            >
              Ask about your crops…
            </span>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#0f5238,#2d6a4f)" }}
            >
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating weather pill */}
      <motion.div
        className="absolute -left-10 top-[22%] flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: "rgba(252,249,243,0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(15,82,56,0.12)",
          boxShadow: "0 8px 32px rgba(15,82,56,0.1)",
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <CloudSun className="w-3.5 h-3.5" style={{ color: "#8e4e14" }} />
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "#1c1c18",
            fontFamily: "'Manrope',sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          28°C · Partly Cloudy
        </span>
      </motion.div>

      {/* Floating accuracy badge */}
      <motion.div
        className="absolute -right-8 bottom-[18%] flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: "rgba(252,249,243,0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(15,82,56,0.15)",
          boxShadow: "0 8px 32px rgba(15,82,56,0.1)",
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#0f5238" }} />
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "#0f5238",
            fontFamily: "'Manrope',sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          95% Accuracy
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Metric card ────────────────────────────────────────────── */
function MetricCard({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1400, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="text-center py-8 px-6"
    >
      <div
        className="text-5xl font-extrabold mb-2 tabular-nums"
        style={{
          fontFamily: "'Manrope',sans-serif",
          letterSpacing: "-0.04em",
          color: "#0f5238",
        }}
      >
        {suffix === "<" ? `<${count}s` : `${count}${suffix}`}
      </div>
      <p className="text-sm" style={{ color: "#707973" }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Main Landing ───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const features = [
    {
      icon: <MessageSquareText className="w-5 h-5" />,
      title: "AI Farming Chat",
      desc: "Ask anything — diseases, weather windows, fertiliser schedules. Gemini-powered answers in seconds.",
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
    },
    {
      icon: <ScanLine className="w-5 h-5" />,
      title: "Disease Detection",
      desc: "Upload a leaf photo. Our Vertex AI model identifies 40+ paddy diseases with 95% clinical accuracy.",
      color: "#2d6a4f",
      bg: "rgba(45,106,79,0.08)",
    },
    {
      icon: <CloudRain className="w-5 h-5" />,
      title: "Weather Intelligence",
      desc: "Hyper-local forecasts with agronomic alerts — optimal spray windows, irrigation triggers, frost warnings.",
      color: "#0369a1",
      bg: "rgba(3,105,161,0.07)",
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Media Upload",
      desc: "Send images, videos, or voice notes. PadiPro processes all media formats for full-context analysis.",
      color: "#7c3aed",
      bg: "rgba(124,58,237,0.07)",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Yield Forecasting",
      desc: "Predictive risk scoring surfaces early warnings before visible symptoms — protect harvest before it's too late.",
      color: "#92400e",
      bg: "rgba(146,64,14,0.07)",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Data Privacy",
      desc: "End-to-end encryption, farm-level data isolation, and on-premise options. Your data stays yours.",
      color: "#8e4e14",
      bg: "rgba(142,78,20,0.07)",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      metric: "10× faster",
      title: "Diagnose in seconds",
      desc: "What used to take expert consultations now happens in under 2 seconds. Field-to-fix instantly.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      metric: "40% less loss",
      title: "Protect your yield",
      desc: "Early AI detection catches diseases 72 hours before visible damage — before losses are unavoidable.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      metric: "24/7 on-call",
      title: "Expert AI always ready",
      desc: "Agronomist-grade knowledge accessible at 3 AM in the middle of a paddy field. No signal, no problem.",
    },
    {
      icon: <Sprout className="w-6 h-6" />,
      metric: "40+ diseases",
      title: "Complete coverage",
      desc: "From blast to sheath rot, brown spot to bacterial blight — all major paddy diseases in one model.",
    },
  ];

  const techLogos = [
    { name: "Google Cloud", icon: <Cpu className="w-4 h-4" /> },
    { name: "Vertex AI", icon: <Brain className="w-4 h-4" /> },
    { name: "Gemini", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Express.js", icon: <SquareStack className="w-4 h-4" /> },
    { name: "React", icon: <Sprout className="w-4 h-4" /> },
    { name: "Firestore", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Google Cloud", icon: <Cpu className="w-4 h-4" /> },
    { name: "Vertex AI", icon: <Brain className="w-4 h-4" /> },
    { name: "Gemini", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Express.js", icon: <SquareStack className="w-4 h-4" /> },
    { name: "React", icon: <Sprout className="w-4 h-4" /> },
    { name: "Firestore", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#fcf9f3",
        color: "#1c1c18",
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      {/* ── NAV ── */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          borderBottom: "1px solid rgba(191,201,193,0.4)",
          backgroundColor: "rgba(252,249,243,0.82)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
                boxShadow: "0 0 16px rgba(15,82,56,0.25)",
              }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span
              style={{
                fontFamily: "'Manrope',sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "-0.02em",
                color: "#0f5238",
              }}
            >
              PadiPro
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              ["How It Works", "#how-it-works"],
              ["Features", "#features"],
              ["Technology", "#technology"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#404943" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#0f5238";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(15,82,56,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#404943";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              fontFamily: "'Manrope',sans-serif",
              background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(15,82,56,0.28)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 6px 24px rgba(15,82,56,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(15,82,56,0.28)";
            }}
          >
            Get Started
          </button>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <main
        ref={heroRef}
        className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden min-h-screen flex items-center"
        style={{ backgroundColor: "#fcf9f3" }}
      >
        {/* Background FX */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Green glow top-left */}
          <div
            className="absolute -top-[10%] -left-[5%] w-150 h-150 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(15,82,56,0.1) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          {/* Orange glow right */}
          <div
            className="absolute top-[20%] -right-[10%] w-100 h-100 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(142,78,20,0.06) 0%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />
          {/* Bottom glow */}
          <div
            className="absolute -bottom-[5%] left-[30%] w-125 h-62.5 rounded-[100%]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(45,106,79,0.07) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(15,82,56,0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Diagonal lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.025]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={i}
                x1={`${i * 12}%`}
                y1="0"
                x2={`${i * 12 + 25}%`}
                y2="100%"
                stroke="#0f5238"
                strokeWidth="1"
              />
            ))}
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            {/* Left copy */}
            <div className="flex flex-col items-start">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
                style={{
                  backgroundColor: "rgba(15,82,56,0.07)",
                  border: "1px solid rgba(15,82,56,0.18)",
                  color: "#0f5238",
                  fontFamily: "'Manrope',sans-serif",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "#2d6a4f" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ backgroundColor: "#0f5238" }}
                  />
                </span>
                Powered by Google Vertex AI + Gemini
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-6 leading-[1.05]"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
                  letterSpacing: "-0.04em",
                  color: "#1c1c18",
                }}
              >
                Your AI Co-Pilot
                <br />
                for{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #0f5238 0%, #2d6a4f 50%, #8e4e14 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Smarter Farming
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: "#404943" }}
              >
                Diagnose crop diseases, forecast field weather, and get expert
                recommendations — all from your phone. Built for real farmers,
                powered by enterprise AI.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10"
              >
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
                    color: "#fff",
                    boxShadow: "0 8px 28px rgba(15,82,56,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 40px rgba(15,82,56,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 28px rgba(15,82,56,0.3)";
                  }}
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="https://www.youtube.com/watch?v=b6Fg12rJNkY&list=LL&index=1"
                  target="_blank"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    color: "#0f5238",
                    border: "1.5px solid rgba(15,82,56,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(15,82,56,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(15,82,56,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(15,82,56,0.25)";
                  }}
                >
                  <Play className="w-4 h-4" /> Watch Demo
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-5"
              >
                {[
                  "No credit card required",
                  "Instant access",
                  "Works on any device",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: "#707973" }}
                  >
                    <CheckCircle2
                      className="w-3.5 h-3.5"
                      style={{ color: "#0f5238" }}
                    />
                    {t}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — chat mockup */}
            <div className="flex justify-center lg:justify-end relative py-8 px-10 lg:px-8">
              <HeroChatMockup />
            </div>
          </div>
        </div>
      </main>

      {/* ── TECH LOGOS BAR ── */}
      <div
        className="py-14 overflow-hidden"
        id="technology"
        style={{ borderTop: "1px solid rgba(191,201,193,0.35)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.22em] mb-8 text-center"
          style={{
            color: "#bfc9c1",
            fontFamily: "'Manrope',sans-serif",
          }}
        >
          Built on enterprise-grade infrastructure
        </p>
        <div className="relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #fcf9f3, transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(270deg, #fcf9f3, transparent)",
            }}
          />
          <motion.div
            className="flex gap-8 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            style={{ width: "max-content" }}
          >
            {techLogos.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl shrink-0 cursor-default transition-all"
                style={{
                  color: "#bfc9c1",
                  border: "1px solid rgba(191,201,193,0.3)",
                  backgroundColor: "rgba(252,249,243,0.6)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#0f5238";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(15,82,56,0.2)";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(15,82,56,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#bfc9c1";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(191,201,193,0.3)";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(252,249,243,0.6)";
                }}
              >
                {t.icon}
                <span
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="py-24 md:py-32"
        style={{ backgroundColor: "#f6f3ed" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
              style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}
            >
              Capabilities
            </p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "'Manrope',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.035em",
                color: "#1c1c18",
              }}
            >
              Built for every farmer.
              <br />
              <span style={{ color: "#707973" }}>
                Powerful enough for enterprise.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 48px rgba(15,82,56,0.1)`,
                }}
                className="group relative rounded-3xl p-7 cursor-default transition-all duration-300"
                style={{
                  backgroundColor: "#fcf9f3",
                  border: "1px solid #e5e2dc",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    `${f.color}30`;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#e5e2dc";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#fcf9f3";
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${f.color}06, transparent 65%)`,
                  }}
                />
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#1c1c18",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#404943" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-24 md:py-32 overflow-hidden"
        style={{ backgroundColor: "#fcf9f3" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                  style={{
                    color: "#8e4e14",
                    fontFamily: "'Manrope',sans-serif",
                  }}
                >
                  How It Works
                </p>
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    letterSpacing: "-0.035em",
                    color: "#1c1c18",
                  }}
                >
                  From field to fix
                  <br />
                  in 3 steps.
                </h2>
                <p
                  className="text-base leading-relaxed mb-10 max-w-md"
                  style={{ color: "#404943" }}
                >
                  No agronomist on speed-dial. No guesswork. Just point, scan,
                  and act — powered by models trained on 100,000+ field samples.
                </p>

                {[
                  {
                    step: "01",
                    title: "Capture",
                    desc: "Point your phone at any affected leaf. Our guided UI ensures optimal image quality even in harsh field conditions.",
                  },
                  {
                    step: "02",
                    title: "Analyse",
                    desc: "Vertex AI runs multi-model ensemble inference — classifying disease, severity, and spread risk simultaneously.",
                  },
                  {
                    step: "03",
                    title: "Act",
                    desc: "Receive a structured treatment plan with chemical recommendations, dosage, and a follow-up monitoring schedule.",
                  },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="flex gap-5 mb-8 last:mb-0"
                  >
                    <div
                      className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(15,82,56,0.08)",
                        border: "1px solid rgba(15,82,56,0.15)",
                        color: "#0f5238",
                        fontFamily: "'Manrope',sans-serif",
                      }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <p
                        className="font-bold mb-1"
                        style={{
                          fontFamily: "'Manrope',sans-serif",
                          color: "#1c1c18",
                        }}
                      >
                        {s.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#404943" }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: scan result card */}
            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm"
                style={{
                  filter: "drop-shadow(0 32px 64px rgba(15,82,56,0.12))",
                }}
              >
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: "rgba(252,249,243,0.97)",
                    border: "1px solid rgba(15,82,56,0.12)",
                  }}
                >
                  {/* Scan image */}
                  <div
                    className="relative h-52 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(160deg, #0f2d18 0%, #071a0d 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(60deg, transparent, transparent 12px, rgba(168,231,197,0.05) 12px, rgba(168,231,197,0.05) 13px)",
                      }}
                    />
                    {/* Disease bounding box */}
                    <div
                      className="absolute"
                      style={{
                        top: "18%",
                        left: "22%",
                        width: "56%",
                        height: "55%",
                        border: "1.5px solid rgba(255,171,105,0.85)",
                        borderRadius: "8px",
                        boxShadow:
                          "0 0 20px rgba(142,78,20,0.3), inset 0 0 20px rgba(142,78,20,0.04)",
                      }}
                    />
                    <div
                      className="absolute px-2 py-1 rounded text-[10px] font-bold text-white"
                      style={{
                        top: "calc(18% - 22px)",
                        left: "22%",
                        backgroundColor: "rgba(142,78,20,0.9)",
                        fontFamily: "'Manrope',sans-serif",
                      }}
                    >
                      Brown Spot — 94.7%
                    </div>
                    {/* Scan line animation */}
                    <motion.div
                      className="absolute left-0 right-0 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(168,231,197,0.85), transparent)",
                      }}
                      animate={{ top: ["0%", "100%"] }}
                      transition={{
                        duration: 2.5,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                    <div
                      className="absolute bottom-2 right-3 text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: "rgba(168,231,197,0.5)" }}
                    >
                      Scanning…
                    </div>
                  </div>

                  {/* Result panel */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p
                          className="font-bold text-base"
                          style={{
                            fontFamily: "'Manrope',sans-serif",
                            color: "#1c1c18",
                          }}
                        >
                          Brown Spot Disease
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#707973" }}
                        >
                          Helminthosporium oryzae
                        </p>
                      </div>
                      <div
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{
                          background: "rgba(142,78,20,0.1)",
                          border: "1px solid rgba(142,78,20,0.2)",
                          color: "#8e4e14",
                          fontFamily: "'Manrope',sans-serif",
                        }}
                      >
                        High Risk
                      </div>
                    </div>
                    {[
                      { label: "Confidence", value: 94.7, color: "#0f5238" },
                      { label: "Severity", value: 72, color: "#8e4e14" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div
                          className="flex justify-between mb-1"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <span style={{ color: "#707973" }}>{bar.label}</span>
                          <span style={{ fontWeight: 700, color: bar.color }}>
                            {bar.value}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ background: "#e5e2dc" }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: bar.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      className="flex items-center gap-2 pt-2"
                      style={{ borderTop: "1px solid #e5e2dc" }}
                    >
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: "#0f5238" }}
                      />
                      <p className="text-xs" style={{ color: "#404943" }}>
                        Treatment plan ready ·{" "}
                        <span style={{ color: "#0f5238", fontWeight: 700 }}>
                          View recommendations →
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#f6f3ed",
          borderTop: "1px solid rgba(191,201,193,0.4)",
          borderBottom: "1px solid rgba(191,201,193,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}
          >
            Proven impact
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4">
            <MetricCard
              value={95}
              suffix="%"
              label="Disease detection accuracy"
              delay={0}
            />
            <MetricCard
              value={2}
              suffix="<"
              label="Seconds average inference"
              delay={0.1}
            />
            <MetricCard
              value={40}
              suffix="+"
              label="Paddy diseases covered"
              delay={0.2}
            />
            <MetricCard
              value={100}
              suffix="K+"
              label="Training dataset images"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── WHY PADIPRO ── */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "#fcf9f3" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
              style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}
            >
              Why PadiPro
            </p>
            <h2
              style={{
                fontFamily: "'Manrope',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.035em",
                color: "#1c1c18",
              }}
            >
              Results that matter
              <br />
              <span style={{ color: "#707973" }}>
                to the people who grow our food.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 16px 48px rgba(15,82,56,0.08)",
                }}
                className="group relative rounded-3xl p-8 cursor-default transition-all"
                style={{
                  backgroundColor: "#fcf9f3",
                  border: "1px solid #e5e2dc",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(15,82,56,0.2)";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#e5e2dc";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#fcf9f3";
                }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(15,82,56,0.08)",
                      color: "#0f5238",
                    }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <div
                      className="text-sm font-bold mb-1"
                      style={{
                        color: "#0f5238",
                        fontFamily: "'Manrope',sans-serif",
                      }}
                    >
                      {b.metric}
                    </div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{
                        fontFamily: "'Manrope',sans-serif",
                        color: "#1c1c18",
                      }}
                    >
                      {b.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#404943" }}
                    >
                      {b.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WEATHER PREVIEW STRIP ── */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#f6f3ed",
          borderTop: "1px solid rgba(191,201,193,0.35)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10 rounded-4xl p-10 md:p-14 overflow-hidden relative"
            style={{
              background: "rgba(15,82,56,0.04)",
              border: "1px solid rgba(15,82,56,0.1)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(15,82,56,0.08), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative z-10 flex-1 text-center md:text-left">
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}
              >
                Weather Intelligence
              </p>
              <h3
                className="mb-3"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  letterSpacing: "-0.03em",
                  color: "#1c1c18",
                }}
              >
                Know before the storm hits.
              </h3>
              <p className="text-base max-w-md" style={{ color: "#404943" }}>
                Hyper-local agricultural forecasts with crop-specific alerts.
                Optimal spray windows. Irrigation triggers. All automated.
              </p>
            </div>

            {/* Weather mini-cards */}
            <div className="relative z-10 flex gap-3">
              {[
                {
                  icon: (
                    <Sun className="w-6 h-6" style={{ color: "#8e4e14" }} />
                  ),
                  day: "Today",
                  temp: "31°",
                  desc: "Sunny",
                },
                {
                  icon: (
                    <Cloud className="w-6 h-6" style={{ color: "#404943" }} />
                  ),
                  day: "Tomorrow",
                  temp: "28°",
                  desc: "Overcast",
                },
                {
                  icon: (
                    <CloudRain
                      className="w-6 h-6"
                      style={{ color: "#0369a1" }}
                    />
                  ),
                  day: "Wed",
                  temp: "24°",
                  desc: "Rain",
                },
              ].map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex flex-col items-center gap-2 px-4 py-5 rounded-2xl"
                  style={{
                    background: "rgba(252,249,243,0.9)",
                    border: "1px solid rgba(15,82,56,0.1)",
                    minWidth: "80px",
                  }}
                >
                  {w.icon}
                  <div
                    className="font-bold text-xl"
                    style={{
                      fontFamily: "'Manrope',sans-serif",
                      color: "#1c1c18",
                    }}
                  >
                    {w.temp}
                  </div>
                  <div
                    className="text-[10px] font-semibold text-center"
                    style={{ color: "#707973", lineHeight: 1.3 }}
                  >
                    {w.day}
                    <br />
                    {w.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 md:py-36"
        style={{ backgroundColor: "#fcf9f3" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[2.5rem] overflow-hidden px-10 py-20 md:px-20 md:py-24 text-center"
            style={{
              background:
                "linear-gradient(135deg, #0a3d28 0%, #0f5238 45%, #1a6644 100%)",
              boxShadow: "0 32px 80px rgba(15,82,56,0.28)",
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(168,231,197,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Top glow line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(168,231,197,0.6), transparent)",
              }}
            />
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(168,231,197,0.12) 0%, transparent 65%)",
                filter: "blur(20px)",
              }}
            />

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-8 mx-auto"
                style={{
                  background: "rgba(168,231,197,0.2)",
                  border: "1px solid rgba(168,231,197,0.3)",
                  boxShadow: "0 0 32px rgba(168,231,197,0.15)",
                }}
              >
                <Leaf className="w-7 h-7 text-white" />
              </motion.div>

              <h2
                className="mb-5"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "-0.035em",
                  color: "#fff",
                }}
              >
                Ready to protect
                <br />
                your harvest?
              </h2>

              <p
                className="text-lg mb-12 max-w-lg mx-auto"
                style={{ color: "rgba(168,231,197,0.75)" }}
              >
                Join forward-thinking farmers using AI to catch diseases early,
                cut chemical waste, and maximise yield every season.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    backgroundColor: "#fcf9f3",
                    color: "#0f5238",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 36px rgba(0,0,0,0.28)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 24px rgba(0,0,0,0.18)";
                  }}
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="https://www.youtube.com/watch?v=b6Fg12rJNkY&list=LL&index=1"
                  target="_blank"
                  className="flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    color: "rgba(168,231,197,0.9)",
                    border: "1.5px solid rgba(168,231,197,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(168,231,197,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(168,231,197,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(168,231,197,0.25)";
                  }}
                >
                  <Play className="w-4 h-4" /> Watch Demo
                </a>
              </div>

              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs"
                style={{ color: "rgba(168,231,197,0.5)" }}
              >
                {[
                  "No credit card required",
                  "Instant access",
                  "Works on any device",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2
                      className="w-3.5 h-3.5"
                      style={{ color: "rgba(168,231,197,0.6)" }}
                    />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-10"
        style={{
          borderTop: "1px solid #e5e2dc",
          backgroundColor: "#f0eee8",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
                }}
              >
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <span
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  color: "#0f5238",
                }}
              >
                PadiPro
              </span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="transition-colors"
                  style={{ color: "#707973" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#0f5238";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#707973";
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs"
            style={{ color: "#bfc9c1" }}
          >
            <p>© {new Date().getFullYear()} PadiPro AI. All rights reserved.</p>
            <p>Cultivating precision agriculture with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
