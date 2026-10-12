import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coins, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await register({ email, username, password });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/portfolio", { replace: true });
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 shadow-md shadow-cyan-200">
          <Coins className="h-6 w-6 text-white" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Save your portfolio and track it on this device.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50"
      >
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Username
          <input
            type="text"
            required
            autoComplete="username"
            minLength={3}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="e.g. satoshi"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Password
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Confirm password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        {error ? (
          <p role="alert" className="mt-3 text-xs font-semibold text-rose-500">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-cyan-500 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-200 transition-all hover:from-cyan-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Creating account…" : "Create account"}
        </button>

        <p className="mt-4 text-center text-xs font-medium text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-600 hover:text-cyan-700"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
