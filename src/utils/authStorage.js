const USERS_KEY = 'lumen.auth.users.v1';
const SESSION_KEY = 'lumen.auth.session.v1';

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — in-memory state still works */
  }
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export function getUsers() {
  const users = readJson(USERS_KEY, {});
  return typeof users === 'object' && users !== null && !Array.isArray(users) ? users : {};
}

function saveUsers(users) {
  writeJson(USERS_KEY, users);
}

export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

export async function createUser({ email, username, password }) {
  const normalized = normalizeEmail(email);
  const normalizedUsername = String(username ?? '').trim();
  if (!normalized) return { ok: false, error: 'Email is required.' };
  if (!normalizedUsername) return { ok: false, error: 'Username is required.' };

  const users = getUsers();
  if (users[normalized]) return { ok: false, error: 'An account with that email already exists.' };
  if (
    Object.values(users).some(
      (existing) => existing.username?.toLowerCase() === normalizedUsername.toLowerCase(),
    )
  ) {
    return { ok: false, error: 'That username is already taken.' };
  }

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: randomId(),
    email: normalized,
    username: normalizedUsername,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users[normalized] = user;
  saveUsers(users);
  return { ok: true, user };
}

export async function verifyCredentials({ email, password }) {
  const normalized = normalizeEmail(email);
  const users = getUsers();
  const user = users[normalized];
  if (!user) return { ok: false, error: 'Invalid email or password.' };

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    return { ok: false, error: 'Invalid email or password.' };
  }
  return { ok: true, user };
}

export function getSession() {
  const sessionId = readJson(SESSION_KEY, null);
  if (typeof sessionId !== 'string') return null;
  const users = getUsers();
  return Object.values(users).find((user) => user.id === sessionId) ?? null;
}

export function setSession(userId) {
  writeJson(SESSION_KEY, userId);
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
