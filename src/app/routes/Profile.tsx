import { motion } from "motion/react";
import {
  User,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto">
        {/* Hero Profile Section */}
        <section className="mb-12 text-left mt-4">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary font-bold mb-2 block">
            Agricultural Lead
          </span>
          <h1 className="text-4xl font-extrabold text-on-surface mb-2 font-headline">
            Anwar Sadat
          </h1>
          <p className="text-on-surface-variant font-body">
            Managing Green Valley Estates • Premium Member
          </p>
        </section>

        {/* Bento Grid Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Account Settings Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 bg-surface-container-low rounded-xl p-6 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight font-headline">
                Account Settings
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Email", value: "anwar.sadat@greenvalley.com" },
                { label: "Phone", value: "+233 24 555 0192" },
                { label: "Farm Location", value: "Kumasi, Ashanti Region" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-white rounded-lg border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors group"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-outline font-bold font-label">
                      {item.label}
                    </p>
                    <p className="font-medium font-body">{item.value}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subscription Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hero-gradient text-on-primary rounded-xl p-6 flex flex-col justify-between min-h-50"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="bg-white text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1 font-headline">
                Subscription Plan
              </h3>
              <p className="text-sm opacity-90 font-body">
                Premium Tier Access
              </p>
            </div>
            <button className="mt-6 w-full py-3 bg-white text-primary font-bold rounded-lg text-sm hover:bg-primary-fixed transition-colors">
              Manage Plan
            </button>
          </motion.div>

          {/* Notifications & Support Mini Cards */}
          <div className="grid grid-rows-2 gap-4">
            <motion.div
              whileHover={{ x: 4 }}
              className="bg-surface-container-low rounded-xl p-5 flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <Bell className="w-5 h-5 text-on-secondary-container" />
                </div>
                <span className="font-bold font-headline">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </motion.div>

            <motion.div
              whileHover={{ x: 4 }}
              className="bg-surface-container-low rounded-xl p-5 flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-on-tertiary" />
                </div>
                <span className="font-bold font-headline">Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 flex items-center justify-center gap-3 py-4 bg-surface-container-high text-error font-bold rounded-xl active:scale-[0.98] transition-all hover:bg-error-container"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* Aesthetic Grounding Element */}
        <div className="mt-16 text-center opacity-30">
          <Sprout className="w-12 h-12 mx-auto text-primary" />
          <p className="text-[10px] uppercase tracking-[0.3em] mt-4 font-bold font-label">
            Cultivating Precision • Version 2.4.1
          </p>
        </div>
      </div>
    </Layout>
  );
}
