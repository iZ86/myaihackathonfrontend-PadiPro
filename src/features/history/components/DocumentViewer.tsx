import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  FileText,
  Loader2,
  AlertCircle,
  Maximize,
  Minimize,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { HistoryItem } from "@datatypes/historyType";

const LAST_DOC_KEY = "padi_last_document";

const OFFICE_EXTS = new Set([
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "odt",
  "ods",
  "odp",
]);

const getViewerUrl = (url: string): string => {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return url;
  if (OFFICE_EXTS.has(ext)) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  // Plain text, CSV, images etc. — render directly; unknown types get Office viewer as best-effort
  return url;
};

const getFilename = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() || "document");
  } catch {
    return decodeURIComponent(url.split("/").pop() || "document");
  }
};

const formatTs = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

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

interface Props {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  item?: HistoryItem;
  recentItems?: HistoryItem[];
  onSelectItem?: (item: HistoryItem) => void;
}

export default function DocumentViewer({
  url,
  isOpen,
  onClose,
  item,
  recentItems = [],
  onSelectItem,
}: Props) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [panelSize, setPanelSize] = useState({ w: 84, h: 86 }); // vw/vh %
  const [prevUrl, setPrevUrl] = useState(url);

  // Reset loading/error/zoom when URL changes (during-render pattern, no effect needed)
  if (url !== prevUrl) {
    setPrevUrl(url);
    setIsLoading(true);
    setHasError(false);
    setZoom(100);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const dragStart = useRef({ px: 0, py: 0, w: 0, h: 0 });
  const isDragging = useRef(false);

  const filename = getFilename(url);
  const ext = filename.split(".").pop()?.toUpperCase() ?? "DOC";
  const viewerUrl = getViewerUrl(url);

  // Persist last opened
  useEffect(() => {
    if (isOpen && url) localStorage.setItem(LAST_DOC_KEY, url);
  }, [isOpen, url]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fullscreen change sync
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Auto-hide toolbar in immersive modes
  const scheduleHide = useCallback(() => {
    setToolbarVisible(true);
    if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
    if (isMaximized || isFullscreen) {
      toolbarTimerRef.current = setTimeout(
        () => setToolbarVisible(false),
        3000,
      );
    }
  }, [isMaximized, isFullscreen]);

  // Start auto-hide timer when entering immersive mode; clean up on close
  useEffect(() => {
    if (!isOpen) return;
    if (isMaximized || isFullscreen) {
      if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
      toolbarTimerRef.current = setTimeout(
        () => setToolbarVisible(false),
        3000,
      );
    }
    return () => {
      if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
    };
  }, [isOpen, isMaximized, isFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.metaKey) {
        toggleFullscreen();
        return;
      }
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 10, 200));
      if (e.key === "-") setZoom((z) => Math.max(z - 10, 50));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, toggleFullscreen]);

  // Drag-to-resize
  const onResizePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = {
        px: e.clientX,
        py: e.clientY,
        w: panelSize.w,
        h: panelSize.h,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [panelSize],
  );

  const onResizePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      const dx = ((e.clientX - dragStart.current.px) / window.innerWidth) * 100;
      const dy =
        ((e.clientY - dragStart.current.py) / window.innerHeight) * 100;
      setPanelSize({
        w: Math.max(40, Math.min(98, dragStart.current.w + dx)),
        h: Math.max(40, Math.min(98, dragStart.current.h + dy)),
      });
    },
    [],
  );

  const onResizePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const recentWithDocs = recentItems.filter((i) => i.document);
  const showSidebar =
    (isMaximized || isFullscreen) && (recentWithDocs.length > 0 || item);

  const panelStyle =
    isMaximized || isFullscreen
      ? { width: "100dvw", height: "100dvh", borderRadius: 0 }
      : {
          width: `${panelSize.w}vw`,
          height: `${panelSize.h}vh`,
          borderRadius: "1.25rem",
        };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-60 bg-black/65 backdrop-blur-[6px]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-61 flex items-center justify-center pointer-events-none"
            onMouseMove={scheduleHide}
          >
            <div
              className="pointer-events-auto flex flex-col overflow-hidden transition-[width,height,border-radius] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                ...panelStyle,
                background: "#ffffff",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.40), 0 0 0 1px rgba(0,0,0,0.06)",
                maxWidth: isMaximized || isFullscreen ? "100dvw" : "96vw",
                maxHeight: isMaximized || isFullscreen ? "100dvh" : "96vh",
              }}
            >
              {/* ── Toolbar ─────────────────────────────── */}
              <motion.div
                animate={{
                  opacity: toolbarVisible ? 1 : 0,
                  y: toolbarVisible ? 0 : -52,
                }}
                transition={{ duration: 0.18 }}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100 bg-white/96 backdrop-blur-md z-10"
                style={{ minHeight: 52 }}
              >
                {/* File info */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(15,82,56,0.10)" }}
                  >
                    <FileText
                      className="w-4 h-4"
                      style={{ color: "#0f5238" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-800 truncate max-w-40 sm:max-w-xs">
                      {filename}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      {ext} · Report
                    </p>
                  </div>
                </div>

                {/* Zoom group */}
                <div className="hidden sm:flex items-center gap-0.5 bg-neutral-100 rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => setZoom((z) => Math.max(z - 10, 50))}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-neutral-500 hover:text-neutral-800 transition-colors"
                    title="Zoom out (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-neutral-700 w-10 text-center tabular-nums">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(z + 10, 200))}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-neutral-500 hover:text-neutral-800 transition-colors"
                    title="Zoom in (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-5 bg-neutral-200 shrink-0" />

                {/* Action icons */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <a
                    href={url}
                    download
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
                    title="Download"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
                    title="Open in new tab"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={toggleFullscreen}
                    className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsMaximized((m) => !m)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
                    title={isMaximized ? "Restore" : "Maximize"}
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-px h-5 bg-neutral-200 mx-1 hidden sm:block" />
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                    title="Close (ESC)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* ── Body ──────────────────────────────────── */}
              <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* iframe area */}
                <div
                  className="flex-1 min-w-0 overflow-auto relative"
                  style={{ background: "#f4f4f0" }}
                >
                  {/* Loading skeleton */}
                  <AnimatePresence>
                    {isLoading && !hasError && (
                      <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
                        style={{ background: "#f4f4f0" }}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ background: "rgba(15,82,56,0.08)" }}
                        >
                          <Loader2
                            className="w-7 h-7 animate-spin"
                            style={{ color: "#0f5238" }}
                          />
                        </div>
                        <div className="space-y-2.5 w-52">
                          {[72, 88, 60, 80, 50].map((w, i) => (
                            <div
                              key={i}
                              className="h-2.5 rounded-full animate-pulse"
                              style={{
                                width: `${w}%`,
                                background: "rgba(15,82,56,0.10)",
                              }}
                            />
                          ))}
                        </div>
                        <p
                          className="text-xs font-semibold animate-pulse"
                          style={{ color: "#707973" }}
                        >
                          Loading document…
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error state */}
                  <AnimatePresence>
                    {hasError && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
                        style={{ background: "#f4f4f0" }}
                      >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-50">
                          <AlertCircle className="w-7 h-7 text-red-500" />
                        </div>
                        <div className="text-center px-6">
                          <p className="font-bold text-neutral-800 mb-1">
                            Unable to load document
                          </p>
                          <p className="text-sm text-neutral-500 max-w-xs">
                            The document may be unavailable or the URL could not
                            be rendered.
                          </p>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                          style={{
                            background:
                              "linear-gradient(135deg,#0f5238,#2d6a4f)",
                          }}
                        >
                          Open directly ↗
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* iframe — lazy loaded, only src set when open */}
                  {!hasError && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        zoom: zoom / 100,
                        minHeight: 400,
                      }}
                    >
                      <iframe
                        key={url}
                        src={isOpen ? viewerUrl : undefined}
                        title={filename}
                        className="w-full border-none block"
                        style={{
                          height: `${Math.round(10000 / zoom)}%`,
                          minHeight: 400,
                        }}
                        loading="lazy"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                          setIsLoading(false);
                          setHasError(true);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* ── Sidebar ────────────────────────────── */}
                <AnimatePresence>
                  {showSidebar && (
                    <motion.aside
                      key="sidebar"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 264, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0 flex flex-col border-l border-neutral-100 overflow-hidden bg-white"
                    >
                      {/* Detection summary */}
                      {item && (
                        <div className="p-4 border-b border-neutral-100">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                            Current Scan
                          </p>
                          {/* Thumbnail */}
                          {item.download_url && (
                            <div className="w-full h-28 rounded-xl overflow-hidden mb-3 bg-neutral-100">
                              {item.download_url.includes("/videos/") ? (
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
                                  alt="scan"
                                />
                              )}
                            </div>
                          )}
                          {/* Detections */}
                          <div className="space-y-2">
                            {item.detections?.map((d, i) => {
                              const sev = toNum(d.severity);
                              const conf = Math.round(toNum(d.score) * 100);
                              const sevPct = Math.round(sev * 100);
                              const isHealthy = d.disease === "HEALTHY";
                              const isHighRisk = sev > 0.5;
                              const label = isHealthy
                                ? "Healthy"
                                : d.disease.charAt(0) +
                                  d.disease.slice(1).toLowerCase();
                              const badgeBg = isHealthy
                                ? "rgba(15,82,56,0.10)"
                                : isHighRisk
                                  ? "rgba(220,38,38,0.12)"
                                  : "rgba(194,65,12,0.10)";
                              const badgeColor = isHealthy
                                ? "#0f5238"
                                : isHighRisk
                                  ? "#b91c1c"
                                  : "#c2410c";
                              const sci =
                                SCIENTIFIC_NAMES[d.disease?.toUpperCase()] ||
                                "Species undetermined";
                              return (
                                <div
                                  key={i}
                                  className="p-3 rounded-xl border border-neutral-100 bg-neutral-50"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-neutral-800 truncate">
                                        {label}
                                      </p>
                                      <p className="text-[10px] italic text-neutral-400 truncate">
                                        {sci}
                                      </p>
                                    </div>
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0"
                                      style={{
                                        background: badgeBg,
                                        color: badgeColor,
                                      }}
                                    >
                                      {isHealthy
                                        ? "OK"
                                        : isHighRisk
                                          ? "HIGH"
                                          : "MOD"}
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div>
                                      <div className="flex justify-between mb-0.5">
                                        <span className="text-[9px] font-semibold text-neutral-400">
                                          Confidence
                                        </span>
                                        <span className="text-[9px] font-bold text-neutral-700">
                                          {conf}%
                                        </span>
                                      </div>
                                      <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
                                        <div
                                          className="h-full rounded-full"
                                          style={{
                                            width: `${conf}%`,
                                            background:
                                              "linear-gradient(90deg,#0f5238,#2d6a4f)",
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-0.5">
                                        <span className="text-[9px] font-semibold text-neutral-400">
                                          Severity
                                        </span>
                                        <span className="text-[9px] font-bold text-neutral-700">
                                          {sevPct}%
                                        </span>
                                      </div>
                                      <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
                                        <div
                                          className="h-full rounded-full"
                                          style={{
                                            width: `${sevPct}%`,
                                            background: isHealthy
                                              ? "linear-gradient(90deg,#0f5238,#2d6a4f)"
                                              : isHighRisk
                                                ? "linear-gradient(90deg,#c2410c,#dc2626)"
                                                : "linear-gradient(90deg,#8e4e14,#c2410c)",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[9px] text-neutral-400 flex items-center gap-1 mt-2">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTs(item.created_at)}
                          </p>
                        </div>
                      )}

                      {/* Recent reports */}
                      {recentWithDocs.length > 0 && (
                        <div className="flex-1 overflow-y-auto">
                          <div className="px-4 py-3 sticky top-0 bg-white border-b border-neutral-100 z-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                              Recent Reports
                            </p>
                          </div>
                          <div className="p-3 space-y-1.5">
                            {recentWithDocs.map((ri) => {
                              const isActive = ri.document === url;
                              return (
                                <button
                                  key={ri.id}
                                  onClick={() => onSelectItem?.(ri)}
                                  className="w-full text-left p-3 rounded-xl transition-all cursor-pointer hover:bg-neutral-50"
                                  style={
                                    isActive
                                      ? {
                                          background: "rgba(15,82,56,0.08)",
                                          border:
                                            "1px solid rgba(15,82,56,0.18)",
                                        }
                                      : { border: "1px solid transparent" }
                                  }
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                      style={{
                                        background: isActive
                                          ? "rgba(15,82,56,0.15)"
                                          : "rgba(15,82,56,0.06)",
                                      }}
                                    >
                                      <FileText
                                        className="w-3.5 h-3.5"
                                        style={{ color: "#0f5238" }}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-bold text-neutral-800 truncate">
                                        {getFilename(ri.document!)}
                                      </p>
                                      <p className="text-[9px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                        <Clock className="w-2.5 h-2.5" />
                                        {formatTs(ri.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                  {isActive && (
                                    <div className="flex items-center gap-1 mt-2">
                                      <CheckCircle2
                                        className="w-3 h-3"
                                        style={{ color: "#0f5238" }}
                                      />
                                      <span
                                        className="text-[9px] font-bold"
                                        style={{ color: "#0f5238" }}
                                      >
                                        Viewing
                                      </span>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.aside>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Resize handle ─────────────────────────── */}
              {!isMaximized && !isFullscreen && (
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-20"
                  onPointerDown={onResizePointerDown}
                  onPointerMove={onResizePointerMove}
                  onPointerUp={onResizePointerUp}
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="absolute bottom-1.5 right-1.5 w-3 h-3 text-neutral-300"
                  >
                    <path
                      d="M11 1L1 11M11 6L6 11M11 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* ── Keyboard hint ─────────────────────────── */}
              {!isMaximized && !isFullscreen && (
                <div className="shrink-0 flex items-center justify-between px-4 py-1.5 border-t border-neutral-100 bg-neutral-50">
                  <div className="flex items-center gap-3">
                    {[
                      { key: "ESC", label: "close" },
                      { key: "F", label: "fullscreen" },
                      { key: "+ / −", label: "zoom" },
                    ].map(({ key, label }) => (
                      <span
                        key={key}
                        className="flex items-center gap-1 text-[10px] text-neutral-400"
                      >
                        <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600 font-mono text-[9px] font-bold">
                          {key}
                        </kbd>
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-neutral-400">
                    Drag corner to resize
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
