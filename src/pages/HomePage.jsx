import React from "react";
import Hero from "../components/Hero.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AvailableSpaces from "../components/AvailableSpaces.jsx";
import FeatureSection from "../components/FeatureSection.jsx";

export default function HomePage() {
  const [query, setQuery] = React.useState("");
  const [docked, setDocked] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [sort, setSort] = React.useState("name-asc");
  const [status, setStatus] = React.useState("All");

  const dockedInputRef = React.useRef(null);
  const [obsKey, setObsKey] = React.useState(0);

  React.useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setObsKey((k) => k + 1), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  React.useEffect(() => {
    const listEl = document.getElementById("list");
    if (!listEl) return;

    const navH = document.querySelector(".navbar")?.offsetHeight || 0;
    const rootMarginTop = -(navH + 12) + "px";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (pinned) return;
        setDocked(entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: `${rootMarginTop} 0px 0px 0px` }
    );

    io.observe(listEl);
    return () => io.disconnect();
  }, [pinned, obsKey]);

  function scrollToListAndFocus() {
    const el = document.getElementById("list");
    if (!el) return;
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    el.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });

    const focusAfter = () => dockedInputRef.current?.focus();
    if ("onscrollend" in window) {
      const handler = () => {
        window.removeEventListener("scrollend", handler);
        focusAfter();
      };
      window.addEventListener("scrollend", handler, { once: true });
      setTimeout(() => {
        window.removeEventListener("scrollend", handler);
        focusAfter();
      }, 500);
    } else {
      setTimeout(focusAfter, 450);
    }
  }

  function handleFindNow() {
    setDocked(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToListAndFocus);
    });
  }

  return (
    <>
      <Hero />

      {!docked && (
        <SearchBar
          query={query}
          setQuery={setQuery}
          floating
          width="max-w-[900px]"
          pad="px-6 py-3"
          sort={sort}
          setSort={setSort}
          status={status}
          setStatus={setStatus}
          onDockRequest={() => {
            setDocked(true);
            requestAnimationFrame(() => {
              requestAnimationFrame(scrollToListAndFocus);
            });
          }}
          onPinChange={setPinned}
        />
      )}

      <div className="mt-20">
        <FeatureSection
          imgWrapper="max-w-[900px]"
          imgHeight="h-[520px] md:h-[600px] lg:h-[680px]"
          onShowInlineSearch={handleFindNow}
        />
      </div>

      <div className="mt-20 transform-none">
        <AvailableSpaces
          query={query}
          setQuery={setQuery}
          showInlineSearch={docked}
          onUndockRequest={() => setDocked(false)}
          sort={sort}
          setSort={setSort}
          status={status}
          setStatus={setStatus}
          inputRef={dockedInputRef}
          onPinChange={setPinned}
        />
      </div>
    </>
  );
}
