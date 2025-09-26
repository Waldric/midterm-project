import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  if (user) return children;
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="card border border-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Login required</h3>
          <p className="text-sm opacity-80">
            Please log in to access this page.
          </p>
        </div>
      </div>
    </div>
  );
}
