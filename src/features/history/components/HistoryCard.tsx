import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  Verified,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getDiagnosisHistoryAPI } from "@features/history/api/history";
import type { HistoryItem } from "@datatypes/historyType";
import { useAuth } from "@context/auth/useAuth";
import { useLanguage } from "@context/lang/useLanguage";

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

export default function HistoryCard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "healthy">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          const augmentedData = historyJson.data.map((item: HistoryItem) => {
            const metadata = getDiagnosisMetadata(item);
            return {
              ...item,
              ...metadata,
              title: item.diagnosis || metadata.title,
            };
          });
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
    if (activeFilter === "all") return true;
    if (activeFilter === "healthy") return item.diagnosis === "HEALTHY";
    if (activeFilter === "high") return item.severity > 0.5;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-primary animate-pulse text-sm">
          {t.history.loadingHistory}
        </p>
      </div>
    );
  }

  if (error || !historyItems) {
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
          onClick={() => user && getDatas("randomToken", user.mobile_no)}
          className="mt-2 px-6 py-2.5 hero-gradient text-white rounded-full font-bold shadow-lg text-sm transition-transform active:scale-95"
        >
          {t.history.resync}
        </button>
      </div>
    );
  }

  const getDiagnosisMetadata = (item: HistoryItem) => {
    const diagnosis = item.diagnosis || "UNKNOWN";
    const severity = item.severity || 0;

    if (diagnosis === "HEALTHY") {
      return {
        title: "Healthy Crop",
        status: t.history.excellent,
        statusColor: "bg-primary",
        statusBg: "bg-primary-fixed",
        statusText: "text-on-primary-fixed-variant",
      };
    }

    if (severity > 0.5) {
      return {
        title: diagnosis.charAt(0) + diagnosis.slice(1).toLowerCase(),
        status: t.history.critical,
        statusColor: "bg-error",
        statusBg: "bg-error-container",
        statusText: "text-on-error-container",
      };
    }

    return {
      title: diagnosis.charAt(0) + diagnosis.slice(1).toLowerCase(),
      status: t.history.actionNeeded,
      statusColor: "bg-secondary",
      statusBg: "bg-secondary-container",
      statusText: "text-on-secondary-container",
    };
  };

  return (
    <>
      <section className="mb-10 mt-4">
        <p className="font-label text-[11px] uppercase tracking-widest text-primary font-bold mb-2">
          {t.history.archive}
        </p>
        <h2 className="font-headline font-extrabold text-4xl text-on-surface leading-tight">
          {t.history.title.split(" ")[0]} <br />
          {t.history.title.split(" ")[1]}
        </h2>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-headline font-bold text-on-surface">
              {historyItems.length}
            </p>
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
              {t.history.totalScans}
            </p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="hero-gradient p-6 rounded-xl flex flex-col justify-between text-on-primary"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <Verified className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-3xl font-headline font-bold">
              {historyItems.length > 0
                ? Math.round(
                    (historyItems.filter((i) => i.diagnosis === "HEALTHY")
                      .length /
                      historyItems.length) *
                      100,
                  )
                : 0}
              %
            </p>
            <p className="font-label text-xs uppercase tracking-wider opacity-80">
              {t.history.cropHealth}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
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
            className={`px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === filter.id
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="group bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all border border-surface-container cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <img
                src={item.download_url}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grow">
              <p className="font-label text-[10px] text-outline uppercase tracking-tighter mb-0.5">
                {formatDate(item.created_at)}
              </p>
              <h3 className="font-headline font-bold text-on-surface text-base uppercase tracking-tight">
                {item.diagnosis}
              </h3>
              <div
                className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${item.statusBg} ${item.statusText}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}
                ></span>
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {item.status} ({Math.round(item.severity * 100)}%)
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
        {filteredItems.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-on-surface-variant text-sm font-medium">
              {t.history.noRecords}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
