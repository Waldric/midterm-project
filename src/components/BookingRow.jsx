import React from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../contexts/BookingsContext.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import { SPACES } from "../data/spaces.js";
import { peso } from "../utils/currency.js";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

export default function BookingRow({ booking }) {
  const { removeBooking } = useBookings();
  const [open, setOpen] = React.useState(false);

  const space = SPACES.find((s) => s.id === booking.spaceId);
  const status = booking.status || "Waiting for Approval";
  const timeLabel = booking.timeSlot || booking.time || "—";
  const peopleLabel =
    typeof booking.people === "number"
      ? `${booking.people} Persons`
      : booking.hours
      ? `${booking.hours} Hours`
      : "—";

  const favCtx = (() => {
    try {
      return useFavorites();
    } catch {
      return null;
    }
  })();
  const favActive = favCtx?.isFav?.(space?.id) ?? false;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-md rounded-2xl">
      <div className="card-body p-5">
        {/* Top badges row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="badge badge-success badge-outline">Active</span>
            <span className="opacity-70">Status:</span>
            <span className="badge badge-ghost">{status}</span>
          </div>
          {space && favCtx && (
            <button
              className="btn btn-ghost btn-circle btn-xs"
              onClick={() => favCtx.toggleFav(space.id)}
              aria-label="favorite"
            >
              <svg
                className={`w-4 h-4 ${
                  favActive ? "text-rose-500" : "text-base-content/60"
                }`}
                viewBox="0 0 24 24"
                fill={favActive ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>

        {/* Title, location, preview */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {space?.name || booking.spaceName}
            </h3>
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
                <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{space?.location || "—"}</span>
            </div>
          </div>
          <Link to={`/space/${booking.spaceId}`} className="link text-xs">
            Preview
          </Link>
        </div>

        <div className="divider my-2" />

        {/* Details list */}
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{booking.date}</span>
          </li>
          <li className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
            <span>{timeLabel}</span>
          </li>
          <li className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{peopleLabel}</span>
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 mr-2 flex items-center justify-center text-xs">
              ₱
            </span>
            <span>{peso.format(booking.price)}/hr</span>
          </li>
        </ul>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            className="btn btn-error flex-1 text-white"
            onClick={() => setOpen(true)}
          >
            Cancel
          </button>
          <Link
            to={`/space/${booking.spaceId}`}
            state={{ editId: booking.id }} // ← pass which booking to edit
            className="btn btn-outline flex-1"
          >
            Modify
          </Link>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title="Cancel this booking?"
        message={`This will remove your booking for "${booking.spaceName}" on ${booking.date}.`}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          removeBooking(booking.id);
          setOpen(false);
        }}
      />
    </div>
  );
}
