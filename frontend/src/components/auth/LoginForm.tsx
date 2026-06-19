import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, error, setError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await login({ email, password });
   
  };

  return (
    <>
      <h2 className="text-xl font-medium mb-6 text-center">
        Sign in to our platform
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium mb-2"
          >
            Your email
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium mb-2"
          >
            Your password
          </label>
          <input
            type="password"
            id="login-password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum six characters"
            className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800 cursor-pointer"
            />
            <span className="ml-2">Remember me</span>
          </label>
          <a href="#" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition duration-200 mt-2 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login to your account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center">
        Not registered?{" "}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Create account
        </button>
      </p>
    </>
  );
};
