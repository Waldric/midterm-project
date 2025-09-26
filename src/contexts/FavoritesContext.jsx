import React from "react";
import { useAuth } from "./AuthContext.jsx";

const LS_KEY = "ssph_favs_by_user";
const FavoritesContext = React.createContext({
  favs: [],
  isFav: () => false,
  toggleFav: () => {},
});
export function useFavorites() {
  return React.useContext(FavoritesContext);
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
}
function writeAll(map) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {}
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [favs, setFavs] = React.useState([]);

  React.useEffect(() => {
    if (!userId) {
      setFavs([]);
      return;
    }
    const map = readAll();
    try {
      const legacy = JSON.parse(localStorage.getItem("ssph_favs") || "[]");
      if (Array.isArray(legacy) && legacy.length && !map[userId]) {
        map[userId] = legacy;
        writeAll(map);
      }
      localStorage.removeItem("ssph_favs");
    } catch {}
    setFavs(map[userId] || []);
  }, [userId]);

  const isFav = React.useCallback(
    (id) => !!userId && favs.includes(id),
    [userId, favs]
  );

  const toggleFav = React.useCallback(
    (id) => {
      if (!userId) return;
      setFavs((prev) => {
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [id, ...prev];
        const map = readAll();
        map[userId] = next;
        writeAll(map);
        return next;
      });
    },
    [userId]
  );

  const value = React.useMemo(
    () => ({ favs, isFav, toggleFav }),
    [favs, isFav, toggleFav]
  );
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
