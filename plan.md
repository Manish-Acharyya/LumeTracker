# Plan — FinTech Portfolio & Crypto Tracker

## Workflow (what happens, step by step)

1. App boots → `main.jsx` mounts React inside `BrowserRouter` + Currency/Portfolio providers.
2. Dashboard opens → `DashboardPage` calls `useFetchPrice`.
3. Hook fetches CoinGecko top-25 assets and refreshes every 15 seconds (`setInterval`).
4. Every fetch runs inside an `AbortController`; cleanup aborts the request and clears the interval on unmount/route change (no memory leaks).
5. If the API fails or rate-limits → automatic fallback to local mock data (still updates every 15s, shows "Simulated feed" badge).
6. While first payload loads → CSS/SVG skeleton loaders render.
7. Data arrives → asset table, stat cards, and price chart render.
8. Search + sort run directly in render via `.filter()` / `.sort()` — **no `useMemo` anywhere**.
9. Currency toggle (USD/EUR/INR) → `CurrencyContext` recalculates every price instantly.
10. Click an asset → Recharts Area/Line chart draws its mock price history (7D / 30D / 90D).
11. Portfolio page → add/remove holdings, saved in `localStorage`, valued live from fetched prices + allocation bar.
12. Deploy → `npm run build` outputs `dist/` → Render serves it as a static site via `render.yaml`.

## Login flow (localStorage auth — demo only)

1. App boots → `AuthProvider` wraps the app (outermost) and reads the session key `lumen.auth.session.v1` on mount to restore the logged-in user.
2. Navbar renders **Login / Register** links when logged out; **username + Log out** button when logged in.
3. Register (`/register`) → username + email + password + confirm-password validated (username min 3 & unique, email format, password min length, match) → `createUser` in `authStorage.js`.
   - Password is hashed with Web Crypto SHA-256 (`crypto.subtle`) using a per-user random salt — never stored in plain text.
   - User record `{ id, email, username, salt, passwordHash, createdAt }` is saved under `lumen.auth.users.v1`.
   - Duplicate email or taken username → inline error ("An account with that email already exists." / "That username is already taken.").
4. Login (`/login`) → `verifyCredentials` re-hashes the submitted password with the stored salt and compares hashes.
   - Mismatch or unknown email → generic error "Invalid email or password." (no user enumeration).
   - Success → user id written to `lumen.auth.session.v1` → redirect to the requested page (default `/portfolio`).
5. On first login/register → one-time migration: the legacy pre-auth format (a bare array under `lumen.portfolio.holdings.v1`) is converted to the per-account map and claimed by that first account (so pre-auth demo data isn't lost).
6. `/portfolio` is wrapped in `RequireAuth` → when logged out, redirects to `/login` (with `from` so the user returns after login). Dashboard stays public.
7. `PortfolioContext` stores all accounts' holdings in one map under `lumen.portfolio.holdings.v1` (`{ [userId]: holdings[] }`); the current user's array is derived on render, so switching accounts swaps the holdings list.
8. Log out → session key cleared → `RequireAuth` guards the portfolio again; per-user holdings remain in `localStorage`.

> **Demo limitation:** localStorage auth is not secure — users can read/clear all data from devtools. Fine for learning/demo, not for real funds.

## Folder map

- `src/pages/` — Dashboard, Portfolio, Login & Register screens
- `src/components/` — table, chart, skeletons, layout, portfolio widgets, auth guard, UI primitives
- `src/hooks/` — `useFetchPrice` (15s polling), `useLocalStorage` (re-reads on key change)
- `src/context/` — currency (USD/EUR/INR), auth (session/user), portfolio holdings (per user)
- `src/utils/` — API call, currency math, mock data + chart series, formatting, auth storage (users/session)

