import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/http';
import { AuthContext } from './authContext';

function decodeBase64Url(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return atob(padded);
}

function parseJwt(token) {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = decodeBase64Url(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function mapJwtToUser(payload, token) {
  if (!payload) return null;
  const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const name = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  const city = payload.city;
  if (!userId || !email || !role) return null;
  return { userId: Number(userId), name: name || '', email, role, city: city || '', token };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token') || '';
    if (!token) return { user: null };
    const payload = parseJwt(token);
    const user = mapJwtToUser(payload, token);
    return { user };
  });

  useEffect(() => {
    if (auth.user?.token) localStorage.setItem('token', auth.user.token);
    else localStorage.removeItem('token');
  }, [auth.user?.token]);

  const login = useCallback(async ({ email, password }) => {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    const token = result?.token || '';
    const payload = parseJwt(token);
    const user = mapJwtToUser(payload, token) || {
      userId: result.userId,
      name: result.name,
      email: result.email,
      role: result.role,
      city: result.city,
      token
    };
    setAuth({ user });
    return user;
  }, []);

  const register = useCallback(async (data) => {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: data
    });
    const token = result?.token || '';
    const payload = parseJwt(token);
    const user = mapJwtToUser(payload, token) || {
      userId: result.userId,
      name: result.name,
      email: result.email,
      role: result.role,
      city: result.city,
      token
    };
    setAuth({ user });
    return user;
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null });
  }, []);

  const value = useMemo(() => ({ user: auth.user, login, register, logout }), [auth.user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
