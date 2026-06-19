import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export const RegisterForm = ({ onToggleForm }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { register, loading, error, setError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await register({ email, password, name });
    // useAuth already handles localStorage, Redux dispatch, and navigation
  };

  return (
    <>
      <h2 className="text-xl font-medium mb-6 text-center">
        Create an account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="register-name"
            className="block text-sm font-medium mb-2"
          >
            Your name
          </label>
          <input
            type="text"
            id="register-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium mb-2"
          >
            Your email
          </label>
          <input
            type="email"
            id="register-email"
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
            htmlFor="register-password"
            className="block text-sm font-medium mb-2"
          >
            Your password
          </label>
          <input
            type="password"
            id="register-password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition duration-200 mt-2 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create your account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </>
  );
};
