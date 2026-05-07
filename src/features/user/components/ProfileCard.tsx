import { useEffect } from "react";
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
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/auth/useAuth";
import { useLanguage } from "@context/lang/useLanguage";
import { useLocationPermission } from "@context/location/useLocationPermission";

export default function ProfileCard() {
  const { language, setLanguage, t } = useLanguage();
  const { loading, user, logout } = useAuth();
  const {
    hasLocationPermission,
    requestLocation,
    isLoading: isLocationLoading,
    error: locationError,
  } = useLocationPermission();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.mobile_no) return;
  }, [user]);

  const handleLogout = () => {
    logout();
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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center bg-error-container/10 py-10 rounded-3xl border-2 border-dashed border-error/20">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Sync Interrupted
        </h2>
        <p className="text-on-surface-variant text-sm max-w-60">
          "User data is currently unavailable."
        </p>
        <button
          onClick={() => user}
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
      <section className="mb-10 mt-4 flex items-center gap-5">
        <div className="w-20 h-20 rounded-3xl hero-gradient flex items-center justify-center text-white text-3xl font-extrabold font-headline shadow-lg shadow-primary/20 shrink-0 select-none">
          {(user?.name || "P")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div>
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary font-bold mb-1 block">
            {t.profile.lead}
          </span>
          <h1 className="text-3xl font-extrabold text-on-surface mb-1 font-headline leading-tight">
            {user?.name || "PadiPro User"}
          </h1>
          <p className="text-on-surface-variant font-body text-sm">
            {t.profile.member}
          </p>
        </div>
      </section>

      {/* Location Permission Status */}
      <motion.div
        whileHover={{ y: -4 }}
        className={`mb-8 rounded-3xl p-6 transition-all border ${
          hasLocationPermission
            ? "bg-primary-container/20 border-primary/20"
            : "bg-error-container/20 border-error/20"
        }`}
      >
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                hasLocationPermission
                  ? "bg-primary text-white"
                  : "bg-error text-white"
              }`}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                {hasLocationPermission
                  ? t.profile.locationEnabled
                  : t.profile.locationRequired}
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md">
                {hasLocationPermission
                  ? t.profile.locationEnabledDesc
                  : t.profile.locationRequiredDesc}
              </p>
              {locationError && (
                <p className="text-xs text-error mt-2 font-medium bg-error-container/50 px-3 py-1.5 rounded-md inline-block">
                  {locationError}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => requestLocation()}
            disabled={isLocationLoading}
            className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer ${
              hasLocationPermission
                ? "bg-surface-container text-on-surface hover:bg-surface-container-high"
                : "bg-primary text-white hover:bg-primary-fixed hover:text-on-primary-fixed"
            }`}
          >
            {isLocationLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {hasLocationPermission ? t.profile.updating : t.profile.requesting}
              </>
            ) : hasLocationPermission ? (
              <>
                <MapPin className="w-4 h-4" />
                {t.profile.updateLocation}
              </>
            ) : (
              t.profile.enableLocation
            )}
          </button>
        </div>
      </motion.div>

      {/* Bento Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Account Settings Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="md:col-span-2 bg-surface-container-low rounded-3xl p-6 transition-all"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight font-headline">
              {t.profile.accountSettings}
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { label: t.auth.phone, value: user?.mobile_no || "" },
              {
                label: t.profile.farmLocation,
                value: user?.location || "Unknown",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-white rounded-2xl border border-surface-container hover:bg-surface-container-low transition-colors group"
              >
                <div className="grow mr-2">
                  <p className="text-xs uppercase tracking-wider text-outline font-bold font-label">
                    {item.label}
                  </p>
                  <p className="font-medium font-body truncate">{item.value}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </div>
            ))}

            {/* Language Switcher in Bento List */}
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-surface-container">
              <div className="grow">
                <p className="text-xs uppercase tracking-wider text-outline font-bold font-label">
                  {t.profile.language}
                </p>
                <p className="font-medium font-body">
                  {language === "en" ? "English" : "Bahasa Melayu"}
                </p>
              </div>
              <div className="flex bg-surface-container rounded-lg p-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${language === "en" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("ms")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${language === "ms" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"}`}
                >
                  MS
                </button>
              </div>
            </div>
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
        className="w-full mt-8 flex items-center justify-center gap-3 py-4 bg-surface-container-high text-error font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-error-container cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        {t.auth.logout}
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
