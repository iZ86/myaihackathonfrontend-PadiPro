import { motion } from 'motion/react';
import { Search, Verified, ChevronRight } from 'lucide-react';
import Layout from '../../components/Layout';

const historyItems = [
  {
    id: 1,
    title: "Blast Disease",
    date: "Oct 24, 2023 • 09:15 AM",
    status: "Critical",
    statusColor: "bg-error",
    statusBg: "bg-error-container",
    statusText: "text-on-error-container",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHgJBW--u_x-s4T8ZV9-5N0JRYV8BhcSDJASEXD8b5FvXahrKIhhODXTXMZOMhRLhAyyJpOQZlsQv4rziI47eFOT2jez9tLZVKsUtUWzxTCHba8IJ0K3MmOCwocGU46k5RpyD_ppMXkJnrK-MI_-UrjAwv2KHjIIq_LNxGl-bJozDA1KXXYM2jed1fAUgA77zc4v-AyiH9X8APP70NNIZ8Y_uCpT608Qir-o9j5b6Xiu0zclvCM3Y_nCZUJgYukkRxae_z2DFY1Ib4"
  },
  {
    id: 2,
    title: "Healthy Crop",
    date: "Oct 22, 2023 • 02:30 PM",
    status: "Excellent",
    statusColor: "bg-primary",
    statusBg: "bg-primary-fixed",
    statusText: "text-on-primary-fixed-variant",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYQvlRGnBegXkogVFuezGU9G3lNXjJD6SerlNKWVllY2O3x8_A2F5Fts9vDifyFEreYdxr1PEwo1ia8OTMgx-cBh_PoCoj4ktyw0KEbM1qDy-yqQXJv2nYjn2PQ3K3JxbKKCjfhgeZmcY3c_a0ptOvpJpGoUqPSYPsnrgw6BQ2dZfd-OHWjH-2uuv0DEglb7evE4yEHqNqWChswrnwuSj5VbX87eAbCKsf3MYvDSg9lFr0in0RY0Eo6BtGAV1uI4jHSF8wicrBm6JT"
  },
  {
    id: 3,
    title: "Nutrient Deficiency",
    date: "Oct 20, 2023 • 11:45 AM",
    status: "Action Needed",
    statusColor: "bg-secondary",
    statusBg: "bg-secondary-container",
    statusText: "text-on-secondary-container",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUViH55eY5rssbB9VmqqvGqDkyUJJECl2-ffWQAKdpBT8paF9n5ZKeM_Nq_HKySngcAbZCFCdYpOjNNnAj140aJONf86FGdIW8-r_EMqig4IUfTGKkvDlw44Ko3zTckLW2rEqcMAqlfLn11PfUfOXiz8ftcySxgTXTMA9CZxPv1We1vrCtTDzIM3xvk1-CzjmJvz8dM_h3wz32foTe33-BJWGMzXsG7QGRMnopiq0gr77Bijh2W8AX3Rr5X1KYdK39D-VPa3Klmr7S"
  },
  {
    id: 4,
    title: "Bacterial Blight",
    date: "Oct 18, 2023 • 08:00 AM",
    status: "Critical",
    statusColor: "bg-error",
    statusBg: "bg-error-container",
    statusText: "text-on-error-container",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDctfDSh5lisrdWOomNicBTBZcWC6dnjqviZtAVaFzdQeNzLKIhRAWB3XdHj-41DOlUX_bPGPrbq7cNUTowra-Q-KcLsUxoUfrEQBAMtQJeD6B1Vm6DeO1GbceFO739_d7fBbPpQJWzbpA087xqso_DUa2Scjzx2eqKDbEqUtaeqw2mo7BXj9cair92TrIo3jEN-gbx_CmOuLXCL3-kq39x7aEBL1i79zLt7OoWPlnlqYDqbMJ4BITgNXJ5mjubDPlWpXqS68Qc4UCr"
  }
];

export default function History() {
  return (
    <Layout activeTab="history">
      <div className="px-6 max-w-2xl mx-auto">
        {/* Editorial Header Section */}
        <section className="mb-10 mt-4">
          <p className="font-label text-[11px] uppercase tracking-widest text-primary font-bold mb-2">Diagnostic Archive</p>
          <h2 className="font-headline font-extrabold text-4xl text-on-surface leading-tight">Diagnosis <br/>History</h2>
        </section>

        {/* Stats Overview Bento */}
        <section className="grid grid-cols-2 gap-4 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-headline font-bold text-on-surface">124</p>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Total Scans</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hero-gradient p-6 rounded-xl flex flex-col justify-between text-on-primary"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <Verified className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-3xl font-headline font-bold">82%</p>
              <p className="font-label text-xs uppercase tracking-wider opacity-80">Crop Health</p>
            </div>
          </motion.div>
        </section>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap">All Records</button>
          <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">High Risk</button>
          <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">Healthy</button>
          <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full font-label text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">Recent</button>
        </div>

        {/* History List */}
        <div className="space-y-6">
          {historyItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="group bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all border border-surface-container cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="grow">
                <p className="font-label text-[10px] text-outline uppercase tracking-tighter mb-0.5">{item.date}</p>
                <h3 className="font-headline font-bold text-on-surface text-base">{item.title}</h3>
                <div className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${item.statusBg} ${item.statusText}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}></span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">{item.status}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="mt-10 flex justify-center">
          <button className="bg-surface-container-high text-on-surface px-8 py-3 rounded-full font-label text-sm font-semibold hover:bg-surface-container-highest transition-colors active:scale-95 duration-200">
            View Older Records
          </button>
        </div>
      </div>
    </Layout>
  );
}
