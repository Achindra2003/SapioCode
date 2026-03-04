"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development — simulates a logged-in teacher
const MOCK_USER: User = {
  _id: "t1",
  name: "Dr. Sarah Mitchell",
  email: "sarah@university.edu",
  role: "instructor",
};
const MOCK_TOKEN = "mock-jwt-token-instructor";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auto-login as mock teacher — no login page needed
  const [user] = useState<User>(MOCK_USER);
  const [token] = useState<string>(MOCK_TOKEN);
  const loading = false;

  const login = async () => {};
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
