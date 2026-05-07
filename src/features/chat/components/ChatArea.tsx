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
} from "lucide-react";
import { useLanguage } from "@context/lang/useLanguage";
import type { Message } from "@datatypes/chatType";
import AudioPlayer from "./AudioPlayer";
import { useAuth } from "@context/auth/useAuth";
import { uploadChatFile } from "../api/chat";

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

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
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
      content: initialContent,
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

    // 3. Background process for uploads
    if (currentMedia || currentAudio) {
      (async () => {
        try {
          let fileToUpload: File;
          if (currentMedia) {
            fileToUpload = currentMedia.file;
          } else {
            const blob = new Blob(currentAudioChunks, { type: "audio/webm" });
            fileToUpload = new File([blob], "audio_message.webm", {
              type: "audio/webm",
            });
          }

          const finalUrl = await uploadChatFile(fileToUpload);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, content: finalUrl, status: "sent" }
                : msg,
            ),
          );
        } catch (error) {
          console.error("Upload failed:", error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: "failed" } : msg,
            ),
          );
        }
      })();
    }

    // 4. Assistant Response Loop
    setIsTyping(true);
    setTimeout(() => {
      let aiResponse = `I've received your request about "${finalInput || "the file"}". As PaddyAI, I'm analyzing the field data...`;

      if (currentMedia) {
        aiResponse =
          currentMedia.type === "image"
            ? "Analysis complete. I've detected symptoms of Nitrogen deficiency on the leaves. Consider applying targeted fertilization in the northern sector."
            : "Video review suggests efficient irrigation patterns, but the soil moisture sensors in Plot B are indicating slight underwatering.";
      } else if (currentAudio) {
        aiResponse =
          "I have processed your audio message. Based on your description, I recommend scheduling a field inspection for pests soon.";
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        type: "text",
        content: aiResponse,
        status: "sent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
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
        <div className="max-w-3xl mx-auto w-full px-4 pt-0 md:pt-0 pb-80 md:pb-48">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-start text-center pt-12 md:pt-16 pb-12"
              >
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20 border border-primary/20 relative"
                >
                  <Sparkles size={48} className="animate-pulse" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
                  >
                    AI
                  </motion.div>
                </motion.div>

                <h1 className="text-5xl font-headline font-black text-on-surface mb-4 tracking-tighter leading-tight">
                  PaddyAI Assistant
                </h1>
                <p className="text-on-surface-variant/80 max-w-lg mx-auto text-xl font-medium leading-relaxed mb-16 px-6">
                  {t.chat.welcome}
                </p>

                <div className="w-full max-w-2xl px-4">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="h-px grow bg-surface-container-high" />
                    <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] whitespace-nowrap">
                      Suggested Actions
                    </span>
                    <div className="h-px grow bg-surface-container-high" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        whileHover={{
                          scale: 1.02,
                          y: -2,
                          backgroundColor:
                            "rgb(var(--primary-container) / 0.15)",
                          borderColor: "rgb(var(--primary) / 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(s.text)}
                        className={`flex items-center gap-5 p-6 rounded-4xl border border-surface-container-high bg-white/50 backdrop-blur-sm text-left transition-all group overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md`}
                      >
                        <div
                          className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-linear-to-br ${s.gradient} border border-surface-container group-hover:scale-110 transition-transform duration-500`}
                        >
                          <s.icon
                            className="text-on-surface-variant group-hover:text-primary transition-colors"
                            size={28}
                          />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-on-surface leading-tight block mb-0.5">
                            {s.text}
                          </span>
                          <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                            Quick Query
                          </span>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
                          <Sparkles size={60} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: Math.min(idx * 0.05, 0.2),
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
                          isUser
                            ? "bg-primary text-white border-primary/20"
                            : "bg-surface-container-low text-on-surface border-surface-container"
                        }`}
                      >
                        {isUser ? <User size={20} /> : <Bot size={20} />}
                      </motion.div>
                      <div
                        className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`group relative px-6 py-5 rounded-4xl shadow-sm text-lg leading-relaxed transition-all duration-300 ${
                            isUser
                              ? "bg-primary text-on-primary rounded-tr-none hover:shadow-xl hover:shadow-primary/10"
                              : "bg-white text-on-surface border border-surface-container/60 rounded-tl-none hover:shadow-xl hover:shadow-black/5"
                          } ${msg.status === "sending" ? "opacity-75 blur-[0.5px]" : ""} ${msg.status === "failed" ? "border-error/50 bg-error-container/10 text-error ring-2 ring-error/20" : ""}`}
                        >
                          {msg.type === "image" && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="mb-4 rounded-2xl overflow-hidden shadow-2xl border border-surface-container group/img relative cursor-zoom-in"
                              onClick={() => setLightboxSrc(msg.content)}
                            >
                              <img
                                src={msg.content}
                                className="w-full max-h-125 object-cover"
                                alt="Shared image"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                                <Maximize2
                                  className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-lg"
                                  size={32}
                                />
                              </div>
                            </motion.div>
                          )}
                          {msg.type === "video" && (
                            <div className="mb-4 rounded-2xl overflow-hidden shadow-2xl border border-surface-container group relative">
                              <video
                                src={msg.content}
                                controls
                                className="w-full max-h-125"
                              />
                            </div>
                          )}
                          {msg.type === "audio" && (
                            <div className="py-1">
                              <AudioPlayer
                                id={msg.id}
                                activeAudioId={activeAudioId}
                                src={msg.content}
                                variant={isUser ? "user" : "assistant"}
                                onPlay={setActiveAudioId}
                              />
                            </div>
                          )}
                          {msg.type === "text" && (
                            <p className="whitespace-pre-wrap font-medium tracking-tight">
                              {msg.content}
                            </p>
                          )}

                          {/* Status and Action Buttons */}
                          <div
                            className={`absolute -bottom-2 ${isUser ? "-left-12" : "-right-12"} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                          >
                            {/* Copy button or similar could go here */}
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-2 px-3 ${isUser ? "flex-row-reverse" : ""}`}
                        >
                          <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${msg.status === "failed" ? "text-error" : "text-on-surface-variant/30"}`}
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 items-start mt-8"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-on-surface-variant/40" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-primary/20 rounded-2xl -z-1"
                />
              </div>
              <div className="bg-white px-6 py-5 rounded-4xl rounded-tl-none border border-surface-container/60 shadow-xl shadow-black/5 flex items-center gap-2">
                <span className="text-sm font-black text-on-surface-variant/30 uppercase tracking-[0.2em] mr-2">
                  Assistant Thinking
                </span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                        backgroundColor: [
                          "#E2E8F0",
                          "rgb(var(--primary))",
                          "#E2E8F0",
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.2,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-surface-container-high"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-21 md:bottom-0 left-0 right-0 p-4 md:p-8 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none z-50">
        <div className="max-w-3xl mx-auto w-full relative pointer-events-auto">
          {/* Media Preview Above Input */}
          <AnimatePresence>
            {media && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-4 bg-white/90 backdrop-blur-xl p-3 rounded-3xl border border-surface-container shadow-2xl flex items-center gap-4 ring-1 ring-black/5"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner border border-surface-container shrink-0">
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
                  <p className="text-sm font-black text-on-surface truncate">
                    {media.file.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-0.5">
                    {(media.size / 1024 / 1024).toFixed(2)} MB • {media.type}
                  </p>
                </div>
                <button
                  onClick={() => setMedia(null)}
                  className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm cursor-pointer mr-2"
                >
                  <X size={24} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isRecording) {
                handleSend();
              }
            }}
            className="group relative flex items-center gap-2 bg-white rounded-[2.5rem] p-2 pr-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] transition-all duration-500 border border-surface-container/50 focus-within:ring-8 focus-within:ring-primary/5 focus-within:border-primary/30"
          >
            {!isRecording && !audioURL && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-on-surface-variant/40 hover:text-primary transition-all h-14 w-14 flex items-center justify-center cursor-pointer hover:bg-primary/5 rounded-full"
                >
                  <Paperclip size={26} />
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
                  className="grow min-w-0 bg-transparent border-none py-4 px-2 text-lg font-medium focus:ring-0 outline-none max-h-40 scrollbar-hide text-on-surface placeholder:text-on-surface-variant/30 resize-none leading-relaxed"
                />
              </>
            )}

            {isRecording && (
              <div className="grow flex items-center gap-4 px-6 py-3.5 h-14 text-on-surface">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 20, 8] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-error rounded-full"
                    />
                  ))}
                </div>
                <span className="font-black tabular-nums text-error tracking-tighter text-lg">
                  {formatTime(recordingDuration)}
                </span>
                <span className="text-on-surface-variant/40 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
                  Capturing Audio...
                </span>
              </div>
            )}

            {audioURL && !isRecording && (
              <div className="flex-1 min-w-0 flex items-center gap-2 md:gap-4 px-2 md:px-4 h-14">
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
                  className="w-10 h-10 md:w-12 md:h-12 shrink-0 text-on-surface-variant/40 hover:text-error transition-all flex items-center justify-center cursor-pointer rounded-full hover:bg-error/10"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            )}

            {isRecording ? (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={stopRecording}
                className="h-14 w-14 rounded-full shrink-0 flex items-center justify-center transition-all bg-error text-white shadow-xl shadow-error/20 cursor-pointer"
              >
                <Square size={20} fill="currentColor" />
              </motion.button>
            ) : (
              <div className="flex gap-1 shrink-0">
                {!input.trim() && !media && !audioURL ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={startRecording}
                    disabled={isTyping}
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTyping
                        ? "bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed"
                        : "text-on-surface-variant/40 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Mic size={26} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={
                      (!input.trim() && !media && !audioURL) || isTyping
                    }
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      (!input.trim() && !media && !audioURL) || isTyping
                        ? "bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed"
                        : "bg-primary text-white shadow-2xl shadow-primary/30"
                    }`}
                  >
                    {isTyping ? (
                      <Loader2 size={26} className="animate-spin" />
                    ) : (
                      <Send size={26} />
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </form>
          <p className="text-center text-[10px] font-bold text-on-surface-variant/20 mt-4 uppercase tracking-[0.2em] pointer-events-none">
            PaddyAI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
