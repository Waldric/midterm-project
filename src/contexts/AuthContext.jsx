import React from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

export const AuthContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {},
});
export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("ssph_user", null);

  const login = React.useCallback(
    (name = "Waldric Garcia") => {
      const safeName =
        typeof name === "string" && name.trim() ? name : "Waldric Garcia";
      return new Promise((resolve) => {
        const nextUser = { id: "u1", name: safeName };
        setTimeout(() => {
          setUser(nextUser);
          window.dispatchEvent(
            new CustomEvent("auth:login", { detail: { user: nextUser } })
          );
          resolve(nextUser);
        }, 0);
      });
    },
    [setUser]
  );

  const logout = React.useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(null);
        window.dispatchEvent(new CustomEvent("auth:logout"));
        resolve();
      }, 0);
    });
  }, [setUser]);

  const value = React.useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
