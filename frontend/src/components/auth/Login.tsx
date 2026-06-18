import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../http/http";
import { isValidEmail } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/user/userSlice";
import { enqueueSnackbar } from "notistack";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar("Please fill all the fields!", { variant: "warning" });
      return;
    }

    if (!isValidEmail(email)) {
      enqueueSnackbar("Please enter a valid email-id!", { variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await login({ email, password });
      dispatch(setAuth({ auth: true, user: data.user }));
      enqueueSnackbar(data?.message || "Logged in successfully!", { variant: "success" });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl p-10"
      style={{
        background: "rgba(18,20,28,0.95)",
        border: "0.5px solid rgba(34,197,94,0.2)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 60px rgba(34,197,94,0.06), 0 24px 48px rgba(0,0,0,0.5)",
      }}
    >
      {/* Brand */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{
            border: "1.5px solid rgba(34,197,94,0.4)",
            background: "rgba(34,197,94,0.08)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="9" stroke="#22c55e" strokeWidth="1.5" />
            <circle cx="13" cy="13" r="3" fill="#22c55e" />
            <path d="M13 4 L13 7" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13 19 L13 22" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 13 L7 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 13 L22 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13 13 L17 9" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="text-lg font-medium text-white tracking-tight">
          JobTrackr<span style={{ color: "#22c55e" }}>.com</span>
        </h1>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#22c55e" }}
          />
          <span className="text-xs tracking-wide" style={{ color: "rgba(34,197,94,0.7)" }}>
            All systems operational
          </span>
        </div>
      </div>

      <p className="text-sm text-center mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
        Sign in to your account
      </p>

      <form className="space-y-5" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-1.5 text-xs font-medium tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(34,197,94,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
              e.target.style.background = "rgba(34,197,94,0.04)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255,255,255,0.04)";
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-1.5 text-xs font-medium tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(34,197,94,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
              e.target.style.background = "rgba(34,197,94,0.04)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255,255,255,0.04)";
            }}
          />
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="w-3.5 h-3.5 rounded cursor-pointer"
              style={{ accentColor: "#22c55e" }}
            />
            <label
              htmlFor="remember"
              className="text-xs select-none cursor-pointer"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-xs hover:underline transition-colors"
            style={{ color: "rgba(34,197,94,0.8)" }}
          >
            Forgot password?
          </a>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg text-sm font-medium transition-all active:scale-[0.99]"
          style={{
            background: loading ? "rgba(34,197,94,0.5)" : "#22c55e",
            color: "#0a1a0e",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
          }}
        >
          {loading ? "Signing in..." : "Login to your account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Register link */}
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
          Not registered?{" "}
          <Link
            to="/register"
            className="font-medium hover:underline"
            style={{ color: "#22c55e" }}
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;