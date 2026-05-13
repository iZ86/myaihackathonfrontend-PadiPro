import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  Loader2,
  AlertCircle,
  Leaf,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDiagnosisHistoryAPI } from "@features/user/api/users";
import type { HistoryItem } from "@datatypes/historyType";
import { useAuth } from "@context/auth/useAuth";
import { useLanguage } from "@context/lang/useLanguage";

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

const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  const n = parseFloat(v as string);
  return isNaN(n) ? 0 : n;
};

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      " • " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch (e) {
    console.error("Date parsing error:", e);
    return isoString;
  }
};

const normalizeDetections = (item: HistoryItem) => {
  if (item.detections && item.detections.length > 0) {
    // Coerce severity and score to numbers — backend sometimes sends strings
    return item.detections.map((d) => ({
      ...d,
      severity: toNum(d.severity),
      score: toNum(d.score),
    }));
  }

  if (item.diagnosis) {
    return [
      {
        disease: item.diagnosis,
        severity: toNum(item.severity),
        score: 0,
      },
    ];
  }

  return [{ disease: "Unknown", severity: 0, score: 0 }];
};

export default function HistoryCard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "healthy">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDiagnosisMetadata = useCallback(
    (detection: { disease: string; severity: number; score: number }) => {
      if (detection.disease === "Unknown") {
        return {
          title: "Unknown",
          sciName: "Species undetermined",
          riskLabel: "UNKNOWN",
          dot: "#9ca3af",
          bg: "rgba(156,163,175,0.12)",
          text: "#6b7280",
          severityColor: "#9ca3af",
          showPlan: false,
        };
      }

      if (detection.disease === "HEALTHY") {
        return {
          title: "Healthy Crop",
          sciName: SCIENTIFIC_NAMES["HEALTHY"],
          riskLabel: "HEALTHY",
          dot: "#0f5238",
          bg: "rgba(15,82,56,0.1)",
          text: "#0f5238",
          severityColor: "#0f5238",
          showPlan: false,
        };
      }

      const isHighRisk = detection.severity > 0.5;
      const diseaseName =
        detection.disease.charAt(0) + detection.disease.slice(1).toLowerCase();

      return {
        title: diseaseName,
        sciName:
          SCIENTIFIC_NAMES[detection.disease.toUpperCase()] ||
          "Species undetermined",
        riskLabel: isHighRisk ? "HIGH RISK" : "MODERATE",
        dot: isHighRisk ? "#dc2626" : "#c2410c",
        bg: isHighRisk ? "rgba(220,38,38,0.1)" : "rgba(194,65,12,0.1)",
        text: isHighRisk ? "#b91c1c" : "#c2410c",
        severityColor: isHighRisk
          ? "linear-gradient(90deg,#c2410c,#dc2626)"
          : "linear-gradient(90deg,#8e4e14,#c2410c)",
        showPlan: true,
      };
    },
    [],
  );

  const getDatas = useCallback(
    async (token: string, mobileNo: string) => {
      setLoading(true);
      setError(null);
      try {
        const historyResponse = await getDiagnosisHistoryAPI(token, mobileNo);

        if (!historyResponse?.ok) {
          throw new Error(t.history.syncInterrupted);
        }

        const historyJson = await historyResponse.json();

        if (historyJson.success) {
          const augmentedData = historyJson.data.map((item: HistoryItem) => ({
            ...item,
            detections: normalizeDetections(item),
          }));
          setHistoryItems(augmentedData);
        } else {
          setError(t.history.failedToLoad);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t.history.failedToLoad);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    if (!user || !user.mobile_no) return;
    getDatas("randomToken", user.mobile_no);
  }, [getDatas, user]);

  const filteredItems = historyItems.filter((item) => {
    const detections = item.detections || [];
    if (activeFilter === "all") return true;
    if (activeFilter === "healthy")
      return detections.some((d) => d.disease === "HEALTHY");
    if (activeFilter === "high")
      return detections.some((d) => d.severity > 0.5);
    return true;
  });

  const healthPct =
    historyItems.length > 0
      ? Math.round(
          (historyItems.filter((i) =>
            i.detections.some((d) => d.disease === "HEALTHY"),
          ).length /
            historyItems.length) *
            100,
        )
      : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(15,82,56,0.08)" }}
        >
          <Loader2
            className="w-7 h-7 animate-spin"
            style={{ color: "#0f5238" }}
          />
        </div>
        <p
          className="text-sm font-bold uppercase tracking-[0.15em] animate-pulse"
          style={{ color: "#707973", fontFamily: "'Manrope', sans-serif" }}
        >
          {t.history.loadingHistory}
        </p>
      </div>
    );
  }

  if (error || !historyItems) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center py-12 rounded-3xl"
        style={{
          backgroundColor: "rgba(220,38,38,0.04)",
          border: "1.5px dashed rgba(220,38,38,0.2)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(220,38,38,0.08)" }}
        >
          <AlertCircle className="w-7 h-7" style={{ color: "#dc2626" }} />
        </div>
        <h2
          className="font-extrabold text-xl"
          style={{
            fontFamily: "'Manrope', sans-serif",
            color: "#1c1c18",
            letterSpacing: "-0.02em",
          }}
        >
          {t.history.syncInterrupted}
        </h2>
        <p className="text-sm max-w-60" style={{ color: "#707973" }}>
          {error || t.history.noRecords}
        </p>
        <button
          onClick={() => user && getDatas("randomToken", user.mobile_no)}
          className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
            boxShadow: "0 8px 28px rgba(15,82,56,0.25)",
          }}
        >
          {t.history.resync}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 mt-4"
      >
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
          style={{ color: "#8e4e14", fontFamily: "'Manrope', sans-serif" }}
        >
          {t.history.archive}
        </p>
        <h2
          className="leading-[1.05]"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            letterSpacing: "-0.035em",
            color: "#1c1c18",
          }}
        >
          {t.history.title.split(" ")[0]}
          <br />
          <span style={{ color: "#0f5238" }}>
            {t.history.title.split(" ")[1]}
          </span>
        </h2>
      </motion.section>

      {/* Stat cards */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-2 gap-4 mb-10"
      >
        <motion.div
          whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(15,82,56,0.1)" }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl flex flex-col justify-between"
          style={{ backgroundColor: "#fff", border: "1px solid #e5e2dc" }}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: "rgba(15,82,56,0.08)" }}
          >
            <BarChart3 className="w-5 h-5" style={{ color: "#0f5238" }} />
          </div>
          <div>
            <p
              className="font-extrabold"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "2.25rem",
                letterSpacing: "-0.04em",
                color: "#1c1c18",
                lineHeight: 1,
              }}
            >
              {historyItems.length}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mt-1.5"
              style={{ color: "#707973", fontFamily: "'Manrope', sans-serif" }}
            >
              {t.history.totalScans}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #0f5238 0%, #2d6a4f 100%)",
            boxShadow: "0 8px 28px rgba(15,82,56,0.3)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p
              className="font-extrabold text-white"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "2.25rem",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {healthPct}%
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mt-1.5"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              {t.history.cropHealth}
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="flex gap-2 overflow-x-auto pb-6 no-scrollbar"
      >
        {[
          { id: "all", label: t.history.all },
          { id: "high", label: t.history.highRisk },
          { id: "healthy", label: t.history.healthy },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() =>
              setActiveFilter(filter.id as "all" | "high" | "healthy")
            }
            className="px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
            style={{
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: "0.02em",
              ...(activeFilter === filter.id
                ? {
                    background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(15,82,56,0.28)",
                  }
                : {
                    backgroundColor: "rgba(15,82,56,0.06)",
                    color: "#707973",
                    border: "1px solid rgba(15,82,56,0.1)",
                  }),
            }}
          >
            {filter.label}
          </button>
        ))}
      </motion.div>

      {/* History list — one card per scan, multiple detections inside */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          // Primary detection = highest severity (used for navigation)
          const primaryDetection = item.detections.reduce(
            (worst, d) => (d.severity > worst.severity ? d : worst),
            item.detections[0],
          );

          // Card-level flags
          const hasPlan = item.detections.some(
            (d) => getDiagnosisMetadata(d).showPlan,
          );

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: "easeOut",
              }}
              whileHover={{ boxShadow: "0 12px 40px rgba(15,82,56,0.1)" }}
              className="rounded-3xl overflow-hidden transition-all cursor-pointer"
              style={{ backgroundColor: "#fff", border: "1px solid #e5e2dc" }}
              onClick={() =>
                navigate(`/history/${item.id}`, {
                  state: { item, detection: primaryDetection },
                })
              }
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(15,82,56,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e2dc";
              }}
            >
              {/* Top: thumbnail + date — one per card */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
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
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    color: "#9ca3af",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {formatDate(item.created_at)}
                </p>
              </div>

              {/* Detection rows */}
              {item.detections.map((d, di) => {
                const meta = getDiagnosisMetadata(d);
                const confidencePct = Math.round(d.score * 100);
                const severityPct = Math.round(d.severity * 100);

                return (
                  <div key={di}>
                    {/* Divider between multiple detections */}
                    {di > 0 && (
                      <div
                        className="mx-5 my-1"
                        style={{ borderTop: "1px dashed #f0ede8" }}
                      />
                    )}

                    {/* Disease name + risk badge */}
                    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-1">
                      <div>
                        <p
                          className="font-extrabold leading-tight"
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            fontSize: "1.05rem",
                            letterSpacing: "-0.02em",
                            color: "#1c1c18",
                          }}
                        >
                          {meta.title}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{
                            color: "#9ca3af",
                            fontStyle: "italic",
                            fontFamily: "'Manrope', sans-serif",
                          }}
                        >
                          {meta.sciName}
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 mt-0.5"
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.text,
                          fontFamily: "'Manrope', sans-serif",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {meta.riskLabel}
                      </span>
                    </div>

                    {/* Progress bars */}
                    <div className="px-5 pt-3 pb-2 space-y-3">
                      {/* Confidence */}
                      <div>
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
                            {confidencePct}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: "#f0ede8" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${confidencePct}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.9,
                              delay: 0.2 + di * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg,#0f5238,#2d6a4f)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Severity */}
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
                            {severityPct}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: "#f0ede8" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${severityPct}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.9,
                              delay: 0.32 + di * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ background: meta.severityColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Footer — one per card */}
              <div
                className="flex items-center justify-between px-5 py-3.5 mt-2"
                style={{ borderTop: "1px solid #f0ede8" }}
              >
                {hasPlan ? (
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-bold"
                    style={{
                      color: "#0f5238",
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    {t.history.treatmentReady}&nbsp;·&nbsp;
                    <span className="underline underline-offset-2">
                      {t.history.viewPlan}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-bold"
                    style={{
                      color: "#9ca3af",
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    {t.history.noTreatmentRequired}
                  </div>
                )}
                <div
                  className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: "rgba(15,82,56,0.08)",
                    color: "#0f5238",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {t.history.accuracy}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div
              className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(15,82,56,0.06)",
                border: "1px solid rgba(15,82,56,0.1)",
              }}
            >
              <Leaf className="w-9 h-9" style={{ color: "#bfc9c1" }} />
            </div>
            <p
              className="font-extrabold mb-1"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#1c1c18",
                letterSpacing: "-0.02em",
              }}
            >
              {t.history.noRecordsFound}
            </p>
            <p className="text-sm" style={{ color: "#707973" }}>
              {t.history.noRecords}
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
