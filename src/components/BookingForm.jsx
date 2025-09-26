import React from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useBookings } from "../contexts/BookingsContext.jsx";
import LoginRequiredModal from "../components/LoginRequiredModal.jsx";
import { peso } from "../utils/currency.js";

const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

// Local YYYY-MM-DD (no UTC shift)
function toLocalISODate(d = new Date()) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

// Parse slot start (minutes from midnight). Supports several formats.
function parseStartMinutes(slotRaw) {
  if (!slotRaw) return null;
  const slot = String(slotRaw).trim();

  const named = {
    morning: 9 * 60,
    afternoon: 13 * 60,
    evening: 17 * 60,
    "am pass": 9 * 60,
    "pm pass": 13 * 60,
    "full day pass": 8 * 60,
  };
  const key = slot.toLowerCase();
  if (named[key] != null) return named[key];

  const m24 = slot.match(/^(\d{1,2})(?::(\d{2}))?\s*-\s*\d{1,2}(?::\d{2})?/);
  if (m24) {
    const h = Number(m24[1]);
    const mm = Number(m24[2] ?? 0);
    if (!Number.isNaN(h) && h >= 0 && h <= 23) return h * 60 + mm;
  }

  const m12 = slot.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
  if (m12) {
    let h = Number(m12[1]);
    const mm = Number(m12[2] ?? 0);
    const ap = m12[3].toLowerCase();
    if (ap === "pm" && h < 12) h += 12;
    if (ap === "am" && h === 12) h = 0;
    return h * 60 + mm;
  }

  return null;
}

// Small modal helper inside this file (DaisyUI style)
function Modal({ open, title, children, actions, onClose }) {
  if (!open) return null;
  return createPortal(
    <div className="modal modal-open z-[9999]">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <div className="py-3">{children}</div>
        <div className="modal-action">{actions}</div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>,
    document.body
  );
}

export default function BookingForm({ space, editBooking }) {
  const { user, login } = useAuth();
  const { addBooking, updateBooking } = useBookings();
  const nav = useNavigate();

  const todayStr = toLocalISODate();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const allSlots = React.useMemo(() => {
    if (space?.timeSlots?.length) return space.timeSlots;
    return typeof TIME_SLOTS !== "undefined" ? TIME_SLOTS : [];
  }, [space?.timeSlots]);

  const [date, setDate] = React.useState(editBooking?.date ?? todayStr);
  const [timeSlot, setTimeSlot] = React.useState(
    editBooking?.timeSlot ?? allSlots[0] ?? ""
  );
  const [people, setPeople] = React.useState(editBooking?.people ?? 1);
  const [error, setError] = React.useState("");

  // modals
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  // filter slots for today
  const availableSlots = React.useMemo(() => {
    if (!date) return allSlots;
    if (date > todayStr) return allSlots;
    if (date === todayStr) {
      return allSlots.filter((s) => {
        const start = parseStartMinutes(s);
        return start == null || start > nowMinutes;
      });
    }
    return [];
  }, [allSlots, date, nowMinutes, todayStr]);

  React.useEffect(() => {
    if (!availableSlots.includes(timeSlot)) {
      setTimeSlot(availableSlots[0] ?? "");
    }
  }, [availableSlots, timeSlot]);

  function validate() {
    if (!date) return "Please select a date.";
    if (date < todayStr) return "You can't book a past date.";
    if (!timeSlot) return "Please select a time slot.";
    if (!people || people < 1) return "Please enter a valid number of persons.";
    if (date === todayStr) {
      const start = parseStartMinutes(timeSlot);
      if (start != null && start <= nowMinutes)
        return "Selected time slot has already started.";
    }
    return "";
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      setAskLoginOpen(true);
      return;
    }

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    // Show confirm modal instead of immediately saving
    setConfirmOpen(true);
  }

  function confirmBooking() {
    const patch = {
      userId: user.id,
      spaceId: space.id,
      spaceName: space.name,
      date,
      timeSlot,
      people,
      price: space.price,
    };
    if (editBooking) {
      updateBooking(editBooking.id, patch);
    } else {
      addBooking(patch);
    }
    setConfirmOpen(false);
    setSuccessOpen(true);
  }

  const estimated = (space?.price ?? 0) * (people || 1);
  const prettyDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <form onSubmit={submit} className="space-y-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={date}
            min={todayStr}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Time Slot</span>
          </label>
          <select
            className="select select-bordered"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            disabled={availableSlots.length === 0}
            required
          >
            {(availableSlots.length
              ? availableSlots
              : ["No slots available"]
            ).map((t) => (
              <option key={t} value={t} disabled={t === "No slots available"}>
                {t}
              </option>
            ))}
          </select>
          {date === todayStr && availableSlots.length === 0 && (
            <p className="mt-2 text-xs text-red-500">
              No slots left for today. Please pick another date.
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">No. of persons</span>
          </label>
          <input
            type="number"
            min={1}
            className="input input-bordered"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            required
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          className="w-full h-12 rounded-xl font-medium text-white border hover:opacity-90"
          style={{ backgroundColor: "#5dbea3", borderColor: "#5dbea3" }}
          type="submit"
          disabled={
            !date ||
            date < todayStr ||
            availableSlots.length === 0 ||
            !timeSlot ||
            !people
          }
        >
          {editBooking ? "Save Changes" : "Book Now"}
        </button>
      </form>

      {/* Ask to log in (existing component) */}
      <LoginRequiredModal
        open={askLoginOpen}
        onClose={() => setAskLoginOpen(false)}
        onLogin={async () => {
          try {
            const res = login();
            if (res?.then) await res;
          } finally {
            setAskLoginOpen(false);
          }
        }}
      />

      {/* Confirm booking */}
      <Modal
        open={confirmOpen}
        title="Confirm your booking"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn text-white"
              style={{ backgroundColor: "#5dbea3", borderColor: "#5dbea3" }}
              onClick={confirmBooking}
            >
              Yes, book now
            </button>
          </>
        }
      >
        <div className="space-y-1 text-sm">
          <p>
            <span className="opacity-70">Space:</span>{" "}
            <span className="font-medium">{space.name}</span>
          </p>
          <p>
            <span className="opacity-70">Date:</span>{" "}
            <span className="font-medium">{prettyDate}</span>
          </p>
          <p>
            <span className="opacity-70">Time:</span>{" "}
            <span className="font-medium">{timeSlot}</span>
          </p>
          <p>
            <span className="opacity-70">People:</span>{" "}
            <span className="font-medium">{people}</span>
          </p>
          <p className="pt-2">
            <span className="opacity-70">Est. total:</span>{" "}
            <span className="font-semibold text-sky-600">
              {peso ? peso.format(estimated) : `₱${estimated}`}
            </span>
            <span className="opacity-60"> (may vary by venue rules)</span>
          </p>
        </div>
      </Modal>

      <Modal
        open={successOpen}
        title="Booking successful!"
        onClose={() => setSuccessOpen(false)}
        actions={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setSuccessOpen(false)}
            >
              Close
            </button>
            <button
              className="btn text-gray-50"
              style={{ backgroundColor: "#F4D06F", borderColor: "#F4D06F" }}
              onClick={() => nav("/dashboard/bookings")}
            >
              Go to My Bookings
            </button>
          </>
        }
      >
        <p className="text-sm">
          Your reservation for <span className="font-medium">{space.name}</span>{" "}
          on <span className="font-medium">{prettyDate}</span> ({timeSlot}) is
          confirmed.
        </p>
      </Modal>
    </>
  );
}
