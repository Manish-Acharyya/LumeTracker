import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/60 py-6">
        <p className="mx-auto max-w-7xl px-4 text-center text-[11px] text-slate-400 sm:px-6 lg:px-8">
          Lumen Markets · Data via CoinGecko with simulated fallback · For demonstration only, not
          financial advice.
        </p>
      </footer>
    </div>
  );
}
