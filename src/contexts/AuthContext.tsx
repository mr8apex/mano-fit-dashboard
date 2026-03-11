import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("manofit_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string) => {
    if (email === "demo@example.com" && password === "demo123") {
      const u = { email, name: "Demo User" };
      setUser(u);
      sessionStorage.setItem("manofit_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string) => {
    if (email && password.length >= 6) {
      const u = { email, name };
      setUser(u);
      sessionStorage.setItem("manofit_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("manofit_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
