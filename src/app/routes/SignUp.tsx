import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  ShieldCheck,
  MapPin,
  Map as MapIcon,
} from "lucide-react";
import { motion } from "motion/react";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHLUDTg1lAaUF32DS-YX13mwUon9zThuknHNyjJjHkfiAMD7YJjmLaZol70pgcPelTDkPdSMARuQNpb99pvWjbmTKTP_7TmrCX8Cmrqf0pY2uAsACscSuiL9jtMQuJAC-cJIIoJeboqtqErcSsEExoExJGagFYwj6u-Ulr0liECdlkVjAKwAiyPsjI5P5GcBKU70AnuzTy7gAuQ4Y93VJHrn_BqFbgHoq9Uw8eu70KN7HP_yQw23YMN-7zV_jPmzCUKfMv_ha0XuU8"
          alt="Rice Terraces"
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-on-surface via-transparent to-transparent opacity-60"></div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg mt-12 px-4 pb-12"
      >
        <div className="text-center mb-8 px-6">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white mb-2">
            PadiPro
          </h1>
          <p className="font-label text-sm uppercase tracking-widest text-primary-fixed opacity-90">
            Cultivate Your Future
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-4xl p-8 shadow-2xl">
          <header className="mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Join the community
            </h2>
            <p className="font-body text-on-surface-variant text-sm mt-1">
              Start optimizing your yield today with smart insights.
            </p>
          </header>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="font-label text-xs font-semibold uppercase tracking-wider text-outline px-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Johnathan Doe"
                  className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body placeholder:text-outline-variant"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-label text-xs font-semibold uppercase tracking-wider text-outline px-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000"
                    className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body placeholder:text-outline-variant"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label text-xs font-semibold uppercase tracking-wider text-outline px-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body placeholder:text-outline-variant"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-label text-xs font-semibold uppercase tracking-wider text-outline px-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body placeholder:text-outline-variant"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label text-xs font-semibold uppercase tracking-wider text-outline px-1">
                  Confirm
                </label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body placeholder:text-outline-variant"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs font-semibold uppercase tracking-wider text-outline px-1">
                Farm Location
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Select location on map"
                  className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-12 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-body placeholder:text-outline-variant"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary-container transition-colors"
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full h-24 mt-2 rounded-xl overflow-hidden grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer border border-outline-variant/20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdar9PDQu7dkN9gcJnZ6WOmc0NYv3kdnO3rE9Y0vs-Ek4KhOyE7xF47b4lFBGH6y9kYndLYxsyL4awTe0k7UeBIGEUnGShN18Ge4EfJlel0UG_Y-gkAWm8xnUYbmdk7S9wX0_Jok3SxJuDZAjJy3NvmqkWHjK0nit29_GwWWx8UElWSVOPNMOedO8gv3AiHvf21VNH_PVLULMV9R7G0Cg2xUEQPzDSvdGxmoyg5L8gMxLi7p-5GQY9GHnsXpi8_czdxnFbWwFMHmPo"
                  alt="Map Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="hero-gradient w-full py-4 rounded-xl text-white font-headline font-bold text-lg shadow-lg active:scale-[0.98] transition-all mt-4"
            >
              Create Account
            </button>
          </form>

          <footer className="mt-8 pt-6 border-t border-surface-container-high text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Already have an account?
              <Link
                to="/login"
                className="text-primary font-bold hover:underline ml-1"
              >
                Log In
              </Link>
            </p>
          </footer>
        </div>

        <p className="text-center mt-6 text-[11px] font-label text-white/50 px-8 leading-relaxed">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy regarding your agricultural data.
        </p>
      </motion.main>
    </div>
  );
}
