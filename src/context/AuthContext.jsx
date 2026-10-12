import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, createUser, getSession, setSession, verifyCredentials } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setUser(getSession());
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ email, username, password }) => {
    const result = await createUser({ email, username, password });
    if (!result.ok) return result;
    setSession(result.user.id);
    setUser(result.user);
    return { ok: true, user: result.user };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const result = await verifyCredentials({ email, password });
    if (!result.ok) return result;
    setSession(result.user.id);
    setUser(result.user);
    return { ok: true, user: result.user };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, register, login, logout }),
    [user, loading, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
