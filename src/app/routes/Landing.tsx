"use client";

import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react";
import {
  ScanLine, Zap, TrendingUp, CloudCog, FileText, Play,
  CheckCircle2, Leaf, Cpu, ShieldCheck, ArrowRight,
  Microscope, BarChart3, AlertTriangle, Sprout, ChevronRight,
  SquareStack,
  Brain
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

/* ─── Animated counter hook ─────────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── Mock AI scan card ──────────────────────────────────────── */
function AIScanCard() {
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setScanning(false), 2200);
    const t2 = setTimeout(() => setDetected(true), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto"
      style={{ filter: "drop-shadow(0 32px 64px rgba(15,82,56,0.18))" }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(252,249,243,0.95)",
          border: "1px solid rgba(15,82,56,0.12)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Card header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(15,82,56,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0f5238,#2d6a4f)" }}>
              <Microscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#1c1c18" }}>PadiPro Scan</p>
              <p style={{ fontSize: "0.68rem", color: "#707973" }}>Live Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: scanning ? "#8e4e14" : "#0f5238" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: scanning ? "#8e4e14" : "#0f5238" }} />
            </span>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: scanning ? "#8e4e14" : "#0f5238" }}>
              {scanning ? "Scanning…" : "Complete"}
            </span>
          </div>
        </div>

        {/* Crop image area */}
        <div className="relative h-44 overflow-hidden" style={{ backgroundColor: "#e8f5ee" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 50%, #2d6a4f 0%, #0f5238 40%, #1a3d2a 100%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 9px)" }} />

          <AnimatePresence>
            {scanning && (
              <motion.div
                className="absolute left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, rgba(168,231,197,0.9), transparent)" }}
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {scanning && (
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(rgba(168,231,197,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,231,197,0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }} />
          )}

          <AnimatePresence>
            {detected && (
              <motion.div
                className="absolute"
                style={{ top: "20%", left: "25%", width: "50%", height: "55%" }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ width: "100%", height: "100%", border: "2px solid rgba(255,171,105,0.9)", borderRadius: "8px", boxShadow: "0 0 20px rgba(142,78,20,0.4), inset 0 0 20px rgba(142,78,20,0.05)" }} />
                {[{ top: -2, left: -2 }, { top: -2, right: -2 }, { bottom: -2, left: -2 }, { bottom: -2, right: -2 }].map((pos, i) => (
                  <div key={i} className="absolute w-3 h-3" style={{ ...pos, border: "2px solid #ffab69", borderRadius: "2px" }} />
                ))}
                <div className="absolute -top-7 left-0" style={{ backgroundColor: "rgba(142,78,20,0.9)", borderRadius: "4px", padding: "2px 8px", fontSize: "0.62rem", fontWeight: 700, color: "#fff", fontFamily: "'Manrope',sans-serif", whiteSpace: "nowrap" }}>
                  Brown Spot — 94.7%
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div className="px-5 py-4 space-y-3">
          <AnimatePresence>
            {detected ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#1c1c18" }}>Brown Spot Disease</p>
                  <p style={{ fontSize: "0.68rem", color: "#707973" }}>Helminthosporium oryzae</p>
                </div>
                <div style={{ backgroundColor: "rgba(142,78,20,0.1)", border: "1px solid rgba(142,78,20,0.2)", borderRadius: "999px", padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}>
                  High Risk
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                {[{ w: "70%" }, { w: "50%" }].map((s, i) => (
                  <div key={i} className="h-3 rounded animate-pulse" style={{ width: s.w, backgroundColor: "#e5e2dc" }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {detected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-1.5">
                {[{ label: "Confidence", value: 94.7, color: "#0f5238" }, { label: "Severity", value: 72, color: "#8e4e14" }].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between mb-0.5" style={{ fontSize: "0.65rem", color: "#707973" }}>
                      <span>{bar.label}</span>
                      <span style={{ fontWeight: 700, color: bar.color }}>{bar.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: "#e5e2dc" }}>
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: bar.color }} initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {detected && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-2" style={{ borderTop: "1px solid #e5e2dc", paddingTop: "10px" }}>
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#0f5238" }} />
                <p style={{ fontSize: "0.68rem", color: "#404943" }}>
                  Treatment plan ready · <span style={{ color: "#0f5238", fontWeight: 700 }}>View recommendations →</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating pills */}
      <motion.div
        className="absolute -left-8 top-1/3 rounded-2xl px-3 py-2 flex items-center gap-2"
        style={{ background: "rgba(252,249,243,0.95)", border: "1px solid rgba(15,82,56,0.12)", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(15,82,56,0.12)" }}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Zap className="w-3.5 h-3.5" style={{ color: "#8e4e14" }} />
        <span style={{ fontSize: "0.7rem", fontWeight: 700, fontFamily: "'Manrope',sans-serif", color: "#1c1c18" }}>1.4s inference</span>
      </motion.div>

      <motion.div
        className="absolute -right-6 bottom-1/4 rounded-2xl px-3 py-2 flex items-center gap-2"
        style={{ background: "rgba(252,249,243,0.95)", border: "1px solid rgba(15,82,56,0.12)", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(15,82,56,0.12)" }}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
      >
        <BarChart3 className="w-3.5 h-3.5" style={{ color: "#0f5238" }} />
        <span style={{ fontSize: "0.7rem", fontWeight: 700, fontFamily: "'Manrope',sans-serif", color: "#1c1c18" }}>95% accuracy</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Metric card ────────────────────────────────────────────── */
function MetricCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1600, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(15,82,56,0.1)" }}
      className="text-center px-6 py-8 rounded-3xl relative overflow-hidden group cursor-default"
      style={{ background: "rgba(252,249,243,0.7)", border: "1px solid rgba(15,82,56,0.1)", backdropFilter: "blur(12px)" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at center top, rgba(15,82,56,0.05), transparent 70%)" }} />
      <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ fontFamily: "'Manrope',sans-serif", color: "#0f5238", letterSpacing: "-0.04em" }}>
        {suffix === "<" ? `<${count}s` : `${count}${suffix}`}
      </div>
      <p className="text-sm" style={{ color: "#707973" }}>{label}</p>
    </motion.div>
  );
}

/* ─── Main Landing ───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const features = [
    { icon: <ScanLine className="w-5 h-5" />, title: "Real-Time Disease Detection", desc: "Computer vision models identify 40+ paddy diseases from a single photo with clinical-grade precision.", color: "#0f5238" },
    { icon: <Cpu className="w-5 h-5" />, title: "AI Treatment Engine", desc: "Generative AI builds step-by-step agronomic treatment plans tailored to your crop's specific condition.", color: "#0f5238" },
    { icon: <CloudCog className="w-5 h-5" />, title: "Vertex AI Infrastructure", desc: "Serverless, auto-scaling inference on Google Cloud — zero cold starts even at peak harvest season.", color: "#8e4e14" },
    { icon: <Zap className="w-5 h-5" />, title: "Sub-2s Results", desc: "Optimised model serving delivers full diagnostic reports in under two seconds, directly on-device.", color: "#8e4e14" },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Yield Risk Forecasting", desc: "Predictive analytics surface early warning signals before visible symptoms appear, minimising loss.", color: "#0f5238" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Enterprise-Grade Privacy", desc: "End-to-end encryption and on-prem options ensure your farm data never leaves your control.", color: "#0f5238" },
  ];

  const steps = [
    { step: "01", icon: <ScanLine className="w-5 h-5" style={{ color: "#0f5238" }} />, title: "Capture", desc: "Point your phone at any affected leaf. Our guided UI ensures optimal image quality even in field conditions." },
    { step: "02", icon: <CloudCog className="w-5 h-5" style={{ color: "#0f5238" }} />, title: "Analyse", desc: "Vertex AI runs multi-model ensemble inference — classifying disease, severity, and spread risk simultaneously." },
    { step: "03", icon: <FileText className="w-5 h-5" style={{ color: "#0f5238" }} />, title: "Act", desc: "Receive a structured report with chemical recommendations, dosage, and a follow-up monitoring schedule." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#fcf9f3", color: "#1c1c18", fontFamily: "'Work Sans', sans-serif" }}>

      {/* ── HEADER ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ borderBottom: "1px solid rgba(191,201,193,0.4)", backgroundColor: "rgba(252,249,243,0.82)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0f5238,#2d6a4f)", boxShadow: "0 0 16px rgba(15,82,56,0.3)" }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <a href="/">
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "#0f5238" }}>PadiPro</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {["How it works", "Features", "Technology"].map((item) => (
              <a href={item === "How it works" ? "#how-it-works" : item === "Features" ? "#features" : "#technology"} key={item} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ color: "#404943" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = "rgba(15,82,56,0.06)"; (e.target as HTMLElement).style.color = "#0f5238"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = "transparent"; (e.target as HTMLElement).style.color = "#404943"; }}>
                {item}
              </a>
            ))}
          </nav>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Manrope',sans-serif", backgroundColor: "#0f5238", color: "#fff", boxShadow: "0 4px 16px rgba(15,82,56,0.28)" }}
          >
            Log In <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <main ref={heroRef} className="relative pt-32 pb-20 xl:pt-0 md:pb-28 overflow-hidden min-h-screen flex items-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(15,82,56,0.1) 0%, transparent 65%)", filter: "blur(40px)" }} />
          <div className="absolute top-[30%] -right-[5%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(142,78,20,0.07) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute -bottom-[10%] left-[20%] w-[800px] h-[400px] rounded-[100%]" style={{ background: "radial-gradient(ellipse, rgba(45,106,79,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(15,82,56,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={`${i * 15}%`} y1="0" x2={`${i * 15 + 30}%`} y2="100%" stroke="#0f5238" strokeWidth="1" />
            ))}
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left copy */}
            <div className="flex flex-col items-start">
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
                style={{ backgroundColor: "rgba(15,82,56,0.07)", border: "1px solid rgba(15,82,56,0.18)", color: "#0f5238", fontFamily: "'Manrope',sans-serif" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#2d6a4f" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#0f5238" }} />
                </span>
                Powered by Google Vertex AI
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 leading-[1.06]"
                style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 5.5vw, 4rem)", letterSpacing: "-0.035em", color: "#1c1c18" }}
              >
                AI That Detects<br />
                Paddy Diseases{" "}
                <span className="relative inline-block">
                  <span style={{ background: "linear-gradient(135deg, #0f5238 0%, #2d6a4f 50%, #8e4e14 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    in Seconds.
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full" style={{ background: "linear-gradient(90deg, #0f5238, #8e4e14)" }} />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: "#404943" }}
              >
                Upload a photo of your crop. Our enterprise-grade vision model identifies diseases, pests, and nutrient deficiencies with 95% accuracy — and generates a treatment plan instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12"
              >
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 px-7 py-4 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ fontFamily: "'Manrope',sans-serif", backgroundColor: "#0f5238", color: "#fff", boxShadow: "0 6px 28px rgba(15,82,56,0.32)" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 36px rgba(15,82,56,0.48)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 6px 28px rgba(15,82,56,0.32)")}
                >
                  <span>Start Detection Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  target="_blank"
                  href="https://www.youtube.com/watch?v=b6Fg12rJNkY&list=LL&index=1"
                  className="flex items-center gap-2 px-7 py-4 rounded-full text-base font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ fontFamily: "'Manrope',sans-serif", color: "#0f5238", border: "1.5px solid rgba(15,82,56,0.25)", backgroundColor: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(15,82,56,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(15,82,56,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(15,82,56,0.25)"; }}
                >
                  <Play className="w-4 h-4" /> View Demo
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="flex flex-wrap items-center gap-5">
                {[
                  { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "No credit card required" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "Instant access" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "AI-assisted farming insights" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm" style={{ color: "#707973" }}>
                    <span style={{ color: "#0f5238" }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — scan card */}
            <div className="flex justify-center lg:justify-end relative py-8 pr-8">
              <AIScanCard />
            </div>
          </div>
        </div>
      </main>

      {/* ── TECH TRUST BAR ── */}
      <div className="overflow-hidden py-20 md:py-28" id="technology">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-center" style={{ color: "#bfc9c1", fontFamily: "'Manrope',sans-serif" }}>
          Built on enterprise-grade infrastructure
        </p>

        {/* Infinite carousel */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #f6f3ed, transparent)" }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(270deg, #f6f3ed, transparent)" }} />

          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            style={{ width: "max-content" }}
          >
            {/* Duplicate the list twice for seamless loop */}
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-12 items-center">
                {[
                  { name: "Google Cloud", icon: <CloudCog className="w-4 h-4" /> },
                  { name: "Vertex AI", icon: <Cpu className="w-4 h-4" /> },
                  { name: "Gemini", icon: <Brain className="w-4 h-4" /> },
                  { name: "ExpressJS", icon: <SquareStack className="w-4 h-4" /> },
                  { name: "React", icon: <Sprout className="w-4 h-4" /> },
                  { name: "Google Cloud", icon: <CloudCog className="w-4 h-4" /> },
                  { name: "Vertex AI", icon: <Cpu className="w-4 h-4" /> },
                  { name: "Gemini", icon: <Brain className="w-4 h-4" /> },
                  { name: "ExpressJS", icon: <SquareStack className="w-4 h-4" /> },
                  { name: "React", icon: <Sprout className="w-4 h-4" /> },
                ].map((t, i) => (
                  <div
                    key={`${setIdx}-${i}`}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-2xl flex-shrink-0 transition-colors duration-200 cursor-default"
                    style={{
                      color: "#bfc9c1",
                      border: "1px solid rgba(191,201,193,0.3)",
                      backgroundColor: "rgba(252,249,243,0.6)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "#0f5238";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(15,82,56,0.2)";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(15,82,56,0.04)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "#bfc9c1";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,201,193,0.3)";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(252,249,243,0.6)";
                    }}
                  >
                    {t.icon}
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap" }}>{t.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── METRICS ── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(15,82,56,0.04), transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm font-bold uppercase tracking-widest mb-12" style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}>
            Proven impact
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <MetricCard value={95} suffix="%" label="Disease detection accuracy" delay={0} />
            <MetricCard value={2} suffix="<" label="Seconds average inference time" delay={0.1} />
            <MetricCard value={100000} suffix="+" label="Training dataset images" delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 md:py-28" style={{ backgroundColor: "#f6f3ed" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}>Capabilities</p>
            <h2 className="mb-4" style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,3rem)", letterSpacing: "-0.028em", color: "#1c1c18" }}>
              Powerful. Precise. Professional.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#404943" }}>
              Every capability is purpose-built for the realities of field agriculture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: "easeOut" }}
                whileHover={{ y: -5, boxShadow: `0 20px 48px ${f.color}16` }}
                className="group relative rounded-3xl p-8 cursor-default transition-all duration-300"
                style={{ backgroundColor: "#fcf9f3", border: "1px solid #e5e2dc" }}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ border: `1px solid ${f.color}30`, background: `radial-gradient(ellipse at top left, ${f.color}06, transparent 70%)` }} />
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${f.color}10`, border: `1px solid ${f.color}20`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="mb-3" style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1c1c18" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#404943" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28 relative overflow-hidden" id="how-it-works">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(15,82,56,0.03), transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}>Workflow</p>
            <h2 style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,3rem)", letterSpacing: "-0.028em", color: "#1c1c18" }}>
              From field to fix in 3 steps.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, #bfc9c1 20%, #bfc9c1 80%, transparent)" }} />

            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: "#fcf9f3", border: "1.5px solid #bfc9c1", boxShadow: "0 4px 24px rgba(15,82,56,0.08)" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(15,82,56,0.07)" }}>
                    {s.icon}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#8e4e14", fontFamily: "'Manrope',sans-serif" }}>{s.step}</p>
                  <h3 className="mb-3" style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1c1c18" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed max-w-[260px] mx-auto" style={{ color: "#404943" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT BANNER ── */}
      <section className="py-12" style={{ backgroundColor: "#f6f3ed" }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-6 rounded-3xl px-8 py-7"
            style={{ background: "rgba(142,78,20,0.05)", border: "1px solid rgba(142,78,20,0.15)" }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(142,78,20,0.12)" }}>
              <AlertTriangle className="w-6 h-6" style={{ color: "#8e4e14" }} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-bold mb-1" style={{ fontFamily: "'Manrope',sans-serif", color: "#1c1c18" }}>
                Early detection saves up to 40% of crop yield
              </p>
              <p className="text-sm" style={{ color: "#707973" }}>
                Most disease damage is preventable when caught in the first 48 hours. PadiPro gives you the edge.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 cursor-pointer"
              style={{ fontFamily: "'Manrope',sans-serif", backgroundColor: "#8e4e14", color: "#fff", boxShadow: "0 4px 16px rgba(142,78,20,0.28)" }}
            >
              Try it now <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-24 text-center"
            style={{ background: "linear-gradient(135deg, #0a3d28 0%, #0f5238 45%, #1a6644 100%)", boxShadow: "0 32px 80px rgba(15,82,56,0.28)" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(168,231,197,0.6), transparent)" }} />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(168,231,197,0.12) 0%, transparent 65%)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(168,231,197,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "rgba(168,231,197,0.6)", fontFamily: "'Manrope',sans-serif" }}>Start today</p>
              <h2 className="mb-6" style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3.6rem)", letterSpacing: "-0.032em", color: "#fff" }}>
                Ready to protect your harvest?
              </h2>
              <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: "rgba(168,231,197,0.75)" }}>
                Join the farmers and agronomists using AI to catch diseases early, reduce chemical waste, and maximise yield season after season.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95"
                  style={{ fontFamily: "'Manrope',sans-serif", backgroundColor: "#fcf9f3", color: "#0f5238", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 36px rgba(0,0,0,0.28)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)")}
                >
                  Start Detection Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
                  style={{ fontFamily: "'Manrope',sans-serif", color: "rgba(168,231,197,0.9)", border: "1.5px solid rgba(168,231,197,0.25)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,231,197,0.5)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(168,231,197,0.06)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,231,197,0.25)"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <Play className="w-4 h-4" /> View Demo
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6" style={{ color: "rgba(168,231,197,0.5)", fontSize: "0.8rem" }}>
                {["No credit card required", "Instant access", "AI-assisted farming insights"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "rgba(168,231,197,0.6)" }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pt-12 pb-8" style={{ borderTop: "1px solid #e5e2dc", backgroundColor: "#f0eee8" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0f5238,#2d6a4f)" }}>
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em", color: "#0f5238" }}>PadiPro</span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
                <a key={l} href="#" style={{ color: "#707973" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#0f5238")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "#707973")}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs" style={{ color: "#bfc9c1" }}>
            <p>© {new Date().getFullYear()} PadiPro AI. All rights reserved.</p>
            <p>Built for modern agriculture.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
