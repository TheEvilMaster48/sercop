"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserSession {
  username: string;
  email: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (user: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setUser({
            username: data.user.username,
            email: data.user.email,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (user: UserSession) => {
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("sessionToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
