import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { BookingsProvider } from "./contexts/BookingsContext.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SpaceDetailPage from "./pages/SpaceDetailPage.jsx";
import DashboardBookingsPage from "./pages/DashboardBookingsPage.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import { FavoritesProvider } from "./contexts/FavoritesContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AuthToasts from "./components/AuthToasts.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BookingsProvider>
        <FavoritesProvider>
          <ErrorBoundary>
            <div
              className="min-h-screen flex flex-col text-base-content"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/space/:spaceId" element={<SpaceDetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route
                    path="/dashboard/bookings"
                    element={
                      <RequireAuth>
                        <DashboardBookingsPage />
                      </RequireAuth>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <AuthToasts />
            </div>
          </ErrorBoundary>
        </FavoritesProvider>
      </BookingsProvider>
    </AuthProvider>
  );
}
