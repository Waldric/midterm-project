import React from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

export const BookingsContext = React.createContext(null);
export function useBookings() {
  return React.useContext(BookingsContext);
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useLocalStorage("ssph_bookings", []);
  const addBooking = (b) =>
    setBookings((prev) => [{ ...b, id: uid() }, ...prev]);
  const removeBooking = (id) =>
    setBookings((prev) => prev.filter((x) => x.id !== id));
  const updateBooking = (id, patch) =>
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, removeBooking, updateBooking }}
    >
      {children}
    </BookingsContext.Provider>
  );
}
