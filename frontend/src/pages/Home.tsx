import React from "react";
import Login from "../components/auth/Login";

const Home: React.FC = () => {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center"
      style={{ background: "#0a0b0f" }}
    >
      {/* Subtle dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(34,197,94,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left: branding panel */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.1)", border: "0.5px solid rgba(34,197,94,0.25)" }}
            >
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="9" stroke="#22c55e" strokeWidth="1.5" />
                <circle cx="13" cy="13" r="2.5" fill="#22c55e" />
                <path d="M13 4 L13 7" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 19 L13 22" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 13 L7 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M19 13 L22 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 13 L17 9" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              JobTrackr<span style={{ color: "#22c55e" }}>.com</span>
            </span>
          </div>

          <h1
            className="text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Your job search,
            <br />
            <span style={{ color: "#22c55e" }}>finally organized.</span>
          </h1>

          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Track applications, interviews, and offers in one clean dashboard. Never lose sight of where you stand.
          </p>

          {/* Feature bullets */}
          <div className="mt-8 flex flex-col gap-3">
            {[
              "Track every application in one place",
              "Filter by status, type, and location",
              "Know your pipeline at a glance",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(34,197,94,0.12)" }}
                >
                  <svg className="w-2.5 h-2.5" style={{ color: "#22c55e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: login card */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <Login />
        </div>
      </div>
    </main>
  );
};

export default Home;