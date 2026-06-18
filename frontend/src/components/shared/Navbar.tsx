import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../http/http";
import { setAuth } from "../../features/user/userSlice";

interface NavbarProps {
  toggleDrawer: () => void;
}

interface UserState {
  isAuth: boolean;
  user: { name?: string; email?: string } | null;
}

interface RootState {
  user: UserState;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleDrawer }) => {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state: RootState) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignout = async () => {
    try {
      await logout({});
      localStorage.removeItem("token");
      dispatch(setAuth({ auth: false, user: null }));
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 h-14"
      style={{
        background: "rgba(10,11,15,0.92)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left: burger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDrawer}
          className="sm:hidden p-2 rounded-lg transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 select-none">
          {/* Compass logomark */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(34,197,94,0.12)", border: "0.5px solid rgba(34,197,94,0.3)" }}
          >
            <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="9" stroke="#22c55e" strokeWidth="1.5" />
              <circle cx="13" cy="13" r="2.5" fill="#22c55e" />
              <path d="M13 4 L13 7" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M13 19 L13 22" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 13 L7 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M19 13 L22 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M13 13 L17 9" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            JobTrackr<span style={{ color: "#22c55e" }}>.com</span>
          </span>
        </Link>
      </div>

      {/* Right: user avatar dropdown */}
      {isAuth && user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors hover:bg-white/5"
          >
            {/* Avatar circle */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "0.5px solid rgba(34,197,94,0.3)" }}
            >
              {initials}
            </div>
            <span className="hidden sm:block text-sm text-neutral-300 max-w-[140px] truncate">
              {user.name}
            </span>
            <svg
              className="w-3.5 h-3.5 text-neutral-500 transition-transform"
              style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden"
              style={{
                background: "#12141c",
                border: "0.5px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* User info header */}
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {user.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={handleSignout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ color: "rgba(239,68,68,0.8)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;