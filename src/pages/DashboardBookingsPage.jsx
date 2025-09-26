import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useBookings } from "../contexts/BookingsContext.jsx";
import BookingRow from "../components/BookingRow.jsx";

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const { bookings } = useBookings();

  const userId = user?.id ?? null;
  const mine = React.useMemo(
    () => bookings.filter((b) => b.userId === userId),
    [bookings, userId]
  );
  const count = mine.length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold">
        Welcome to your Dashboard{user?.name ? `, ${user.name}` : ""}!
      </h1>

      <h2 className="mt-8 font-semibold">Bookings</h2>

      {/* indicator under the header */}
      <div className="mt-1 flex items-center gap-2">
        <span className="badge bg-[#B2C8BA] text-white">{count}</span>
        <span className="text-sm opacity-70">
          {count === 1 ? "Saved booking" : "Saved bookings"}
        </span>
      </div>

      {count === 0 ? (
        <div className="mt-6 rounded-box border border-dashed border-base-300 p-8 text-center text-sm opacity-80">
          You have no bookings yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mine.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}

