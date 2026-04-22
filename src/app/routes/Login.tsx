import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  CheckCircle,
  Leaf,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateOTPAPI, verifyOTPAPI } from "@features/auth/api/auth";
import { useAuth } from "@context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNo) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: Uncomment when backend is hosted
      // const response = await generateOTPAPI(mobileNo);
      // if (response && response.ok) {
      //   setStep("otp");
      // } else {
      //   setError("Failed to send OTP. Please check your mobile number.");
      // }
      setStep("otp");
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error occurred while generating OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: Uncomment when backend is hosted
      // const response = await verifyOTPAPI(mobileNo, otp);
      // if (response && response.ok) {
      //   await login(mobileNo);
      //   navigate("/weather");
      // } else {
      //   setError("Invalid OTP. Please try again.");
      // }
      await login(mobileNo);
      navigate("/weather");
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
        className="w-full max-w-md bg-surface shadow-2xl rounded-3xl overflow-hidden flex flex-col h-203"
      >
        <section className="hero-gradient h-[40%] flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1536647167699-0a6ea1b43343?q=80&w=2670&auto=format&fit=crop"
              alt="Paddy Field"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Leaf className="w-10 h-10 text-primary-fixed" />
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-white text-4xl tracking-tight mb-1">
                PaddyAI
              </h1>
              <p className="font-label text-primary-fixed text-xs font-medium tracking-widest uppercase">
                Smart Field Intelligence
              </p>
            </div>
          </div>
        </section>

        <section className="grow bg-white rounded-tr-4xl -mt-8 relative z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] px-8 pt-10 pb-6 overflow-y-auto">
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
                    Get Started
                  </h2>
                  <p className="font-body text-on-surface-variant text-sm mt-1">
                    Enter your mobile number to receive a WhatsApp OTP.
                  </p>
                </header>

                <form onSubmit={handleGenerateOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      Mobile Number
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
                        Send code via WhatsApp{" "}
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
                    onClick={() => setStep("mobile")}
                    className="text-primary text-xs font-bold uppercase tracking-widest mb-4 hover:underline cursor-pointer"
                  >
                    ← Change number
                  </button>
                  <h2 className="font-headline font-bold text-2xl text-on-surface">
                    Verify Identity
                  </h2>
                  <p className="font-body text-on-surface-variant text-sm mt-1">
                    We sent a verification code to WhatsApp{" "}
                    <strong>+{mobileNo}</strong>
                  </p>
                </header>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      OTP Code
                    </label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-mono tracking-[0.5em] text-lg font-bold"
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
                        Verify & Continue <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-on-surface-variant">
                    Didn't receive code?
                    <button
                      type="button"
                      onClick={handleGenerateOTP}
                      className="text-primary font-bold ml-1 hover:underline cursor-pointer"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-auto pt-8 text-center border-t border-surface-container/50 mb-2">
            <p className="font-label text-xs text-on-surface-variant">
              By continuing, you agree to PaddyAI's
              <br />
              <span className="text-primary font-bold">
                Terms of Service
              </span>{" "}
              and <span className="text-primary font-bold">Privacy Policy</span>
            </p>
          </footer>
        </section>
      </motion.main>
    </div>
  );
}
