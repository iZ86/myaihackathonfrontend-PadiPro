import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileText, ExternalLink } from "lucide-react";
import type { HistoryItem } from "@datatypes/historyType";
import { useLanguage } from "@context/lang/useLanguage";
import type { Language } from "@config/translations";
import DocumentViewer from "./DocumentViewer";

const SCIENTIFIC_NAMES: Record<string, string> = {
  "BROWN SPOT": "Bipolaris oryzae",
  BLAST: "Magnaporthe oryzae",
  "BACTERIAL BLIGHT": "Xanthomonas oryzae pv. oryzae",
  "SHEATH BLIGHT": "Rhizoctonia solani",
  "STEM ROT": "Sclerotium oryzae",
  TUNGRO: "Rice tungro virus complex",
  "NARROW BROWN LEAF SPOT": "Cercospora janseana",
  HEALTHY: "Oryza sativa",
};

const formatDate = (isoString: string, language: Language) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(language === "bm" ? "ms-MY" : "en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
};

const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  const n = parseFloat(v as string);
  return isNaN(n) ? 0 : n;
};

const getDetectionMeta = (
  d: { disease: string; severity: number; score: number },
  language: Language,
) => {
  const isHighRisk = d.severity > 0.5;
  const isHealthy = d.disease === "HEALTHY";
  const isUnknown = d.disease === "Unknown";

  const name = isHealthy
    ? language === "bm"
      ? "Tanaman Sihat"
      : "Healthy Crop"
    : isUnknown
      ? language === "bm"
        ? "Tidak Diketahui"
        : "Unknown"
      : d.disease.charAt(0) + d.disease.slice(1).toLowerCase();

  const sciName =
    SCIENTIFIC_NAMES[d.disease.toUpperCase()] || "Species undetermined";

  const riskLabel = isHealthy
    ? language === "bm"
      ? "SIHAT"
      : "HEALTHY"
    : isUnknown
      ? language === "bm"
        ? "TIDAK DIKETAHUI"
        : "UNKNOWN"
      : isHighRisk
        ? language === "bm"
          ? "RISIKO TINGGI"
          : "HIGH RISK"
        : language === "bm"
          ? "SEDERHANA"
          : "MODERATE";

  const riskStyle = isHealthy
    ? { bg: "rgba(15,82,56,0.1)", text: "#0f5238" }
    : isUnknown
      ? { bg: "rgba(156,163,175,0.12)", text: "#6b7280" }
      : isHighRisk
        ? { bg: "rgba(220,38,38,0.12)", text: "#b91c1c" }
        : { bg: "rgba(194,65,12,0.1)", text: "#c2410c" };

  const severityBarColor = isHighRisk
    ? "linear-gradient(90deg,#c2410c,#dc2626)"
    : isHealthy
      ? "linear-gradient(90deg,#0f5238,#2d6a4f)"
      : "linear-gradient(90deg,#8e4e14,#c2410c)";

  return {
    name,
    sciName,
    riskLabel,
    riskStyle,
    severityBarColor,
    isHighRisk,
    isHealthy,
    isUnknown,
    confidencePct: Math.round(toNum(d.score) * 100),
    severityPct: Math.round(toNum(d.severity) * 100),
  };
};

interface Props {
  item: HistoryItem;
  recentItems?: HistoryItem[];
}

export default function HistoryDetailCard({ item, recentItems = [] }: Props) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeDocUrl, setActiveDocUrl] = useState(item.document ?? "");

  const openViewer = (url: string) => {
    setActiveDocUrl(url);
    setViewerOpen(true);
  };

  const detections = item.detections ?? [];

  // Show "healthy" block only if every detection is healthy
  const allHealthy =
    detections.length > 0 && detections.every((d) => d.disease === "HEALTHY");

  return (
    <>
      {/* Back nav */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 mt-2 cursor-pointer group"
        style={{ color: "#0f5238", fontFamily: "'Manrope', sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold">
          {t.historyDetail.backToHistory}
        </span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2"
          style={{ color: "#8e4e14", fontFamily: "'Manrope', sans-serif" }}
        >
          {t.historyDetail.sectionLabel}
        </p>
        <h1
          className="leading-tight"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
            letterSpacing: "-0.035em",
            color: "#1c1c18",
          }}
        >
          {t.historyDetail.treatmentLabel}
          <br />
          <span style={{ color: "#0f5238" }}>
            {language === "bm" ? "Pelan" : "Plan"}
          </span>
        </h1>
        <p className="text-sm mt-2" style={{ color: "#707973" }}>
          {formatDate(item.created_at, language)}
        </p>
      </motion.div>

      {/* Scan image + disease card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-3xl overflow-hidden mb-8"
        style={{ backgroundColor: "#fff", border: "1px solid #e5e2dc" }}
      >
        {/* Full-width scan image/video */}
        <div className="w-full h-52 overflow-hidden">
          {item.download_url?.includes("/videos/") ? (
            <video
              src={item.download_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={item.download_url}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Detection rows — one per disease found in this scan */}
        {detections.map((d, di) => {
          const meta = getDetectionMeta(d, language);
          return (
            <div key={di}>
              {di > 0 && (
                <div
                  className="mx-5 my-1"
                  style={{ borderTop: "1px dashed #f0ede8" }}
                />
              )}
              <div className="px-5 pt-4 pb-2">
                {/* Disease name + badge */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p
                      className="font-extrabold"
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: "1.05rem",
                        letterSpacing: "-0.02em",
                        color: "#1c1c18",
                      }}
                    >
                      {meta.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "#9ca3af", fontStyle: "italic" }}
                    >
                      {meta.sciName}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 mt-0.5"
                    style={{
                      backgroundColor: meta.riskStyle.bg,
                      color: meta.riskStyle.text,
                      fontFamily: "'Manrope', sans-serif",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {meta.riskLabel}
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="mt-4 mb-3">
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color: "#707973",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {t.history.confidence}
                    </span>
                    <span
                      className="text-[11px] font-extrabold"
                      style={{
                        color: "#1c1c18",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {meta.confidencePct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#f0ede8" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.confidencePct}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.3 + di * 0.15,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg,#0f5238,#2d6a4f)",
                      }}
                    />
                  </div>
                </div>

                {/* Severity bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color: "#707973",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {t.history.severity}
                    </span>
                    <span
                      className="text-[11px] font-extrabold"
                      style={{
                        color: "#1c1c18",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {meta.severityPct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#f0ede8" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.severityPct}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.45 + di * 0.15,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{ background: meta.severityBarColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Accuracy badge — bottom of card */}
        <div
          className="flex items-center gap-1.5 text-[11px] font-bold px-5 py-4"
          style={{
            borderTop: "1px solid #f0ede8",
            color: "#0f5238",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.historyDetail.modelAccuracy}
        </div>
      </motion.div>

      {/* Document Report Card */}
      {item.document ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 rounded-3xl overflow-hidden"
          style={{ border: "1px solid #e5e2dc", background: "#fff" }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              borderBottom: "1px solid #f0ede8",
              background: "rgba(15,82,56,0.03)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(15,82,56,0.10)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#0f5238" }} />
              </div>
              <div>
                <p
                  className="font-extrabold text-sm"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#1c1c18",
                  }}
                >
                  Diagnostic Report
                </p>
                <p className="text-[11px]" style={{ color: "#9ca3af" }}>
                  {item.document
                    .split("?")[0]
                    .split("/")
                    .pop()
                    ?.split(".")
                    .pop()
                    ?.toUpperCase() ?? "DOC"}{" "}
                  · Generated report available
                </p>
              </div>
            </div>
            <a
              href={item.document}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors"
              style={{ color: "#707973" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="px-5 py-4">
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: "#707973", fontFamily: "'Manrope', sans-serif" }}
            >
              A detailed diagnostic report has been generated for this scan.
              View the full analysis including disease progression data and
              treatment recommendations.
            </p>
            <button
              onClick={() => openViewer(item.document!)}
              className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
                boxShadow: "0 6px 20px rgba(15,82,56,0.25)",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              <FileText className="w-4 h-4" />
              View Report
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mb-8 rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{
            background: "rgba(15,82,56,0.04)",
            border: "1px dashed rgba(15,82,56,0.15)",
          }}
        >
          <FileText className="w-4 h-4 shrink-0" style={{ color: "#9ca3af" }} />
          <p
            className="text-xs"
            style={{ color: "#9ca3af", fontFamily: "'Manrope', sans-serif" }}
          >
            No diagnostic report attached to this scan.
          </p>
        </motion.div>
      )}

      {/* Healthy result */}
      {allHealthy && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-3xl text-center"
          style={{
            backgroundColor: "rgba(15,82,56,0.06)",
            border: "1px solid rgba(15,82,56,0.15)",
          }}
        >
          <CheckCircle2
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#0f5238" }}
          />
          <p
            className="font-extrabold text-xl mb-2"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#1c1c18",
              letterSpacing: "-0.02em",
            }}
          >
            {t.historyDetail.cropHealthy}
          </p>
          <p className="text-sm" style={{ color: "#707973" }}>
            {t.historyDetail.cropHealthyDesc}
          </p>
        </motion.div>
      )}

      <div className="h-12" />

      {/* Document Viewer Portal */}
      <DocumentViewer
        url={activeDocUrl}
        isOpen={viewerOpen && !!activeDocUrl}
        onClose={() => setViewerOpen(false)}
        item={item}
        recentItems={recentItems}
        onSelectItem={(ri) => {
          if (ri.document) setActiveDocUrl(ri.document);
        }}
      />
    </>
  );
}
