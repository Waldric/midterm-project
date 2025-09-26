import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import LoginRequiredModal from "./LoginRequiredModal.jsx";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { favs } = useFavorites();

  const nav = useNavigate();
  const location = useLocation();
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);

  // Smooth scroll to #hero (accounts for sticky navbar)
  function scrollToHero() {
    const el = document.getElementById("hero");
    if (!el) return;
    const navH = document.querySelector(".navbar")?.offsetHeight || 0;
    const top =
      window.pageYOffset + el.getBoundingClientRect().top - (navH + 12);
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
  }

  // Click handler for Home/Brand
  function goHomeAndScroll(e) {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToHero();
    } else {
      nav("/");
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToHero);
      });
    }
  }

  function handleMyBookingsClick(e) {
    if (!user) {
      e.preventDefault();
      setAskLoginOpen(true);
    }
  }

  const underlineBase =
    "px-2 py-1 relative transition-colors after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-1 after:w-8 after:rounded-full after:bg-current after:transition-opacity";
  const underlineActive = "text-neutral-900 after:opacity-100";
  const underlineIdle =
    "text-base-content/70 hover:text-base-content after:opacity-0";

  return (
    <>
      <div className="navbar bg-base-100/50 backdrop-blur-md sticky top-0 z-50">
        <div className="navbar-start">
          <Link
            to="/"
            onClick={goHomeAndScroll}
            className="btn btn-ghost px-2 normal-case"
          >
            <span className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 ">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24">
                  <path d="M4 19h16a1 1 0 0 1 0 2H4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h16a1 1 0 0 1 0 2H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1z" />
                  <path d="M6 7h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                </svg>
              </div>

              <span
                className="text-2xl tracking-[0.05em]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="font-light">STUDYSPOT</span>
                <span className="text-black font-bold">PH</span>
              </span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4 text-sm">
            <li>
              <NavLink
                to="/"
                onClick={goHomeAndScroll}
                className={({ isActive }) =>
                  `${underlineBase} ${
                    isActive ? underlineActive : underlineIdle
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/bookings"
                onClick={handleMyBookingsClick}
                className={({ isActive }) =>
                  `${underlineBase} ${
                    isActive ? underlineActive : underlineIdle
                  }`
                }
              >
                My Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `${underlineBase} ${
                    isActive ? underlineActive : underlineIdle
                  } flex items-center gap-2`
                }
              >
                Favorites
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-end mr-2 gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
              <span className="opacity-70">Welcome,</span>
              <span className="font-semibold">{user.name}!</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-base-200 text-base-content/70">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>
          )}

          {!user ? (
            <button
              className="btn btn-sm md:btn-md bg-gray-800 text-neutral-content
             hover:bg-neutral-focus
             border-gray-800 hover:border-neutral-focus
             rounded-full px-6"
              onClick={login}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-sm md:btn-md bg-neutral text-neutral-content hover:bg-neutral-focus border-neutral hover:border-neutral-focus rounded-full px-6"
              onClick={logout}
            >
              Log out
            </button>
          )}
        </div>
      </div>

      {/* Global login validation modal */}
      <LoginRequiredModal
        open={askLoginOpen}
        onClose={() => setAskLoginOpen(false)}
        onLogin={() => {
          login();
          setAskLoginOpen(false);
          setTimeout(() => nav("/dashboard/bookings"), 0);
        }}
      />
    </>
  );
}
