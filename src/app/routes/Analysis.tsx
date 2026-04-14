import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, CheckCircle2, Hourglass } from "lucide-react";
import { motion } from "motion/react";
import Layout from "../../components/Layout";

export default function Analysis() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/results");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout activeTab="home">
      <main className="flex-1 px-6 flex flex-col items-center">
        {/* Thumbnail of Uploaded Crop */}
        <div className="w-full max-w-sm mb-12">
          <div className="relative group">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 1 }}
              className="aspect-square rounded-4xl overflow-hidden editorial-shadow transform"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9q2o9_24Ixu_tz4DZSNhrPQ3Z86Lk-YDuuwu39xD6XU0iRTgKjzPV602caIfjmz0lWCDiyQn4bCxfunvTd8Wg8NpOzqkD3xYzNLMx3eVyhSF3H6j0IlXzo3DMAoxILt1WYSMMx3TcfdnSCWfVHx8rJMYjz9ByMcXgkmuRyYucxv2XLe4jy6s_MeCehn3NjksaLeoWZglJUs2lSBcFOuNBlTDuDowCMHXtZJOD5PDL3hVHaxpjF7WLI7wF-aUpy9m-9tOXyxSent_a"
                alt="Crop Thumbnail"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/20 backdrop-overlay"></div>
            </motion.div>
            {/* Decorative Frame */}
            <div className="absolute -inset-2 border-2 border-primary/10 rounded-[2.5rem] -z-10 -rotate-2"></div>
          </div>
        </div>

        {/* Center Analysis Core */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-md w-full">
          <div className="relative flex items-center justify-center w-32 h-32">
            {/* Pulsing Green Circles */}
            <div className="absolute inset-0 bg-primary-fixed animate-pulse-ring rounded-full"></div>
            <div
              className="absolute inset-4 bg-primary-fixed-dim animate-pulse-ring rounded-full"
              style={{ animationDelay: "1s" }}
            ></div>
            {/* Center Spinning Leaf */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container editorial-shadow"
            >
              <Leaf className="w-10 h-10" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline font-bold text-3xl tracking-tight text-primary">
              Analyzing your crops...
            </h2>
            <p className="text-on-surface-variant font-medium">
              Checking weather conditions, identifying symptoms...
            </p>
          </div>

          {/* Status Chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium editorial-shadow"
            >
              <CheckCircle2 className="w-4 h-4 fill-white text-primary" />
              <span>🌿 Image analyzed</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium editorial-shadow"
            >
              <CheckCircle2 className="w-4 h-4 fill-white text-primary" />
              <span>🌦 Weather data fetched</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 }}
              className="flex items-center gap-2 bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full text-sm font-medium border border-outline-variant/15"
            >
              <Hourglass className="w-4 h-4 animate-pulse" />
              <span>🔬 Diagnosis ready</span>
            </motion.div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[60%] bg-linear-to-tr from-primary-fixed/20 to-transparent blur-[120px] -z-10 rounded-full opacity-60"></div>
      </main>
    </Layout>
  );
}
