import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // app refresh (F5) උනත් user restore
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn("Failed to parse saved user from localStorage");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const loginUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
