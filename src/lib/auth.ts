// src/lib/auth.ts (frontend)

import {jwtDecode} from 'jwt-decode';

export function saveToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function decodeToken(token: string): any | null {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
}

export function getCurrentUser(): any | null {
  const token = getToken();
  if (!token || isTokenExpired(token)) return null;
  return decodeToken(token);
}
