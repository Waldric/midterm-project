import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SPACES } from "../data/spaces.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import BookingForm from "../components/BookingForm.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { peso } from "../utils/currency.js";
import { useBookings } from "../contexts/BookingsContext.jsx";

function UnavailableShell({ status }) {
  const label = (status || "").toLowerCase().includes("closed")
    ? "Closed"
    : "Fully Booked";

  return (
    <div className="space-y-3">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date</span>
        </label>
        <input type="date" className="input input-bordered" disabled />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Time Slot</span>
        </label>
        <input type="text" className="input input-bordered" disabled />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">No. of persons</span>
        </label>
        <input type="number" className="input input-bordered" disabled />
      </div>

      <button
        className="w-full h-12 rounded-xl font-medium bg-base-300/70 text-base-content/60 border border-base-300 cursor-not-allowed mt-2"
        disabled
      >
        {label}
      </button>

      <p className="text-xs opacity-70">
        Reservations are unavailable while this space is {label.toLowerCase()}.
      </p>
    </div>
  );
}

export default function SpaceDetailPage() {
  const { spaceId } = useParams();
  const space = SPACES.find((s) => s.id === spaceId);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId ?? null;
  const { bookings } = useBookings();
  const editBooking = React.useMemo(() => {
    if (!editId) return null;
    return (
      bookings.find((b) => b.id === editId && b.userId === user?.id) || null
    );
  }, [bookings, editId, user?.id]);

  // Back button handler — preserves scroll via browser history
  function goBack() {
    const idx = window.history?.state?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
      setTimeout(() => {
        const el = document.getElementById("list");
        if (!el) return;
        const navH = document.querySelector(".navbar")?.offsetHeight || 0;
        const top =
          window.pageYOffset + el.getBoundingClientRect().top - (navH + 12);
        window.scrollTo({ top, behavior: "smooth" });
      }, 0);
    }
  }

  if (!space) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="alert alert-warning">Space not found.</div>
        <a href="/" className="btn btn-ghost mt-4">
          Go back
        </a>
      </div>
    );
  }

  const heroSrc = space.main_image || space.image || "/images/placeholder.jpg";

  // Reserve availability
  const statusL = (space.status || "").toLowerCase().trim();
  const isClosed = statusL === "closed";
  const isFullyBooked =
    statusL === "fully booked" ||
    statusL === "fully-booked" ||
    statusL === "booked";
  const canReserve = !(isClosed || isFullyBooked);

  // Colored status pill (Available=green, Fully Booked=red, Closed=gray)
  const statusLower = statusL;
  let pillCls = "bg-emerald-100 text-emerald-700 ring-emerald-200";
  let dotCls = "bg-emerald-500";
  if (statusLower === "closed") {
    pillCls = "bg-neutral-100 text-neutral-700 ring-neutral-200";
    dotCls = "bg-neutral-500";
  } else if (
    statusLower === "fully booked" ||
    statusLower === "fully-booked" ||
    statusLower === "booked"
  ) {
    pillCls = "bg-red-100 text-red-700 ring-red-200";
    dotCls = "bg-red-500";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Header row */}
      <div className="flex items-start justify-between">
        {/* Left: back + title/location */}
        <div className="relative">
          <button
            onClick={goBack}
            aria-label="Go back"
            className="btn btn-ghost btn-circle w-10 h-10 absolute top-1 left-[-0.5rem] md:left-[-6rem] z-10"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* title + subtext */}
          <div>
            <h1 className="text-2xl font-bold leading-tight">{space.name}</h1>

            {/* location */}
            <div className="mt-3 flex items-center text-sm opacity-80">
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{space.location}</span>
            </div>

            {/* hours */}
            <div className="mt-1 flex items-center text-sm opacity-80">
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
              <span>{space.hours}</span>
            </div>
          </div>
        </div>

        {/* Right: favorites */}
        <div className="hidden lg:block">
          <FavoriteButton spaceId={space.id} />
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Left column */}
        <div>
          <img
            src={heroSrc}
            alt={space.name}
            className="rounded-2xl w-full h-[360px] md:h-[420px] object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.jpg";
            }}
          />

          {/* AMENITIES from JSON */}
          {Array.isArray(space.amenities) && space.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {space.amenities.map((amenity, i) => (
                <span
                  key={`${space.id}-amenity-${i}`}
                  className="badge badge-ghost"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}

          {/* legacy tags fallback */}
          {!space.amenities?.length &&
            Array.isArray(space.tags) &&
            space.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {space.tags.map((t, i) => (
                  <span
                    key={`${space.id}-tag-${i}`}
                    className="badge badge-ghost"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

          <div className="mt-8">
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="mt-3 leading-relaxed opacity-90">
              {space.description}
            </p>
          </div>
        </div>

        {/* Sticky booking card */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="card bg-base-100 border border-base-200 shadow-xl rounded-2xl">
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{space.name}</h3>

                  {/* price + hint */}
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-sky-500 font-semibold">
                      {peso.format(space.price)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      rate per hour
                    </span>
                  </div>

                  <p className="text-xs opacity-70 max-w-sm mt-1">
                    {space.description.slice(0, 100)}…
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${pillCls}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
                  {space.status}
                </span>
              </div>

              <div className="mt-4">
                {!canReserve ? (
                  <UnavailableShell status={space.status} />
                ) : (
                  <BookingForm space={space} editBooking={editBooking} />
                )}
              </div>
            </div>
          </div>

          {/* Favorites on small screens */}
          <div className="mt-3 lg:hidden text-right">
            <FavoriteButton spaceId={space.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
