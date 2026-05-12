import { useState, useRef, useEffect } from "react";
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

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
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
          const detectType = (url: string): Message["type"] => {
            if (!url) return "text";
            if (url.includes("/videos/")) return "video";
            if (url.includes("/audios/")) return "audio";
            return "image";
          };

          const history: Message[] = json.data.map(
            (item: {
              role: string;
              message: string;
              media_url?: string;
              media_name?: string;
              timestamp: { _seconds: number; _nanoseconds: number };
            }) => ({
              id: crypto.randomUUID(),
              role: item.role === "model" ? "assistant" : "user",
              type: detectType(item.media_url ?? ""),
              content: item.message ?? "",
              mediaUrl: item.media_url || undefined,
              mediaName: item.media_name || undefined,
              status: "sent" as const,
              timestamp: new Date(item.timestamp._seconds * 1000),
            }),
          );
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

  // Auto-scroll to bottom only when there are messages
  useEffect(() => {
    if (scrollRef.current && (messages.length > 0 || isTyping)) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

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
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
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

    // 1. Optimistic UI update
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

    // 2. Clear state
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

      // 3. Upload media/image/video first if present, then call API
      const token = localStorage.getItem("token") ?? "";
      if (currentMedia) {
        try {
          const { downloadUrl, storagePath, sha256 } = await uploadChatFile(
            mobileNo,
            currentMedia.file,
          );
          mediaUrl = downloadUrl;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, mediaUrl: downloadUrl, status: "sent" }
                : msg,
            ),
          );
          await saveMediaMetaDataAPI(
            token,
            mobileNo,
            currentMedia.file.name.split(".")[0],
            currentMedia.file.type,
            storagePath,
            downloadUrl,
            sha256,
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

      // Audio upload
      let audioMediaName: string | undefined;
      if (currentAudio) {
        try {
          const blob = new Blob(currentAudioChunks, { type: "audio/webm" });
          const audioFile = new File([blob], "audio_message.webm", {
            type: "audio/webm",
          });
          const { downloadUrl, storagePath, sha256 } = await uploadChatFile(
            mobileNo,
            audioFile,
          );
          mediaUrl = downloadUrl;
          audioMediaName = audioFile.name.split(".")[0];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, mediaUrl: downloadUrl, status: "sent" }
                : msg,
            ),
          );
          await saveMediaMetaDataAPI(
            token,
            mobileNo,
            audioMediaName,
            audioFile.type,
            storagePath,
            downloadUrl,
            sha256,
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

      // 4. Call the webchat API (text and/or media)
      const mediaName = currentAudio
        ? audioMediaName
        : currentMedia?.file.name.split(".")[0];
      const mediaType = currentAudio ? "audio" : (currentMedia?.type ?? "text");

      const response = await sendWebchatMessageAPI(
        token,
        mobileNo,
        finalInput || undefined,
        mediaUrl,
        mediaName,
        mediaType,
      );

      if (!response || response.status === 500) {
        throw new Error("Server error");
      }

      const json = await response.json();

      // 5. Render assistant messages
      if (json.success && json.data?.messages) {
        const assistantMessages: Message[] = json.data.messages.map(
          (msg: { message: string; type: string; document_url?: string }) => ({
            id: crypto.randomUUID(),
            role: "assistant" as const,
            type: "text" as const,
            content: msg.message,
            status: "sent" as const,
            timestamp: new Date(),
            document_url: msg.document_url,
          }),
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
      className={`flex flex-col h-full relative overflow-hidden transition-colors ${isDragging ? "bg-primary/5" : ""}`}
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
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

      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="grow overflow-y-auto no-scrollbar scroll-smooth"
      >
        <div className="max-w-3xl mx-auto w-full px-4 pt-2 pb-48 md:pb-36">
          <AnimatePresence initial={false}>
            {isLoadingHistory ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center pt-24 gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-on-surface-variant/40" />
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.2,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-surface-container-high"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">
                  Loading history…
                </span>
              </motion.div>
            ) : messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-start text-center pt-6 pb-4"
              >
                <motion.div
                  initial={{ scale: 0.85, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className="w-16 h-16 bg-primary/10 rounded-[1.4rem] flex items-center justify-center text-primary mb-4 shadow-xl shadow-primary/15 border border-primary/15 relative"
                >
                  <Sparkles size={30} className="animate-pulse" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-md"
                  >
                    AI
                  </motion.div>
                </motion.div>

                <h1 className="text-2xl font-headline font-black text-on-surface mb-1.5 tracking-tight leading-tight">
                  PadiPro Assistant
                </h1>
                <p className="text-on-surface-variant/70 max-w-xs mx-auto text-sm font-medium leading-relaxed mb-6 px-2">
                  {t.chat.welcome}
                </p>

                <div className="w-full px-1">
                  <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="h-px grow bg-surface-container-high" />
                    <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] whitespace-nowrap">
                      Suggested Actions
                    </span>
                    <div className="h-px grow bg-surface-container-high" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 + i * 0.05 }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSend(s.text)}
                        className="flex flex-col items-start gap-2.5 p-3.5 rounded-2xl border border-surface-container-high bg-white/60 backdrop-blur-sm text-left transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-primary/20 group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br ${s.gradient} border border-surface-container`}
                        >
                          <s.icon
                            className="text-on-surface-variant group-hover:text-primary transition-colors"
                            size={17}
                          />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-on-surface leading-tight block">
                            {s.text}
                          </span>
                          <span className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-wider">
                            Quick Query
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3 pt-2">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: Math.min(idx * 0.03, 0.15),
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                          isUser
                            ? "bg-primary text-white"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {isUser ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div
                        className={`flex flex-col gap-1 ${
                          msg.type === "image" || msg.type === "video"
                            ? "w-[75%]"
                            : "max-w-[80%] sm:max-w-[72%]"
                        } ${isUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`group relative rounded-2xl text-sm leading-relaxed transition-shadow duration-200 overflow-hidden ${
                            msg.type === "text" || msg.type === "audio"
                              ? "px-4 py-3"
                              : "w-full"
                          } ${
                            isUser
                              ? "bg-primary text-on-primary rounded-tr-sm hover:shadow-lg hover:shadow-primary/15"
                              : "bg-white text-on-surface border border-surface-container/70 rounded-tl-sm hover:shadow-md hover:shadow-black/5"
                          } ${msg.status === "sending" && msg.type !== "image" && msg.type !== "video" ? "opacity-70" : ""} ${msg.status === "failed" ? "border-error/50 bg-error-container/10 text-error ring-1 ring-error/20" : ""}`}
                        >
                          {msg.type === "image" && (
                            <>
                              <div
                                className={`relative group/img ${msg.status !== "sending" ? "cursor-zoom-in" : "cursor-default"}`}
                                onClick={() =>
                                  msg.status !== "sending" &&
                                  setLightboxSrc(msg.mediaUrl ?? "")
                                }
                              >
                                <img
                                  src={msg.mediaUrl}
                                  className="w-full max-h-72 object-cover block"
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
                                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/15 transition-colors flex items-center justify-center">
                                    <Maximize2
                                      className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-lg"
                                      size={24}
                                    />
                                  </div>
                                )}
                              </div>
                              {msg.content && (
                                <p
                                  className={`px-3 py-2.5 text-sm whitespace-pre-wrap border-t ${isUser ? "border-white/10" : "border-surface-container"}`}
                                >
                                  {msg.content}
                                </p>
                              )}
                            </>
                          )}
                          {msg.type === "video" && (
                            <>
                              <div className="relative">
                                <video
                                  src={msg.mediaUrl}
                                  controls={msg.status !== "sending"}
                                  className="w-full max-h-72 block"
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
                                  className={`px-3 py-2.5 text-sm whitespace-pre-wrap border-t ${isUser ? "border-white/10" : "border-surface-container"}`}
                                >
                                  {msg.content}
                                </p>
                              )}
                            </>
                          )}
                          {msg.type === "audio" && msg.mediaUrl && (
                            <AudioPlayer
                              id={msg.id}
                              activeAudioId={activeAudioId}
                              src={msg.mediaUrl}
                              variant={isUser ? "user" : "assistant"}
                              onPlay={setActiveAudioId}
                            />
                          )}
                          {msg.type === "text" && (
                            <>
                              <p className="whitespace-pre-wrap font-medium tracking-tight">
                                {msg.content}
                              </p>
                              {msg.document_url && (
                                <a
                                  href={msg.document_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                                >
                                  <Download size={14} />
                                  Download Solution Plan
                                </a>
                              )}
                            </>
                          )}

                          {/* Status and Action Buttons */}
                          <div
                            className={`absolute -bottom-2 ${isUser ? "-left-12" : "-right-12"} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                          >
                            {/* Copy button or similar could go here */}
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 px-1 ${isUser ? "flex-row-reverse" : ""}`}
                        >
                          <span
                            className={`text-[10px] font-semibold ${msg.status === "failed" ? "text-error" : "text-on-surface-variant/30"}`}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {isUser && (
                            <div className="flex items-center gap-2">
                              {msg.status === "sending" && (
                                <Loader2
                                  size={12}
                                  className="animate-spin text-primary"
                                />
                              )}
                              {msg.status === "failed" && (
                                <AlertCircle size={12} className="text-error" />
                              )}
                              {msg.status === "sent" && (
                                <div className="flex gap-0.5">
                                  <Check
                                    size={12}
                                    className="text-primary-fixed"
                                  />
                                </div>
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

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 items-start mt-3"
            >
              <div className="w-7 h-7 rounded-xl bg-surface-container flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} className="text-on-surface-variant/50" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-surface-container/70 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.18,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-primary/50"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-18 md:bottom-0 left-0 right-0 px-3 pt-6 pb-3 md:px-6 md:pb-5 bg-linear-to-t from-white via-white/95 to-transparent pointer-events-none z-50">
        <div className="max-w-2xl mx-auto w-full relative pointer-events-auto">
          {/* Media Preview Above Input */}
          <AnimatePresence>
            {media && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-2 bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl border border-surface-container shadow-lg flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-surface-container shrink-0">
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
                  <p className="text-sm font-bold text-on-surface truncate">
                    {media.file.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/50 uppercase font-semibold tracking-wider mt-0.5">
                    {(media.size / 1024 / 1024).toFixed(2)} MB • {media.type}
                  </p>
                </div>
                <button
                  onClick={() => setMedia(null)}
                  className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isRecording) handleSend();
            }}
            className="flex items-center gap-2 bg-white rounded-2xl px-2 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.09)] border border-surface-container/60 focus-within:border-primary/30 focus-within:shadow-[0_4px_28px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            {!isRecording && !audioURL && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-on-surface-variant/40 hover:text-primary transition-colors rounded-xl hover:bg-primary/5 cursor-pointer shrink-0"
                >
                  <Paperclip size={20} />
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
                  className="grow min-w-0 bg-transparent border-none py-2.5 px-1 text-sm font-medium focus:ring-0 outline-none max-h-32 scrollbar-hide text-on-surface placeholder:text-on-surface-variant/35 resize-none leading-relaxed"
                />
              </>
            )}

            {isRecording && (
              <div className="grow flex items-center gap-3 px-3 py-2">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [6, 16, 6] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-error rounded-full"
                    />
                  ))}
                </div>
                <span className="font-bold tabular-nums text-error text-sm">
                  {formatTime(recordingDuration)}
                </span>
                <span className="text-on-surface-variant/40 font-semibold text-[10px] uppercase tracking-wider">
                  Recording…
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
                  className="w-8 h-8 shrink-0 text-on-surface-variant/40 hover:text-error transition-all flex items-center justify-center cursor-pointer rounded-full hover:bg-error/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            {isRecording ? (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={stopRecording}
                className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center bg-error text-white shadow-lg shadow-error/20 cursor-pointer"
              >
                <Square size={16} fill="currentColor" />
              </motion.button>
            ) : (
              <div className="shrink-0">
                {!input.trim() && !media && !audioURL ? (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={startRecording}
                    disabled={isTyping}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isTyping
                        ? "bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed"
                        : "text-on-surface-variant/40 hover:text-primary hover:bg-primary/8"
                    }`}
                  >
                    <Mic size={20} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    type="submit"
                    disabled={
                      (!input.trim() && !media && !audioURL) || isTyping
                    }
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      (!input.trim() && !media && !audioURL) || isTyping
                        ? "bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed"
                        : "bg-primary text-white shadow-lg shadow-primary/25"
                    }`}
                  >
                    {isTyping ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </form>
          <p className="text-center text-[10px] font-medium text-on-surface-variant/20 mt-2 pointer-events-none">
            PadiPro can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
