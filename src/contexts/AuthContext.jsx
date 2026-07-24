import { useCallback, useState } from "react";
import { AuthContext } from "./authContextObject";
import { AUTH_STORAGE_KEY } from "../config/adminCredentials";
import { useAppData } from "../hooks/useAppData";

export function AuthProvider({ children }) {
  const { data } = useAppData();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true",
  );

  const login = useCallback(
    (username, password) => {
      const admin = data.admin || {};
      const isValid = username === admin.username && password === admin.password;
      if (isValid) {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        setIsAuthenticated(true);
      }
      return isValid;
    },
    [data.admin],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
