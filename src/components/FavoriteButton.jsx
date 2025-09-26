import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

export default function FavoriteButton({
  spaceId,
  labelWhenActive = "Favorited",
  labelWhenIdle = "Add Favorites",
}) {
  const { user, login } = useAuth();
  const { isFav, toggleFav } = useFavorites();
  const [open, setOpen] = React.useState(false);
  const active = isFav(spaceId);

  function handlePrimaryClick() {
    if (!user) {
      setOpen(true);
      return;
    }
    toggleFav(spaceId);
  }

  function confirmLoginAndFavorite() {
    login();
    setOpen(false);
    setTimeout(() => toggleFav(spaceId), 0);
  }

  return (
    <>
      <button
        onClick={handlePrimaryClick}
        className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <svg
          className={`w-4 h-4 ${
            active ? "text-rose-500" : "text-base-content/60"
          }`}
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{active ? labelWhenActive : labelWhenIdle}</span>
      </button>

      {open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Login required</h3>
            <p className="py-3 text-sm opacity-80">
              Please log in to save favorites.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={confirmLoginAndFavorite}
              >
                Login
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setOpen(false)}></div>
        </div>
      )}
    </>
  );
}
