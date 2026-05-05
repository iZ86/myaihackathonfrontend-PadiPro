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
} from "lucide-react";
import { useLanguage } from "@context/lang/useLanguage";
import type { Message } from "@datatypes/chatType";
import AudioPlayer from "./AudioPlayer";

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
        const generatedBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(generatedBlob);
        setAudioURL(audioUrl);
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

    let messageType: Message["type"] = "text";
    let mediaUrlValue: string | undefined = undefined;
    let contentValue = finalInput;

    if (media) {
      messageType = media.type;
      mediaUrlValue = media.previewUrl;
    } else if (audioURL) {
      messageType = "audio";
      mediaUrlValue = audioURL;
      // Audio messages show "Voice message" as display text
      contentValue = contentValue || "Voice message";
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: contentValue,
      type: messageType,
      mediaUrl: mediaUrlValue,
      mediaType:
        messageType === "text"
          ? undefined
          : (messageType as Message["mediaType"]),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const currentMedia = media;
    const currentAudio = audioURL;
    setMedia(null);
    // Do NOT revoke audioURL here — the message still references it
    setAudioURL(null);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = `I've received your request about "${userMessage.content || "the file"}". As PaddyAI, I'm analyzing the field data...`;

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
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden ${isDragging ? "bg-primary/5" : ""}`}
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
            className="fixed inset-0 z-100 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightboxSrc}
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
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
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 pb-48">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/10">
                  <Sparkles size={40} className="animate-pulse" />
                </div>
                <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-3 tracking-tight">
                  PaddyAI Assistant
                </h1>
                <p className="text-on-surface-variant max-w-md mx-auto text-lg font-medium leading-relaxed mb-12">
                  {t.chat.welcome}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgb(var(--primary-container) / 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(s.text)}
                      className={`flex items-center gap-4 p-5 rounded-3xl border border-surface-container-high bg-surface-container-lowest text-left transition-all group overflow-hidden relative cursor-pointer`}
                    >
                      <div
                        className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br ${s.gradient} border border-surface-container`}
                      >
                        <s.icon
                          className="text-on-surface-variant group-hover:text-primary transition-colors"
                          size={24}
                        />
                      </div>
                      <span className="text-sm font-bold text-on-surface leading-tight">
                        {s.text}
                      </span>
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity">
                        <Sparkles size={40} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                          isUser
                            ? "bg-primary text-white border-primary/10"
                            : "bg-surface-container-low text-on-surface border-surface-container"
                        }`}
                      >
                        {isUser ? <User size={18} /> : <Bot size={18} />}
                      </div>
                      <div
                        className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-5 py-4 rounded-3xl shadow-sm text-lg leading-relaxed ${
                            isUser
                              ? "bg-primary text-on-primary rounded-tr-none"
                              : "bg-white text-on-surface border border-surface-container rounded-tl-none"
                          }`}
                        >
                          {msg.mediaUrl && msg.mediaType !== "audio" && (
                            <div
                              className="mb-4 rounded-2xl overflow-hidden shadow-inner border border-surface-container group relative cursor-zoom-in"
                              onClick={() =>
                                msg.mediaType === "image" &&
                                setLightboxSrc(msg.mediaUrl!)
                              }
                            >
                              {msg.mediaType === "image" ? (
                                <img
                                  src={msg.mediaUrl}
                                  className="w-full max-h-80 object-cover"
                                />
                              ) : (
                                <video
                                  src={msg.mediaUrl}
                                  controls
                                  className="w-full max-h-80"
                                />
                              )}
                            </div>
                          )}
                          {msg.mediaUrl && msg.mediaType === "audio" && (
                            <div
                              className={
                                msg.content && msg.content !== "Voice message"
                                  ? "mb-3"
                                  : ""
                              }
                            >
                              <AudioPlayer
                                id={msg.id}
                                activeAudioId={activeAudioId}
                                src={msg.mediaUrl}
                                variant={isUser ? "user" : "assistant"}
                                onPlay={setActiveAudioId}
                              />
                            </div>
                          )}
                          {msg.content && msg.content !== "Voice message" && (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant/40 px-2 uppercase tracking-widest">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-start mt-8"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-center animate-pulse">
                <Bot size={18} className="text-on-surface-variant" />
              </div>
              <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-none border border-surface-container shadow-sm flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-primary/40"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/70 backdrop-blur-xl border-t border-surface-container/50 z-50">
        <div className="max-w-3xl mx-auto w-full relative">
          {/* Media Preview Above Input */}
          <AnimatePresence>
            {media && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-surface-container shadow-lg flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-inner border border-surface-container">
                  {media.type === "image" ? (
                    <img
                      src={media.previewUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.previewUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="grow min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">
                    {media.file.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tight">
                    {(media.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setMedia(null)}
                  className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm"
                >
                  <X size={20} />
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
            className="group relative flex items-center gap-2 bg-white rounded-[2.5rem] p-2 pr-2.5 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all border border-surface-container focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/40"
          >
            {!isRecording && !audioURL && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-on-surface-variant hover:text-primary transition-colors h-13.5 w-13.5 flex items-center justify-center cursor-pointer hover:bg-primary/5 active:scale-95 rounded-full"
                >
                  <Paperclip size={24} />
                </button>
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
                  className="grow bg-transparent border-none py-4 px-1 text-lg focus:ring-0 outline-none max-h-40 scrollbar-hide font-medium text-on-surface placeholder:text-on-surface-variant/40 resize-none"
                />
              </>
            )}

            {isRecording && (
              <div className="grow flex items-center gap-3 px-4 py-3.5 h-13.5 text-on-surface">
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-3 h-3 rounded-full bg-error"
                />
                <span className="font-bold tabular-nums text-error">
                  {formatTime(recordingDuration)}
                </span>
                <span className="text-on-surface-variant/60 font-medium text-md ml-2">
                  Recording audio...
                </span>
              </div>
            )}

            {audioURL && !isRecording && (
              <div className="grow flex items-center gap-3 px-2 h-13.5">
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
                  className="w-10 h-10 shrink-0 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center cursor-pointer rounded-full hover:bg-error/10"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}

            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="h-13.5 w-13.5 rounded-full shrink-0 flex items-center justify-center transition-all bg-error text-white shadow-lg shadow-error/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Square size={20} fill="currentColor" />
              </button>
            ) : (
              <div className="flex gap-1 shrink-0">
                {!input.trim() && !media && !audioURL ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isTyping}
                    className={`h-13.5 w-13.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTyping
                        ? "bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed"
                        : "text-on-surface-variant hover:text-primary hover:bg-primary/5 active:scale-95"
                    }`}
                  >
                    <Mic size={24} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      (!input.trim() && !media && !audioURL) || isTyping
                    }
                    className={`h-13.5 w-13.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      (!input.trim() && !media && !audioURL) || isTyping
                        ? "bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed"
                        : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isTyping ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Send size={24} />
                    )}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
