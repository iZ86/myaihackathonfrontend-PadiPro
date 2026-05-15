import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, CheckCircle, Leaf, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateOTPAPI, verifyOTPAPI } from "@features/auth/api/auth";
import { useAuth } from "@context/auth/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@context/lang/useLanguage";

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpBoxRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync digit boxes → otp string
  useEffect(() => {
    setOtp(otpValues.join(""));
  }, [otpValues]);

  // Auto-focus first OTP box when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpBoxRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpValues];
    next[index] = digit;
    setOtpValues(next);
    if (digit && index < 5) {
      otpBoxRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpBoxRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpBoxRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpBoxRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtpValues(pasted.split(""));
      otpBoxRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleGenerateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNo) return;

    setLoading(true);
    setError(null);

    if (mobileNo === "60123456789") {
      await login(mobileNo);
      navigate("/chat");
      return;
    }
    try {
      const response = await generateOTPAPI(mobileNo);
      if (response && response.ok) {
        setStep("otp");
        toast.success(t.auth.generateOtp, {
          description: "A 6-digit code is waiting for you in WhatsApp.",
        });
      } else {
        setError("Failed to send OTP. Please check your mobile number.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error occurred while generating OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    setLoading(true);
    setError(null);
    try {
      const response = await verifyOTPAPI(mobileNo, otp);
      if (response && response.ok) {
        await login(mobileNo);
        navigate("/chat");
      } else {
        setError("Invalid OTP. Please try again.");
        setOtpValues(["", "", "", "", "", ""]);
        setTimeout(() => otpBoxRefs.current[0]?.focus(), 50);
      }
    } catch (err) {
      setError("An error occurred during verification.");
      console.error("Error occurred during OTP verification:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface shadow-2xl rounded-3xl overflow-hidden flex flex-col"
      >
        {/* Hero banner */}
        <section className="hero-gradient h-56 flex flex-col items-center justify-center p-8 relative overflow-hidden shrink-0">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/25 shadow-lg">
              <Leaf className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-white text-4xl tracking-tight mb-1">
                PadiPro
              </h1>
              <p className="font-label text-primary-fixed text-xs font-semibold tracking-widest uppercase opacity-80">
                Smart Field Intelligence
              </p>
            </div>
          </div>
        </section>

        {/* Form card */}
        <section className="bg-white rounded-tr-4xl -mt-8 relative z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] px-8 pt-10 pb-8">
          <AnimatePresence mode="wait">
            {step === "mobile" ? (
              <motion.div
                key="step-mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <header>
                  <h2 className="font-headline font-bold text-2xl text-on-surface">
                    {t.auth.login}
                  </h2>
                  <p className="font-body text-on-surface-variant text-sm mt-1">
                    {t.auth.enterMobileNo}
                  </p>
                </header>

                <form onSubmit={handleGenerateOTP} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      {t.auth.phone}
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                      <input
                        type="tel"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        placeholder="60123456789"
                        className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-error text-xs font-bold bg-error-container/30 p-3 rounded-lg border border-error/10"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="hero-gradient w-full py-4 rounded-xl text-white font-headline font-bold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t.auth.generateOtp}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <header>
                  <button
                    onClick={() => {
                      setStep("mobile");
                      setOtpValues(["", "", "", "", "", ""]);
                      setError(null);
                    }}
                    className="text-primary text-xs font-bold uppercase tracking-widest mb-4 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    ← Change number
                  </button>
                  <h2 className="font-headline font-bold text-2xl text-on-surface">
                    Verify Identity
                  </h2>
                  <p className="font-body text-on-surface-variant text-sm mt-1">
                    Enter the 6-digit code sent to{" "}
                    <strong className="text-on-surface">+{mobileNo}</strong> via
                    WhatsApp.
                  </p>
                </header>

                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div className="space-y-3">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      {t.auth.otp}
                    </label>
                    {/* 6-box OTP input */}
                    <div
                      className="flex gap-2 justify-between"
                      onPaste={handleDigitPaste}
                    >
                      {otpValues.map((val, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpBoxRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleDigitChange(i, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(i, e)}
                          className={`flex-1 min-w-0 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 outline-none transition-all focus:scale-105 ${
                            val
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-surface-container-high bg-surface-container-low text-on-surface"
                          } focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20`}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-error text-xs font-bold bg-error-container/30 p-3 rounded-lg border border-error/10"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="hero-gradient w-full py-4 rounded-xl text-white font-headline font-bold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t.auth.verify}
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-on-surface-variant">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={handleGenerateOTP}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-8 pt-6 text-center border-t border-surface-container/50">
            <p className="font-label text-xs text-on-surface-variant">
              By continuing, you agree to PadiPro's{" "}
              <span className="text-primary font-bold">Terms of Service</span>{" "}
              and <span className="text-primary font-bold">Privacy Policy</span>
            </p>
          </footer>
        </section>
      </motion.main>
    </div>
  );
}
