import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  User,
  Bot,
  Loader2,
  X,
  Paperclip,
  Sparkles,
  Sprout,
  Cloud,
  Bug,
  Info,
  Mic,
  Square,
  Trash2,
  AlertCircle,
  Check,
  Maximize2,
  Download,
  FileText,
} from "lucide-react";
import { useLanguage } from "@context/lang/useLanguage";
import type { Message } from "@datatypes/chatType";
import AudioPlayer from "./AudioPlayer";
import { useAuth } from "@context/auth/useAuth";
import {
  uploadChatFile,
  saveMediaMetaDataAPI,
  sendWebchatMessageAPI,
  getChatHistoryAPI,
} from "../api/chat";

interface MediaAttachment {
  file: File;
  previewUrl: string;
  type: "image" | "video";
  size: number;
}

const MAX_FILE_SIZE_MB = 25;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

const THINKING_PHRASES = [
  "Analyzing your request…",
  "Checking disease database…",
  "Generating response…",
  "Processing plant data…",
  "Consulting agronomy knowledge…",
];

export default function ChatArea() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [media, setMedia] = useState<MediaAttachment | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileNo, setMobileNo] = useState(user?.mobile_no ?? "");
  const [typingPhraseIdx, setTypingPhraseIdx] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  const historyCountRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const suggestions = [
    {
      text: t.chat.s_crops,
      icon: Sprout,
      gradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      text: t.chat.s_weather,
      icon: Cloud,
      gradient: "from-blue-500/10 to-sky-500/10",
    },
    {
      text: t.chat.s_pests,
      icon: Bug,
      gradient: "from-orange-500/10 to-red-500/10",
    },
    {
      text: t.chat.s_advice,
      icon: Info,
      gradient: "from-purple-500/10 to-indigo-500/10",
    },
  ];

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const token = localStorage.getItem("token") ?? "";
      const currentMobileNo = user?.mobile_no ?? "";
      if (!currentMobileNo) {
        setIsLoadingHistory(false);
        return;
      }
      setMobileNo(currentMobileNo);
      try {
        const response = await getChatHistoryAPI(token, currentMobileNo);
        if (!response || !response.ok)
          throw new Error("Failed to fetch history");
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          const detectType = (
            mediaType?: string,
            url?: string,
          ): Message["type"] => {
            if (mediaType === "document") return "document";
            if (mediaType === "video" || url?.includes("/videos/"))
              return "video";
            if (mediaType === "audio" || url?.includes("/audios/"))
              return "audio";
            if (mediaType === "image") return "image";
            if (!url) return "text";
            return "image";
          };
          const history: Message[] = json.data.map(
            (item: {
              role: string;
              message: string;
              media_url?: string;
              media_name?: string;
              media_type?: string;
              base64_url?: string;
              timestamp: { _seconds: number; _nanoseconds: number };
            }) => {
              const type = detectType(item.media_type, item.media_url);
              const mediaUrl =
                item.media_url ||
                (item.base64_url
                  ? `data:image/png;base64,${item.base64_url}`
                  : undefined);
              return {
                id: crypto.randomUUID(),
                role: item.role === "model" ? "assistant" : "user",
                type,
                content: type === "document" ? "" : (item.message ?? ""),
                mediaUrl,
                mediaName: item.media_name || undefined,
                status: "sent" as const,
                timestamp: new Date(item.timestamp._seconds * 1000),
              };
            },
          );
          historyCountRef.current = history.length;
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, [user?.mobile_no]);

  // Cycle thinking phrases while AI responds
  useEffect(() => {
    if (!isTyping) {
      setTypingPhraseIdx(0);
      return;
    }
    const id = setInterval(
      () => setTypingPhraseIdx((p) => (p + 1) % THINKING_PHRASES.length),
      1800,
    );
    return () => clearInterval(id);
  }, [isTyping]);

  const processFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Unsupported file type. Please use JPG, PNG, WebP or MP4.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const previewUrl = URL.createObjectURL(file);
    setMedia({
      file,
      previewUrl,
      type: isImage ? "image" : "video",
      size: file.size,
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone permission is required to send audio messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const deleteAudio = () => {
    setAudioURL(null);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = async (text: string = input) => {
    const finalInput = text.trim();
    if ((!finalInput && !media && !audioURL) || isTyping) return;

    const messageId = crypto.randomUUID();
    const timestamp = new Date();
    let messageType: Message["type"];
    let initialContent: string;

    if (media) {
      messageType = media.type;
      initialContent = media.previewUrl;
    } else if (audioURL) {
      messageType = "audio";
      initialContent = audioURL;
    } else {
      messageType = "text";
      initialContent = finalInput;
    }

    const optimisticMessage: Message = {
      id: messageId,
      role: "user",
      type: messageType,
      content: finalInput,
      mediaUrl: messageType !== "text" ? initialContent : undefined,
      mediaName: media?.file.name,
      status: messageType !== "text" ? "sending" : "sent",
      timestamp,
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    setInput("");
    const currentMedia = media;
    const currentAudio = audioURL;
    const currentAudioChunks = [...audioChunksRef.current];
    setMedia(null);
    setAudioURL(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    try {
      let mediaUrl: string | undefined;
      let uploadedStoragePath: string | undefined;
      const token = localStorage.getItem("token") ?? "";

      if (currentMedia) {
        try {
          const { downloadUrl, storagePath } = await uploadChatFile(
            mobileNo,
            currentMedia.file,
          );
          mediaUrl = downloadUrl;
          uploadedStoragePath = storagePath;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: "sent" } : msg,
            ),
          );
          await saveMediaMetaDataAPI(
            token,
            mobileNo,
            currentMedia.file.type,
            storagePath,
            downloadUrl,
            currentMedia.type,
            finalInput || undefined,
          );
        } catch {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: "failed" } : msg,
            ),
          );
          setIsTyping(false);
          return;
        }
      }

      if (currentAudio) {
        try {
          const blob = new Blob(currentAudioChunks, { type: "audio/webm" });
          const audioFile = new File([blob], "audio_message.webm", {
            type: "audio/webm",
          });
          const { downloadUrl, storagePath } = await uploadChatFile(
            mobileNo,
            audioFile,
          );
          mediaUrl = downloadUrl;
          uploadedStoragePath = storagePath;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: "sent" } : msg,
            ),
          );
          await saveMediaMetaDataAPI(
            token,
            mobileNo,
            audioFile.type,
            storagePath,
            downloadUrl,
            "audio",
          );
        } catch {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: "failed" } : msg,
            ),
          );
          setIsTyping(false);
          return;
        }
      }

      const mediaName = uploadedStoragePath?.split("/")[2].split(".")[0];
      const mediaType = currentAudio ? "audio" : (currentMedia?.type ?? "text");
      const response = await sendWebchatMessageAPI(
        token,
        mobileNo,
        finalInput || undefined,
        mediaUrl,
        mediaName,
        mediaType,
      );

      if (!response || response.status === 500) throw new Error("Server error");
      const json = await response.json();

      if (json.success && json.data?.messages) {
        const assistantMessages: Message[] = json.data.messages.map(
          (msg: {
            message: string;
            type: string;
            document_url?: string;
            base64_url?: string;
          }) => {
            if (msg.document_url)
              return {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                type: "document" as const,
                content: "",
                mediaUrl: msg.document_url,
                status: "sent" as const,
                timestamp: new Date(),
              };
            if (msg.base64_url)
              return {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                type: "image" as const,
                content: "",
                mediaUrl: `data:image/png;base64,${msg.base64_url}`,
                status: "sent" as const,
                timestamp: new Date(),
              };
            return {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              type: "text" as const,
              content: msg.message,
              status: "sent" as const,
              timestamp: new Date(),
            };
          },
        );
        setMessages((prev) => [...prev, ...assistantMessages]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant" as const,
            type: "text" as const,
            content:
              json.message ||
              "We seem to be having some issues, please try again in an hour or so.",
            status: "sent" as const,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          content:
            "We seem to be having some issues, please try again in an hour or so.",
          status: "sent",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden transition-colors duration-300 ${isDragging ? "ring-2 ring-primary/25 ring-inset bg-primary/3" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) processFile(f);
      }}
    >
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative max-w-full max-h-full"
            >
              <img
                src={lightboxSrc}
                className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl border border-white/10 object-contain"
                onClick={(e) => e.stopPropagation()}
                alt="Enlarged view"
              />
              <button
                onClick={() => setLightboxSrc(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white p-2 transition-colors"
                title="Close Lightbox"
              >
                <X size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages scroll area — flex-col-reverse anchors scrollTop=0 to bottom */}
      <div
        className={`grow min-h-0 overflow-y-auto flex flex-col-reverse no-scrollbar mask-[linear-gradient(to_bottom,transparent_0px,black_48px,black_calc(100%-8px))] transition-opacity duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
        style={{ overflowAnchor: "none" }}
      >
        <div className={`flex flex-col ${messages.length === 0 && !isLoadingHistory ? "justify-center" : "justify-end"} min-h-full max-w-3xl mx-auto w-full px-4 pt-2 pb-30`}>
          <AnimatePresence initial={false}>
            {/* ── Skeleton loading ── */}
            {isLoadingHistory ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 pt-4"
              >
                {(
                  [
                    { isUser: false, lines: ["72%", "48%"] },
                    { isUser: true, lines: ["55%"] },
                    { isUser: false, lines: ["78%"] },
                    { isUser: true, lines: ["42%"] },
                    { isUser: false, lines: ["65%", "35%"] },
                    { isUser: true, lines: ["52%"] },
                    { isUser: false, lines: ["70%"] },
                  ] as { isUser: boolean; lines: string[] }[]
                ).map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.045, duration: 0.28 }}
                    className={`flex gap-2.5 ${row.isUser ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-surface-container-high/55 animate-pulse shrink-0 mt-1" />
                    <div
                      className={`flex flex-col gap-1.5 ${row.isUser ? "items-end" : "items-start"}`}
                      style={{ maxWidth: "75%" }}
                    >
                      {row.lines.map((width, j) => (
                        <div
                          key={j}
                          className={`h-9 rounded-2xl animate-pulse ${row.isUser ? "bg-primary/10 rounded-tr-sm" : "bg-surface-container-high/45 rounded-tl-sm"}`}
                          style={{ width }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : messages.length === 0 ? (
              /* ── Empty / welcome state ── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center justify-center text-center py-4"
              >
                {/* Ambient orbs */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.85, 0.45] }}
                  transition={{
                    repeat: Infinity,
                    duration: 7,
                    ease: "easeInOut",
                  }}
                  className="absolute top-4 -left-10 w-52 h-52 bg-primary/7 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.6, 0.25] }}
                  transition={{
                    repeat: Infinity,
                    duration: 9,
                    ease: "easeInOut",
                    delay: 2.5,
                  }}
                  className="absolute top-16 -right-10 w-44 h-44 bg-blue-400/6 rounded-full blur-3xl pointer-events-none"
                />

                {/* AI icon */}
                <motion.div
                  initial={{ scale: 0.78, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08,
                    type: "spring",
                    stiffness: 240,
                    damping: 22,
                  }}
                  className="relative mb-6"
                >
                  <motion.div
                    animate={{ scale: [1, 1.22, 1], opacity: [0.28, 0, 0.28] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeOut",
                    }}
                    className="absolute -inset-2 rounded-4xl bg-primary/12 pointer-events-none"
                  />
                  <div className="relative w-18 h-18 bg-linear-to-br from-primary/18 via-primary/8 to-transparent rounded-[1.6rem] border border-primary/18 flex items-center justify-center shadow-xl shadow-primary/10">
                    <Sparkles size={30} className="text-primary" />
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-md shadow-primary/40"
                    >
                      AI
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                  className="text-2xl font-headline font-black text-on-surface mb-2 tracking-tight"
                >
                  PadiPro Assistant
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="text-on-surface-variant/55 max-w-xs mx-auto text-sm font-medium leading-relaxed mb-7 px-2"
                >
                  {t.chat.welcome}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22 }}
                  className="w-full px-1"
                >
                  <div className="flex items-center gap-3 mb-3.5 px-1">
                    <div className="h-px grow bg-surface-container-high/70" />
                    <span className="text-[10px] font-black text-on-surface-variant/25 uppercase tracking-[0.3em] whitespace-nowrap">
                      Suggested Actions
                    </span>
                    <div className="h-px grow bg-surface-container-high/70" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.26 + i * 0.06,
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSend(s.text)}
                        className="flex flex-col items-start gap-2.5 p-3.5 rounded-2xl border border-surface-container-high/70 bg-white/65 backdrop-blur-sm text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-black/5 hover:border-primary/20 hover:bg-white/90 group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br ${s.gradient} border border-surface-container/50 group-hover:border-primary/20 transition-colors`}
                        >
                          <s.icon
                            className="text-on-surface-variant/50 group-hover:text-primary transition-colors"
                            size={17}
                          />
                        </div>
                        <div>
                          <span className="text-[13px] font-semibold text-on-surface/85 leading-tight block">
                            {s.text}
                          </span>
                          <span className="text-[10px] font-medium text-on-surface-variant/30 uppercase tracking-wider mt-0.5 block">
                            Quick Query
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Message list ── */
              <div className="space-y-2.5 pt-3">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={
                        idx >= historyCountRef.current
                          ? { opacity: 0, y: 10, scale: 0.97 }
                          : false
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                          isUser
                            ? "bg-primary text-white shadow-sm shadow-primary/30"
                            : "bg-linear-to-br from-surface-container-high to-surface-container border border-surface-container-high/80 text-on-surface-variant/60"
                        }`}
                      >
                        {isUser ? <User size={14} /> : <Bot size={14} />}
                      </div>

                      {/* Bubble column */}
                      <div
                        className={`flex flex-col gap-1 ${
                          msg.type === "image" ||
                          msg.type === "video" ||
                          msg.type === "document"
                            ? "w-[75%]"
                            : "max-w-[80%] sm:max-w-[72%]"
                        } ${isUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`group relative rounded-2xl text-sm leading-relaxed transition-all duration-200 overflow-hidden ${
                            msg.type === "text" || msg.type === "audio"
                              ? "px-4 py-3"
                              : "w-full"
                          } ${
                            isUser
                              ? "bg-linear-to-br from-primary to-primary/90 text-on-primary rounded-tr-sm shadow-md shadow-primary/18 hover:shadow-lg hover:shadow-primary/24"
                              : "bg-white/95 text-on-surface border border-surface-container/50 rounded-tl-sm shadow-sm shadow-black/4 hover:shadow-md hover:shadow-black/[0.07]"
                          } ${msg.status === "sending" && msg.type !== "image" && msg.type !== "video" ? "opacity-70" : ""} ${msg.status === "failed" ? "border-error/50 bg-error-container/10 text-error ring-1 ring-error/20" : ""}`}
                        >
                          {/* Image */}
                          {msg.type === "image" && (
                            <>
                              <div
                                className={`relative group/img overflow-hidden ${msg.status !== "sending" ? "cursor-zoom-in" : "cursor-default"}`}
                                onClick={() =>
                                  msg.status !== "sending" &&
                                  setLightboxSrc(msg.mediaUrl ?? "")
                                }
                              >
                                <img
                                  src={msg.mediaUrl}
                                  className="w-full max-h-64 object-cover block transition-transform duration-400 group-hover/img:scale-[1.03]"
                                  alt="Shared image"
                                />
                                {msg.status === "sending" ? (
                                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                                    <Loader2
                                      className="text-white animate-spin"
                                      size={28}
                                    />
                                    <span className="text-white/80 text-xs font-semibold">
                                      Uploading…
                                    </span>
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover/img:opacity-100 transition-all scale-90 group-hover/img:scale-100">
                                      <Maximize2
                                        className="text-white"
                                        size={18}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              {msg.content && (
                                <p
                                  className={`px-3 py-2.5 text-sm whitespace-pre-wrap border-t ${isUser ? "border-white/10" : "border-surface-container/50"}`}
                                >
                                  {msg.content}
                                </p>
                              )}
                            </>
                          )}

                          {/* Video */}
                          {msg.type === "video" && (
                            <>
                              <div className="relative">
                                <video
                                  src={msg.mediaUrl}
                                  controls={msg.status !== "sending"}
                                  className="w-full max-h-64 block"
                                />
                                {msg.status === "sending" && (
                                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 pointer-events-none">
                                    <Loader2
                                      className="text-white animate-spin"
                                      size={28}
                                    />
                                    <span className="text-white/80 text-xs font-semibold">
                                      Uploading…
                                    </span>
                                  </div>
                                )}
                              </div>
                              {msg.content && (
                                <p
                                  className={`px-3 py-2.5 text-sm whitespace-pre-wrap border-t ${isUser ? "border-white/10" : "border-surface-container/50"}`}
                                >
                                  {msg.content}
                                </p>
                              )}
                            </>
                          )}

                          {/* Document */}
                          {msg.type === "document" && msg.mediaUrl && (
                            <a
                              href={msg.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group/doc"
                            >
                              <div className="w-full h-28 bg-linear-to-br from-primary/8 to-primary/3 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                                <motion.div
                                  animate={{ y: [0, -2, 0] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <FileText
                                    size={36}
                                    className="text-primary/45 group-hover/doc:text-primary/70 transition-colors"
                                  />
                                </motion.div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/30">
                                  Solution Plan
                                </span>
                                <div className="absolute inset-0 bg-black/0 group-hover/doc:bg-black/4 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover/doc:opacity-100 transition-all scale-95 group-hover/doc:scale-100 bg-primary text-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-primary/30">
                                    <Download size={12} /> Download
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`px-3 py-2.5 flex items-center gap-2 border-t ${isUser ? "border-white/10" : "border-surface-container/50"}`}
                              >
                                <FileText
                                  size={13}
                                  className="text-primary shrink-0"
                                />
                                <span className="text-xs font-semibold text-on-surface-variant/70 truncate flex-1">
                                  {msg.mediaName
                                    ? `${msg.mediaName.slice(0, 16)}….docx`
                                    : "solution-plan.docx"}
                                </span>
                                <Download
                                  size={13}
                                  className="text-primary/60 shrink-0"
                                />
                              </div>
                            </a>
                          )}

                          {/* Audio */}
                          {msg.type === "audio" && msg.mediaUrl && (
                            <AudioPlayer
                              id={msg.id}
                              activeAudioId={activeAudioId}
                              src={msg.mediaUrl}
                              variant={isUser ? "user" : "assistant"}
                              onPlay={setActiveAudioId}
                            />
                          )}

                          {/* Text */}
                          {msg.type === "text" && (
                            <>
                              <p className="whitespace-pre-wrap font-[450] tracking-[-0.01em] leading-relaxed">
                                {msg.content}
                              </p>
                              {msg.document_url && (
                                <a
                                  href={msg.document_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                                >
                                  <Download size={14} /> Download Solution Plan
                                </a>
                              )}
                            </>
                          )}
                        </div>

                        {/* Timestamp + status */}
                        <div
                          className={`flex items-center gap-1.5 px-1 ${isUser ? "flex-row-reverse" : ""}`}
                        >
                          <span
                            className={`text-[10px] font-medium tabular-nums ${msg.status === "failed" ? "text-error" : "text-on-surface-variant/22"}`}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isUser && (
                            <div className="flex items-center gap-1">
                              {msg.status === "sending" && (
                                <Loader2
                                  size={11}
                                  className="animate-spin text-on-surface-variant/30"
                                />
                              )}
                              {msg.status === "failed" && (
                                <AlertCircle size={11} className="text-error" />
                              )}
                              {msg.status === "sent" && (
                                <Check size={11} className="text-primary/55" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Premium typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className="flex gap-2 items-end mt-3"
              >
                {/* Glowing avatar */}
                <div className="relative shrink-0 self-end mb-0.5">
                  <div className="w-7 h-7 rounded-xl bg-linear-to-br from-primary/25 to-primary/10 border border-primary/20 flex items-center justify-center shadow-sm shadow-primary/15">
                    <Bot size={14} className="text-primary/75" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.85, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-xl bg-primary/18 pointer-events-none"
                  />
                </div>

                {/* Bubble — animated rotating border via CSS ::before */}
                <div className="typing-border-wrap shadow-sm shadow-primary/10">
                  <div
                    className="relative bg-white/96 backdrop-blur-md overflow-hidden z-10"
                    style={{
                      borderRadius:
                        "calc(1rem - 1.5px) calc(1rem - 1.5px) calc(1rem - 1.5px) calc(0.125rem - 1.5px)",
                    }}
                  >
                    <div className="px-4 py-3 flex items-center gap-3">
                      {/* Wave dots */}
                      <div className="flex gap-1.5 items-center shrink-0">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="block w-1.5 h-1.5 rounded-full bg-primary/55"
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.0,
                              delay: i * 0.13,
                              ease: [0.45, 0, 0.55, 1],
                            }}
                          />
                        ))}
                      </div>

                      {/* Rotating status phrase */}
                      <div className="overflow-hidden h-4.5 flex items-center">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={typingPhraseIdx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22 }}
                            className="text-[11px] font-medium text-on-surface-variant/38 tracking-wide whitespace-nowrap select-none"
                          >
                            {THINKING_PHRASES[typingPhraseIdx]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 px-3 pt-8 pb-3 md:px-6 md:pb-5 bg-linear-to-t from-white via-white/97 to-transparent pointer-events-none z-50">
        <div className="max-w-2xl mx-auto w-full relative pointer-events-auto">
          {/* Media preview */}
          <AnimatePresence>
            {media && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                className="mb-2 bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl border border-surface-container/55 shadow-lg flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-surface-container/55 shrink-0">
                  {media.type === "image" ? (
                    <img
                      src={media.previewUrl}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <video
                      src={media.previewUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="grow min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {media.file.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/40 uppercase font-medium tracking-wider mt-0.5">
                    {(media.size / 1024 / 1024).toFixed(2)} MB · {media.type}
                  </p>
                </div>
                <button
                  onClick={() => setMedia(null)}
                  className="w-8 h-8 rounded-full bg-error/8 text-error/65 flex items-center justify-center hover:bg-error hover:text-white transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Composer form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isRecording) handleSend();
            }}
            className="flex items-center gap-2 bg-white/88 backdrop-blur-2xl rounded-2xl px-2 py-2 shadow-[0_2px_24px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)] border border-surface-container/40 focus-within:border-primary/30 focus-within:shadow-[0_2px_32px_rgba(0,0,0,0.09)] transition-all duration-200"
          >
            {!isRecording && !audioURL && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.88 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-on-surface-variant/32 hover:text-primary transition-all rounded-xl hover:bg-primary/6 cursor-pointer shrink-0"
                >
                  <Paperclip size={19} />
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processFile(f);
                    e.target.value = "";
                  }}
                />
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={t.chat.placeholder}
                  rows={1}
                  className="grow min-w-0 bg-transparent border-none py-2.5 px-1 text-sm font-medium focus:ring-0 outline-none max-h-32 scrollbar-hide text-on-surface placeholder:text-on-surface-variant/28 resize-none leading-relaxed"
                />
              </>
            )}

            {isRecording && (
              <div className="grow flex items-center gap-3 px-3 py-2">
                <div className="flex gap-0.5 items-end">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [3, 14, 3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.55,
                        delay: i * 0.08,
                        ease: "easeInOut",
                      }}
                      className="w-0.5 bg-error rounded-full"
                    />
                  ))}
                </div>
                <span className="font-bold tabular-nums text-error text-sm tracking-wider">
                  {formatTime(recordingDuration)}
                </span>
                <span className="text-on-surface-variant/32 font-medium text-[10px] uppercase tracking-wider">
                  Recording
                </span>
              </div>
            )}

            {audioURL && !isRecording && (
              <div className="flex-1 min-w-0 flex items-center gap-2 px-2">
                <div className="flex-1 min-w-0">
                  <AudioPlayer
                    id="preview"
                    activeAudioId={activeAudioId}
                    src={audioURL}
                    variant="preview"
                    onPlay={setActiveAudioId}
                  />
                </div>
                <button
                  type="button"
                  onClick={deleteAudio}
                  className="w-8 h-8 shrink-0 text-on-surface-variant/32 hover:text-error transition-all flex items-center justify-center cursor-pointer rounded-full hover:bg-error/8"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )}

            {isRecording ? (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={stopRecording}
                className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center bg-error text-white shadow-lg shadow-error/25 cursor-pointer"
              >
                <Square size={14} fill="currentColor" />
              </motion.button>
            ) : (
              <div className="shrink-0">
                {!input.trim() && !media && !audioURL ? (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={startRecording}
                    disabled={isTyping}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                      isTyping
                        ? "bg-surface-container text-on-surface-variant opacity-35 cursor-not-allowed"
                        : "text-on-surface-variant/38 hover:text-primary hover:bg-primary/8"
                    }`}
                  >
                    <Mic size={19} />
                    {!isTyping && (
                      <motion.span
                        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.8,
                          ease: "easeOut",
                        }}
                        className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
                      />
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.91 }}
                    type="submit"
                    disabled={
                      (!input.trim() && !media && !audioURL) || isTyping
                    }
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      (!input.trim() && !media && !audioURL) || isTyping
                        ? "bg-surface-container text-on-surface-variant opacity-35 cursor-not-allowed"
                        : "bg-linear-to-br from-primary to-primary/85 text-white shadow-lg shadow-primary/28"
                    }`}
                  >
                    {isTyping ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Send
                        size={17}
                        className="translate-x-px -translate-y-px"
                      />
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </form>

          <p className="text-center text-[10px] font-medium text-on-surface-variant/16 mt-2 pointer-events-none">
            PadiPro may make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
