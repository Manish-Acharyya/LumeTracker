import { Briefcase, Coins, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import CurrencyToggle from "./CurrencyToggle";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase, end: false },
];

function linkClassName({ isActive }) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
    isActive
      ? "bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
  }`;
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-cyan-600 shadow-md shadow-cyan-200">
            <Coins className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Lumen Markets
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span
                className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Live tracker
            </span>
          </span>
        </NavLink>

        <nav
          aria-label="Primary"
          className="order-3 flex w-full items-center gap-1 sm:order-0 sm:w-auto"
        >
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClassName}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-6">
          <CurrencyToggle />
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <span
                  className="hidden max-w-[160px] truncate text-xs font-semibold text-slate-600 sm:block"
                  title={user.username || user.email}
                >
                  {user.username || user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-rose-300 hover:text-rose-600"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-800"
                >
                  <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-linear-to-b from-cyan-500 to-cyan-600 px-3 py-2 text-xs font-bold text-white shadow-sm shadow-cyan-200 transition-all hover:from-cyan-400 hover:to-cyan-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
