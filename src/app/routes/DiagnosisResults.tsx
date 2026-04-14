import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  CloudRain,
  Thermometer,
  Wind,
  ShoppingCart,
} from "lucide-react";
import { motion } from "motion/react";
import Layout from "../../components/Layout";

export default function DiagnosisResults() {
  const navigate = useNavigate();

  return (
    <Layout activeTab="history">
      {/* Custom Top Bar */}
      <header className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
            PadiPro
          </h1>
        </div>
        <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
          <Share2 className="w-6 h-6 text-primary" />
        </button>
      </header>

      <main className="pt-24 px-4 space-y-6 max-w-2xl mx-auto pb-40">
        {/* Top Card: Visual Evidence */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv-Onq4PB2ngRnDxBbzwnxh5LVNZOcRRyn8zXvHEnmkyTO1QVMClpkGCchNPvsDvFXRxtLx5EisZANuudMDnEA59LFIL30qnN1xfrxLYztzw0qHUlnlifTE49tu-7ZJyNTYmukVtDQcBN5yJEXGFr64R9tkxtfnimYwpOe-ji26I8B2zPEvz2o8XcnQUlPya4bLdXKuYL-2zxK1WK4Ss8hTERrNlwnKYTmSauyOwPQ4VTCWhPh0r_pQpE6mqdEykKBgMO-3-Tjf9y1"
            alt="Disease Evidence"
            className="w-full h-64 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold uppercase tracking-wider shadow-lg">
              <AlertTriangle className="w-4 h-4 fill-current" />
              Blast Disease — Moderate Severity
            </div>
          </div>
        </motion.section>

        {/* Second Card: Diagnosis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl space-y-4 shadow-sm border border-surface-container"
        >
          <div className="flex justify-between items-start">
            <div className="editorial-stack">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Analysis Results
              </span>
              <h2 className="text-2xl font-headline font-bold text-primary mt-1">
                Diagnosis
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-headline font-extrabold text-primary">
                92%
              </span>
              <span className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant">
                Confidence
              </span>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-lg border-l-4 border-primary">
            <h3 className="text-lg font-headline font-bold text-on-surface">
              Magnaporthe oryzae
            </h3>
            <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
              Commonly known as Rice Blast. This fungal pathogen is highly
              invasive under current moisture levels.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-label text-xs font-semibold text-on-surface-variant uppercase">
              Observed Symptoms
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Spindle-shaped necrotic lesions</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Ash-gray centers with brown borders</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Leaf drying and premature senescence</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Third Card: Weather Factors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="px-2 font-headline font-bold text-on-surface">
            Weather Factors
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-high p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <Droplets className="w-6 h-6 text-primary mb-2" />
              <span className="text-lg font-headline font-bold text-on-surface">
                88%
              </span>
              <span className="text-[10px] font-label uppercase text-on-surface-variant">
                Humidity
              </span>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <CloudRain className="w-6 h-6 text-primary mb-2" />
              <span className="text-lg font-headline font-bold text-on-surface">
                12mm
              </span>
              <span className="text-[10px] font-label uppercase text-on-surface-variant">
                Rainfall
              </span>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <Thermometer className="w-6 h-6 text-primary mb-2" />
              <span className="text-lg font-headline font-bold text-on-surface">
                26°C
              </span>
              <span className="text-[10px] font-label uppercase text-on-surface-variant">
                Temp
              </span>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <Wind className="w-6 h-6 text-primary mb-2" />
              <span className="text-lg font-headline font-bold text-on-surface">
                14km/h
              </span>
              <span className="text-[10px] font-label uppercase text-on-surface-variant">
                Wind
              </span>
            </div>
          </div>
        </motion.section>

        {/* Fourth Card: Recommended Treatment */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl space-y-5 shadow-sm border border-surface-container"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-fixed rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-headline font-bold text-on-surface">
              Recommended Treatment
            </h3>
          </div>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-primary-fixed-dim space-y-1">
              <div className="absolute -left-1.25 top-0 w-2 h-2 rounded-full bg-primary"></div>
              <p className="font-label text-[10px] uppercase font-bold text-primary tracking-widest">
                Primary Product
              </p>
              <h4 className="font-headline font-bold text-on-surface text-base">
                FungiGuard Pro 500SC
              </h4>
              <p className="text-sm text-on-surface-variant">
                Dosage: 250ml / Hectare
              </p>
            </div>
            <div className="relative pl-6 border-l-2 border-primary-fixed-dim space-y-1">
              <div className="absolute -left-1.25 top-0 w-2 h-2 rounded-full bg-primary-fixed-dim"></div>
              <p className="font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
                Application Timeline
              </p>
              <h4 className="font-headline font-bold text-on-surface text-base">
                Next 24 Hours
              </h4>
              <p className="text-sm text-on-surface-variant">
                Apply before expected rain at 04:00 PM tomorrow.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-24 left-0 w-full px-6 z-40">
        <button className="w-full bg-primary text-white py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-headline font-bold tracking-tight">
            Order Treatment Now
          </span>
        </button>
      </div>
    </Layout>
  );
}
