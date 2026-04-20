import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  History,
  User,
  Menu,
  X,
  // Settings,
  // HelpCircle,
  LogOut,
  Cloud,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "PadiPro" }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <h2 className="text-2xl font-bold text-primary font-headline">
            PadiPro
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-surface-container transition-colors hidden md:flex"
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

          <NavLink
            to="/weather"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface hover:bg-surface-container font-medium"
              }`
            }
          >
            <Cloud className="w-5 h-5" />
            <span>Weather</span>
          </NavLink>

          <NavLink
            to="/history"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface hover:bg-surface-container font-medium"
              }`
            }
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </NavLink>

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
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface hover:bg-surface-container font-medium"
              }`
            }
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
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
            to="/"
            className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-error hover:bg-error-container hover:text-on-error-container font-medium transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </NavLink>
        </div>
      </div>

      <header className="flex fixed top-0 w-full z-50 glass-nav shadow-sm items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-surface-container transition-colors hidden md:flex cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="hidden md:flex w-6 h-6 text-primary" />
          </button>
          <NavLink
            to="/weather"
            className="text-xl font-bold tracking-tight text-primary font-headline"
          >
            {title}
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANiDEfhF5vah48UIKmhxyPfcn1EScYC3Wc0BcOKFLepNTUtNqs2AM_y7oF731PEijw2ymQmt4ZZqWWhg_iiflqQ4PARqF1rHwGXfm2n22fgWBuBBXYYnUwDwo-uZCuT7G0XBWKu-RlclmJ6QsmlADaoQCMoUaRYz0ZcVRLIB9ORLY-4gU-O06Ku-okkK9VWsBdNDf0VtCKIvyCmRrfjFbIxGq4Gz_E1R-s3WBCvUp0cfc-GCH4B_oirv9AeryzgDnorzQGULnPGLRr"
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
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

        <NavLink
          to="/weather"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all ${isActive ? "bg-primary-fixed text-on-primary-fixed-variant scale-95" : "text-outline hover:text-primary"}`
          }
        >
          <Cloud className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
            Weather
          </span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all ${isActive ? "bg-primary-fixed text-on-primary-fixed-variant scale-95" : "text-outline hover:text-primary"}`
          }
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
            History
          </span>
        </NavLink>

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
            `flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all ${isActive ? "bg-primary-fixed text-on-primary-fixed-variant scale-95" : "text-outline hover:text-primary"}`
          }
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 font-label">
            Profile
          </span>
        </NavLink>
      </nav>
    </div>
  );
}
