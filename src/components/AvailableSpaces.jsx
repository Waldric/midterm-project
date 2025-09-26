import React from "react";
import { SPACES } from "../data/spaces.js";
import SpaceCard from "./SpaceCard.jsx";
import SearchBar from "./SearchBar.jsx";
import { motion } from "framer-motion";

function sortSpaces(arr, sort) {
  const byStr =
    (get, dir = 1) =>
    (a, b) =>
      get(a).localeCompare(get(b)) * dir;
  const byNum =
    (get, dir = 1) =>
    (a, b) =>
      (get(a) - get(b)) * dir;
  switch (sort) {
    case "name-asc":
      return [...arr].sort(byStr((s) => s.name, 1));
    case "name-desc":
      return [...arr].sort(byStr((s) => s.name, -1));
    case "price-asc":
      return [...arr].sort(byNum((s) => Number(s.price), 1));
    case "price-desc":
      return [...arr].sort(byNum((s) => Number(s.price), -1));
    case "location-asc":
      return [...arr].sort(byStr((s) => s.location, 1));
    case "location-desc":
      return [...arr].sort(byStr((s) => s.location, -1));
    default:
      return arr;
  }
}

export default function AvailableSpaces({
  query = "",
  setQuery,
  showInlineSearch = false,
  onUndockRequest,
  sort: sortProp,
  setSort: setSortProp,
  status: statusProp,
  setStatus: setStatusProp,
  inputRef,
  onPinChange,
}) {
  const [sortLocal, setSortLocal] = React.useState("name-asc");
  const [statusLocal, setStatusLocal] = React.useState("All");
  const sort = sortProp ?? sortLocal;
  const setSort = setSortProp ?? setSortLocal;
  const status = statusProp ?? statusLocal;
  const setStatus = setStatusProp ?? setStatusLocal;

  React.useEffect(() => {
    function onFilter(e) {
      const { sort: s, status: st } = e.detail || {};
      if (s) setSort(s);
      if (typeof st !== "undefined") setStatus(st);
    }
    window.addEventListener("spaces-filter", onFilter);
    return () => window.removeEventListener("spaces-filter", onFilter);
  }, [setSort, setStatus]);

  const q = query.trim().toLowerCase();
  const byQuery = SPACES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
  );

  const byStatus =
    status === "All"
      ? byQuery
      : byQuery.filter(
          (s) => (s.status || "").toLowerCase() === status.toLowerCase()
        );

  const sorted = sortSpaces(byStatus, sort);
  const availableCount = sorted.filter(
    (s) => (s.status || "").toLowerCase() === "available"
  ).length;

  return (
    <div className="bg-base-100">
      <section
        id="list"
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8
                   pt-8 md:pt-28 pb-10 md:pb-12
                  
                   scroll-mt-24"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-800"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Discover Available Spaces
            </h2>
          </motion.div>

          <p
            className="mt-2 text-sm md:text-base font-medium text-neutral-500"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            See what’s open and find the space that fits your study vibe
          </p>
        </div>

        {showInlineSearch && (
          <div className="mt-4 sticky top-20 z-40">
            <SearchBar
              query={query}
              setQuery={setQuery}
              floating={false}
              width="w-full"
              pad="px-4 py-2"
              onUndockRequest={onUndockRequest}
              sort={sort}
              setSort={setSort}
              status={status}
              setStatus={setStatus}
              inputRef={inputRef}
              onPinChange={onPinChange}
            />
          </div>
        )}

        <p className="mt-6 text-xs opacity-60">{availableCount} Available</p>

        {sorted.length === 0 ? (
          <div className="mt-6 rounded-box border border-dashed border-base-300 p-8 text-center text-sm opacity-70">
            No spaces match your search.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((item) => (
              <SpaceCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
