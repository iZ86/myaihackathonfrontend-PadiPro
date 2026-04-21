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

const getDummyMetadata = (index: number) => {
  const statuses = [
    {
      title: "Blast Disease",
      status: "Critical",
      statusColor: "bg-error",
      statusBg: "bg-error-container",
      statusText: "text-on-error-container",
    },
    {
      title: "Healthy Crop",
      status: "Excellent",
      statusColor: "bg-primary",
      statusBg: "bg-primary-fixed",
      statusText: "text-on-primary-fixed-variant",
    },
    {
      title: "Bacterial Blight",
      status: "Critical",
      statusColor: "bg-error",
      statusBg: "bg-error-container",
      statusText: "text-on-error-container",
    },
    {
      title: "Nutrient Deficiency",
      status: "Action Needed",
      statusColor: "bg-secondary",
      statusBg: "bg-secondary-container",
      statusText: "text-on-secondary-container",
    },
  ];
  return statuses[index % statuses.length];
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

export default function History() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDatas = useCallback(async (token: string, mobileNo: string) => {
    setLoading(true);
    setError(null);
    try {
      const historyResponse = await getDiagnosisHistoryAPI(token, mobileNo);

      if (!historyResponse?.ok) {
        throw new Error("Unable to sync history data. Check connection.");
      }

      const historyJson = await historyResponse.json();

      if (historyJson.success) {
        const augmentedData = historyJson.data.map(
          (item: HistoryItem, index: number) => {
            const metadata = getDummyMetadata(index);
            return { ...item, ...metadata };
          },
        );
        setHistoryItems(augmentedData);
      } else {
        setError("Failed to load records from server.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch history data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // TODO: Replace with authenticated context values
    getDatas("randomToken", "60125821900");
  }, [getDatas]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-primary animate-pulse text-sm">
          Loading history data...
        </p>
      </div>
    );
  }

  if (error || !historyItems || historyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center bg-error-container/10 py-10 rounded-3xl border-2 border-dashed border-error/20">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Sync Interrupted
        </h2>
        <p className="text-on-surface-variant text-sm max-w-60">
          {error || "History data is currently unavailable for this field."}
        </p>
        <button
          onClick={() => getDatas("randomToken", "60125821900")}
          className="mt-2 px-6 py-2.5 hero-gradient text-white rounded-full font-bold shadow-lg text-sm transition-transform active:scale-95"
        >
          Re-sync Sensors
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Editorial Header Section */}
      <section className="mb-10 mt-4">
        <p className="font-label text-[11px] uppercase tracking-widest text-primary font-bold mb-2">
          Diagnostic Archive
        </p>
        <h2 className="font-headline font-extrabold text-4xl text-on-surface leading-tight">
          Diagnosis <br />
          History
        </h2>
      </section>

      {/* Stats Overview Bento */}
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
              Total Scans
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
            <p className="text-3xl font-headline font-bold">82%</p>
            <p className="font-label text-xs uppercase tracking-wider opacity-80">
              Crop Health
            </p>
          </div>
        </motion.div>
      </section>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap">
          All Records
        </button>
        <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">
          High Risk
        </button>
        <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">
          Healthy
        </button>
        <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">
          Recent
        </button>
      </div>

      {/* History List */}
      <div className="space-y-6">
        {historyItems.map((item, index) => (
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
              <h3 className="font-headline font-bold text-on-surface text-base">
                {item.title}
              </h3>
              <div
                className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${item.statusBg} ${item.statusText}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}
                ></span>
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {item.status}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Pagination / Load More */}
      <div className="mt-10 flex justify-center pb-12">
        <button className="bg-surface-container-high text-on-surface px-8 py-3 rounded-full font-label text-sm font-semibold hover:bg-surface-container-highest transition-colors active:scale-95 duration-200">
          View Older Records
        </button>
      </div>
    </>
  );
}
