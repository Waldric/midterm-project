import React from "react";
import { Link } from "react-router-dom";
import { peso } from "../utils/currency.js";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import LoginRequiredModal from "./LoginRequiredModal.jsx";
import { motion } from "framer-motion";

export default function SpaceCard({ item, animateOnView = true }) {
  const { isFav, toggleFav } = useFavorites();
  const { user, login } = useAuth();
  const active = isFav(item.id);

  function getMaxBadges() {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 768) return 3;
    return 2;
  }
  const [maxBadges, setMaxBadges] = React.useState(getMaxBadges());
  React.useEffect(() => {
    const onResize = () => setMaxBadges(getMaxBadges());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const amenities = Array.isArray(item.amenities)
    ? item.amenities
    : item.tags ?? [];
  const hasMoreAmenities = amenities.length > maxBadges;
  const visibleAmenities = hasMoreAmenities
    ? amenities.slice(0, Math.max(1, maxBadges - 1))
    : amenities;

  // ---------- status colors ----------
  const s = (item.status || "").toLowerCase().trim();
  let dotCls = "bg-emerald-500";
  let textCls = "text-emerald-700";
  if (s === "fully booked" || s === "fully-booked" || s === "booked") {
    dotCls = "bg-red-500";
    textCls = "text-red-700";
  } else if (s === "closed") {
    dotCls = "bg-neutral-400";
    textCls = "text-neutral-600";
  }

  // ---------- favorites gate ----------
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const [shouldFavAfterLogin, setShouldFavAfterLogin] = React.useState(false);
  async function onHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShouldFavAfterLogin(true);
      setAskLoginOpen(true);
      return;
    }
    toggleFav(item.id);
  }

  const imgSrc = item.main_image || item.image || "/images/placeholder.jpg";

  return (
    <>
      <motion.div
        className="h-full"
        initial={animateOnView ? { opacity: 0, y: 16 } : false}
        animate={animateOnView ? undefined : { opacity: 1, y: 0 }} // <-- ensure visible immediately
        whileInView={animateOnView ? { opacity: 1, y: 0 } : undefined}
        viewport={animateOnView ? { once: true, amount: 0.3 } : undefined}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Link
          to={`/space/${item.id}`}
          className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-[360px] md:h-[380px]"
        >
          {/* Image (fixed height) */}
          <figure className="relative w-full h-48 md:h-56 bg-indigo-300/60">
            <img
              src={imgSrc}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />

            {/* status pill (subtle pop-in) */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
              className={`absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur border border-base-300
                          text-[10px] px-2 py-1 flex items-center gap-1 ${textCls}`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${dotCls}`}
              />
              {item.status || "Available"}
            </motion.span>

            {/* heart (tap feedback) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onHeartClick}
              className="absolute bottom-3 right-3 btn btn-circle btn-ghost bg-base-100/80 border border-base-300"
              aria-label={
                user
                  ? active
                    ? "Remove from favorites"
                    : "Add to favorites"
                  : "Log in to save"
              }
              title={
                user
                  ? active
                    ? "Remove from favorites"
                    : "Add to favorites"
                  : "Log in to save"
              }
            >
              <svg
                className={`w-5 h-5 ${
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
            </motion.button>
          </figure>

          {/* Body */}
          <div className="card-body p-4 flex flex-col">
            {/* Header row: lock height so all cards align */}
            <div className="flex items-start justify-between gap-4 min-h-[52px]">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold leading-tight truncate">
                  {item.name}
                </h3>

                {/* location */}
                <div className="mt-1 flex items-center text-xs opacity-70">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="truncate">{item.location}</span>
                </div>

                {/* hours */}
                <div className="mt-1 flex items-center text-xs opacity-70">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span className="truncate">{item.hours}</span>
                </div>
              </div>

              <div className="text-right whitespace-nowrap">
                <p className="text-xs opacity-70">Rate per hour</p>
                <p className="text-sky-500 font-semibold">
                  {peso.format(item.price)}
                </p>
              </div>
            </div>

            {/* amenities — single line, fixed height, trailing ellipsis chip */}
            <div className="mt-3 flex gap-2 items-center flex-nowrap overflow-hidden h-7">
              {visibleAmenities.map((a, i) => (
                <span
                  key={`${item.id}-amenity-${i}`}
                  className="badge badge-ghost flex-shrink-0"
                >
                  {a}
                </span>
              ))}
              {hasMoreAmenities && (
                <span className="badge badge-ghost flex-shrink-0">…</span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Login modal */}
      <LoginRequiredModal
        open={askLoginOpen}
        onClose={() => {
          setAskLoginOpen(false);
          setShouldFavAfterLogin(false);
        }}
        onLogin={async () => {
          try {
            const res = login();
            if (res?.then) await res;
          } finally {
            setAskLoginOpen(false);
            if (shouldFavAfterLogin) {
              toggleFav(item.id);
              setShouldFavAfterLogin(false);
            }
          }
        }}
      />
    </>
  );
}
