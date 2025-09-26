import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const slideIn = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function FeatureSection({
  imgWrapper = "max-w-[720px]",
  imgHeight = "h-[440px] md:h-[420px] lg:h-[500px]",
  onShowInlineSearch,
}) {
  const { user, login } = useAuth();
  const imageUrl = "public/images/FeatureSection.jpg";

  // scroll helper (no event dependency)
  function scrollToList() {
    const el = document.getElementById("list");
    if (!el) return;
    const navH = document.querySelector(".navbar")?.offsetHeight || 0;
    const top =
      window.pageYOffset + el.getBoundingClientRect().top - (navH + 12);
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
  }

  const isLoggedIn = !!user;
  const ctaLabel = isLoggedIn ? "Find Now" : "Log In Now";

  const ctaOnClick = isLoggedIn
    ? (e) => {
        e.preventDefault();
        onShowInlineSearch?.();
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToList);
        });
      }
    : (e) => {
        e.preventDefault();
        login();
      };

  const ctaClass =
    "btn btn-lg mt-7 normal-case rounded-full px-8 text-white border hover:opacity-90 active:scale-95 transition-transform";
  const ctaStyle = isLoggedIn
    ? { backgroundColor: "#5dbea3", borderColor: "#5dbea3" }
    : { backgroundColor: "#1e293b", borderColor: "#1e293b" };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Study smarter, your style, <br /> your vibe
          </h2>

          <p
            className="mt-5 text-base md:text-lg font-medium text-neutral-600 max-w-xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Find the right place to stay focused, productive, and feel
            comfortable while learning
          </p>

          <motion.a
            href={isLoggedIn ? "#list" : "#"}
            className={ctaClass}
            style={ctaStyle}
            onClick={ctaOnClick}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            {ctaLabel}
          </motion.a>
        </motion.div>

        {/* Image */}
        <motion.div
          variants={slideIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className={`rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 w-full ${imgWrapper}`}
        >
          <img
            src={imageUrl}
            alt="Cozy study corner"
            className={`w-full ${imgHeight} object-cover`}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
