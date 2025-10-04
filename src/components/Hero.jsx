import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const imageUrl = "/images/Hero.jpg";
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, duration: 0.2 },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  // smooth-scroll to #list (accounts for sticky navbar)
  function goToList(e) {
    e.preventDefault();
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

  return (
    <header id="hero" className="relative w-full -mt-px">
      <div
        className="relative h-[420px] md:h-[520px] lg:h-[800px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-b from-transparent to-base-100" />
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-6 lg:px-8">
          <div className="h-full flex items-center justify-center">
            <motion.div
              className="max-w-2xl text-center text-white drop-shadow-lg"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-6xl font-semibold leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Explore Your
                <br />
                Favorite Study Spot
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-5 text-base md:text-lg text-white/90"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Find, compare, and reserve the perfect co-working and study
                spaces <br /> in just a few clicks
              </motion.p>

              <motion.a
                variants={fadeUp}
                href="#list"
                onClick={goToList}
                className="btn btn-lg mt-6 normal-case rounded-full text-white border hover:opacity-90 active:scale-95 transition-transform"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#5dbea3",
                  borderColor: "#5dbea3",
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                Explore Now
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
