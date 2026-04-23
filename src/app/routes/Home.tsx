import { useNavigate } from "react-router-dom";
import { Camera, Image as ImageIcon, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Layout from "../../components/Layout";

export default function Home() {
  const navigate = useNavigate();

  const handleUpload = () => {
    navigate("/analysis");
  };

  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-4xl p-8 min-h-55 flex flex-col justify-end hero-gradient shadow-lg"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <span className="font-label text-[11px] uppercase tracking-widest text-on-primary-container/80 mb-2 block font-medium">
                Crop Health Intelligence
              </span>
              <h2 className="font-headline text-3xl font-extrabold text-on-primary leading-tight mb-2">
                Diagnose your crops instantly.
              </h2>
              <p className="text-on-primary-container/90 text-sm max-w-60 leading-relaxed">
                Advanced AI analysis for pests, diseases, and nutrient
                deficiencies.
              </p>
            </div>
            {/* Decorative leaf texture background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpomuZBV8KmWIj04xoaszCSGgg08TcsXb5nerTVkNurV5kV8_WkL4Eu_jayuiUx0axLKWcb1q2HKFMqhULmxt0-ZRAuohU0U5kkqNZTfylahAhIeNKyDqQdVPoYbpOZpkLzYI1YdDSzSBEjZZ37d4nWSP5MAFe_cFIdIam55gQCxVOu8czsCzr0YooSoJXVOp0Seh6GSc5cQ4dnO-WANgbspo6LY5Mgzyklj6lcWMIjugxvkzM8x7w40KFEDOtZ2U2ISbivTkkRP6j"
                alt="Leaf Pattern"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </section>

        {/* Upload Zone */}
        <section className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleUpload}
            className="dashed-border bg-surface-container-low p-8 text-center flex flex-col items-center justify-center min-h-80 transition-all cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10 text-primary fill-primary/10" />
            </div>
            <h3 className="font-headline text-xl font-bold text-primary mb-2">
              Take a photo or upload from gallery
            </h3>
            <p className="text-on-surface-variant text-sm font-body max-w-70">
              Position the leaf clearly in the center of the frame for best
              results.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleUpload}
              className="flex items-center justify-center gap-3 py-4 px-6 hero-gradient text-white rounded-xl font-headline font-semibold shadow-md active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>
            <button
              onClick={handleUpload}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-highest text-on-surface rounded-xl font-headline font-semibold active:scale-95 transition-all"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Input Section */}
          <div className="mt-10">
            <label className="block font-label text-[11px] uppercase tracking-widest text-primary font-bold mb-3 px-1">
              Additional Context
            </label>
            <div className="relative">
              <textarea
                className="w-full bg-surface-container-high border-none rounded-2xl p-5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-body text-sm resize-none outline-none"
                placeholder="Describe the problem (optional)"
                rows={3}
              ></textarea>
              <div className="absolute bottom-4 right-4 text-[10px] text-on-surface-variant/40 font-label">
                0/500
              </div>
            </div>
          </div>
        </section>

        {/* Recent Scans */}
        <section className="mt-16">
          <div className="flex justify-between items-end mb-6">
            <div className="editorial-stack">
              <span className="font-label text-[11px] uppercase tracking-widest text-primary font-bold">
                Your History
              </span>
              <h3 className="font-headline text-2xl font-bold text-primary">
                Recent Diagnoses
              </h3>
            </div>
            <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container"
            >
              <div className="h-32 w-full relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtXn4t_vAcS5EqYUn_lhvMnPaStTwj6IMGloJNSyQtNxCPkocHgkPWIU4jJxQtsMTn1Xx-_k22S_mZlfPrFqLiBZ8vk9XuiBkh1RcyONJJW6BYn4qMO6l7XZ31HJLJXSkmGfimJYqljWmqvFWcB86Ke5xYjSPcOv_XU096eGSgQs6hmTulvz5fj-9YfVZPOihoFXn2495oiGRWW-5H5gY1rKnl_NFyruKwmVcSaDnm0J3mBohlNEtAW6z2qN6O6HOrWHjmn1-YLIQ0"
                  alt="Tomato Leaf"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  Healthy
                </div>
              </div>
              <div className="p-3">
                <p className="font-headline text-sm font-bold truncate">
                  Tomato Plant
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  2 hours ago
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container"
            >
              <div className="h-32 w-full relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk_cHbvaVp-_IujdpwEL-PCFqKC6jPiwAsCcn7-TYLaaHwHneVZhi6OJPbAp8XEnwP_8IEuMQo8mxfciYeKMQju-dCM5AEj5xzbrdwy_7rvuKWgfAV3UrysBEUV37geS7B13aNQWIMmPhibREK5enzYV0oKhqsgVFmrs9XqJh0_MGM7oCWkiNgafXy3ITr0F64aDbTF3tOF_KvZElmimdBcOlBQw2ZkF3ZPL5LtCSG3IZq8rB4IrKyWwT_k3jEVmtAqF8RSZfyi-GT"
                  alt="Rice Leaf"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-md">
                  Warning
                </div>
              </div>
              <div className="p-3">
                <p className="font-headline text-sm font-bold truncate">
                  Rice Paddy
                </p>
                <p className="text-[11px] text-on-surface-variant">Yesterday</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
