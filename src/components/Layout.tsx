import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  History,
  User,
  Menu,
  X,
  // Settings,
  // HelpCircle,
  MessageSquareText,
  LogOut,
  Cloud,
  Leaf,
} from "lucide-react";
import { useAuth } from "@context/auth/useAuth";
import { useLanguage } from "@context/lang/useLanguage";
import { useLocationPermission } from "@context/location/useLocationPermission";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "PadiPro" }: LayoutProps) {
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const { hasLocationPermission } = useLocationPermission();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/chat": t.nav.chat,
    "/weather": t.nav.weather,
    "/history": t.nav.history,
    "/profile": t.nav.profile,
  };
  const currentTitle = pageTitles[location.pathname] || title;

  const getInitials = (name?: string) =>
    (name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "P";

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-surface z-70 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center hero-gradient shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary font-headline">
              PadiPro
            </h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <X className="w-6 h-6 text-on-surface" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {/* <NavLink
            to="/home"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface hover:bg-surface-container font-medium"
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink> */}

          {hasLocationPermission !== false && (
            <>
              <NavLink
                to="/chat"
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container font-medium"
                  }`
                }
              >
                <MessageSquareText className="w-5 h-5" />
                <span>{t.nav.chat}</span>
              </NavLink>

              <NavLink
                to="/weather"
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container font-medium"
                  }`
                }
              >
                <Cloud className="w-5 h-5" />
                <span>{t.nav.weather}</span>
              </NavLink>

              <NavLink
                to="/history"
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container font-medium"
                  }`
                }
              >
                <History className="w-5 h-5" />
                <span>{t.nav.history}</span>
              </NavLink>
            </>
          )}

          {/* <NavLink
            to="/products"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface hover:bg-surface-container font-medium"
              }`
            }
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Products</span>
          </NavLink> */}

          <NavLink
            to="/profile"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface hover:bg-surface-container font-medium"
              }`
            }
          >
            <User className="w-5 h-5" />
            <span>{t.nav.profile}</span>
          </NavLink>
        </div>

        <div className="p-4 border-t border-outline-variant space-y-2">
          {/* <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-on-surface hover:bg-surface-container font-medium transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button> */}
          {/* <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-on-surface hover:bg-surface-container font-medium transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>Help & Support</span>
          </button> */}
          <NavLink
            to="/login"
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-error hover:bg-error-container hover:text-on-error-container font-medium transition-all mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.auth.logout}</span>
          </NavLink>
        </div>
      </div>

      <header className="flex fixed top-0 w-full z-50 glass-nav shadow-sm items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-surface-container transition-colors hidden md:flex cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <NavLink to="/chat" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center hero-gradient shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary font-headline">
              <span className="md:hidden">{currentTitle}</span>
              <span className="hidden md:inline">PadiPro</span>
            </span>
          </NavLink>
        </div>
        <NavLink to="/profile" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-white font-bold text-sm border-2 border-primary/20 shadow-sm select-none">
            {getInitials(user?.name)}
          </div>
        </NavLink>
      </header>

      <main className="flex-1 pt-20 pb-32">{children}</main>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-nav rounded-full z-50 flex justify-around items-center py-3 px-2 shadow-lg">
        {/* <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all ${isActive ? "bg-primary-fixed text-on-primary-fixed-variant scale-95" : "text-outline hover:text-primary"}`
          }
        >
          <Home
            className={`w-6 h-6 ${activeTab === "home" ? "fill-current" : ""}`}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
            Home
          </span>
        </NavLink> */}

        {hasLocationPermission !== false && (
          <>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${isActive ? "bg-primary/10 text-primary" : "text-outline hover:text-primary"}`
              }
            >
              <MessageSquareText className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
                {t.nav.chat}
              </span>
            </NavLink>

            <NavLink
              to="/weather"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${isActive ? "bg-primary/10 text-primary" : "text-outline hover:text-primary"}`
              }
            >
              <Cloud className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
                {t.nav.weather}
              </span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${isActive ? "bg-primary/10 text-primary" : "text-outline hover:text-primary"}`
              }
            >
              <History className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
                {t.nav.history}
              </span>
            </NavLink>
          </>
        )}

        {/* <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all ${isActive ? "bg-primary-fixed text-on-primary-fixed-variant scale-95" : "text-outline hover:text-primary"}`
          }
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
            Products
          </span>
        </NavLink> */}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${isActive ? "bg-primary/10 text-primary" : "text-outline hover:text-primary"}`
          }
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
            {t.nav.profile}
          </span>
        </NavLink>
      </nav>
    </div>
  );
}
