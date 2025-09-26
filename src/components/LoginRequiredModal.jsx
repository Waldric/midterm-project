import React from "react";
import { createPortal } from "react-dom";

export default function LoginRequiredModal({ open, onClose, onLogin }) {
  if (!open) return null;
  return createPortal(
    <div className="modal modal-open z-[9999]">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Login Required</h3>
        <p className="py-3 text-sm opacity-80">
          Please log in to access your bookings and favorites.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="btn text-white rounded-full px-6 border hover:opacity-90"
            style={{ backgroundColor: "#5dbea3", borderColor: "#5dbea3" }}
            onClick={onLogin}
          >
            Login
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>,
    document.body
  );
}
