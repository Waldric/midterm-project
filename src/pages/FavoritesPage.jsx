import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { SPACES } from "../data/spaces.js";
import SpaceCard from "../components/SpaceCard.jsx";

export default function FavoritesPage() {
  const { user, login } = useAuth();
  const { favs } = useFavorites();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold">Favorites</h1>

        {/* Centered login prompt */}
        <section className="mt-6 min-h-[50vh] grid place-items-center">
          <div className="card border border-base-200 shadow-xl rounded-2xl max-w-lg w-full">
            <div className="card-body items-center text-center gap-6 p-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Login to see your favorites
                </h2>
                <p className="mt-2 text-base text-neutral-600 max-w-sm">
                  Save spaces you love and find them faster next time.
                </p>
              </div>

              <center>
                <button
                  type="button"
                  onClick={login}
                  className="btn btn-lg w-sm self-stretch rounded-3xl h-12
                         text-white border hover:opacity-90
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: "#5dbea3",
                    borderColor: "#5dbea3",
                    "--tw-ring-color": "#5dbea3",
                  }}
                >
                  Log in
                </button>
              </center>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const items = SPACES.filter((s) => favs.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Favorites</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-box border border-dashed border-base-300 p-8 text-center text-sm opacity-70">
          You haven’t added any favorites yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <SpaceCard key={item.id} item={item} animateOnView={false} />
          ))}
        </div>
      )}
    </div>
  );
}
