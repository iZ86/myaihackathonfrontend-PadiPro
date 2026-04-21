import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  User as UserIcon,
  // ShieldCheck,
  // Bell,
  // HelpCircle,
  LogOut,
  ChevronRight,
  Sprout,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserData } from "@datatypes/userType";
import { getUserByMobileNoAPI } from "@features/user/api/users";
import { reverseGeocodeAPI } from "@features/weather/api/weathers";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [locationName, setLocationName] = useState<string>(
    "Loading location...",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDatas = useCallback(async (token: string, mobileNo: string) => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await getUserByMobileNoAPI(token, mobileNo);

      if (!userResponse?.ok) {
        throw new Error("Unable to sync user data. Check connection.");
      }

      const userJson = await userResponse.json();

      setUserData(userJson.data);

      // Start geocoding in background
      const name = await reverseGeocodeAPI(
        userJson.data.coords._latitude,
        userJson.data.coords._longitude,
      );
      setLocationName(name);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // TODO: Replace with authenticated context values
    getDatas("randomToken", "60125821900");
  }, [getDatas]);

  const handleLogout = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-headline font-bold text-primary">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center bg-error-container/10 py-10 rounded-3xl border-2 border-dashed border-error/20">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Sync Interrupted
        </h2>
        <p className="text-on-surface-variant text-sm max-w-60">
          {error || "User data is currently unavailable."}
        </p>
        <button
          onClick={() => getDatas("randomToken", "60125821900")}
          className="mt-2 px-6 py-2.5 hero-gradient text-white rounded-full font-bold shadow-lg text-sm transition-transform active:scale-95"
        >
          Re-sync Sensors
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Profile Section */}
      <section className="mb-12 text-left mt-4">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary font-bold mb-2 block">
          Agricultural Lead
        </span>
        <h1 className="text-4xl font-extrabold text-on-surface mb-2 font-headline">
          {userData?.name || "Isaac"}
        </h1>
        <p className="text-on-surface-variant font-body">
          Managing PadiPro Estates • Premium Member
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
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight font-headline">
              Account Settings
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Phone", value: userData?.mobile_no || "+60125821900" },
              { label: "Farm Location", value: locationName },
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
        {/* <motion.div
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
          </motion.div> */}

        {/* Notifications & Support Mini Cards */}
        {/* <div className="grid grid-rows-2 gap-4">
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
          </div> */}
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
    </>
  );
}
