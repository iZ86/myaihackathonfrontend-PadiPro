import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, EyeOff, Leaf } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface shadow-2xl rounded-3xl overflow-hidden flex flex-col h-200"
      >
        <section className="hero-gradient h-[45%] flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdoqEfJez4xN4OC_4l21uMbjfS0A31HOnYweOQMjmQLX2w-DhujMGCgUOQw-UY9XBsn11aXOQAsHQloozS0s8u1NeqejRqrUewu6X4TcXnwDZ-t-zg5e6UEzt2HiXE8JRucrZf89gX0LZUO57_fgnbQRhwuBdkAkWnSPPPr3QLzvf26w8P2POTzvG5HchyeC3bi8NHISBREgmGE7h5sqsJxUETMVUVSfx_-SlEpQDL35QS9tQdbx3ay97tUFsiO11dI8qII3p7toCu"
              alt="Paddy Field"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Leaf className="w-10 h-10 text-primary-fixed" />
            </div>
            <div className="text-center">
              <h1 className="font-headline font-extrabold text-4xl tracking-tight text-white mb-1">
                PadiPro
              </h1>
              <p className="font-label text-primary-fixed text-sm font-medium tracking-wide">
                Smart crop care for every farmer.
              </p>
            </div>
          </div>
        </section>

        <section className="grow bg-white rounded-t-4xl -mt-8 relative z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] px-8 pt-10 pb-6 overflow-y-auto">
          <header className="mb-8">
            <h2 className="font-headline font-bold text-2xl text-on-surface">
              Welcome back
            </h2>
            <p className="font-body text-on-surface-variant text-sm mt-1">
              Ready to manage your harvest today?
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                Email or Phone
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="farmer@PadiPro.com"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-primary font-label text-sm font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="hero-gradient w-full py-4 rounded-xl text-white font-headline font-bold text-base shadow-lg shadow-primary/10 active:scale-[0.98] transition-transform"
            >
              Log In
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-container-highest"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
              <span className="px-3 bg-white text-on-surface-variant/50">
                — or —
              </span>
            </div>
          </div>

          <button className="w-full bg-white border-2 border-surface-container-highest py-3.5 rounded-xl font-label font-semibold text-on-surface flex items-center justify-center space-x-3 active:bg-surface-container-low transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <footer className="mt-8 text-center pb-4">
            <p className="font-label text-sm text-on-surface-variant">
              Don't have an account?
              <Link
                to="/signup"
                className="text-primary font-bold ml-1 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </footer>
        </section>
      </motion.main>
    </div>
  );
}
