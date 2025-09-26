import React from "react";

export default function SearchBar({
  query,
  setQuery,
  floating = true,
  width = "max-w-[900px]",
  pad = "px-6 py-3",
  onDockRequest,
  onUndockRequest,
  inputRef = null,
  onPinChange = () => {},

  sort,
  setSort,
  status,
  setStatus,
}) {
  const baseWrap = "max-w-7xl mx-auto px-4 md:px-6 lg:px-8";
  const wrapperClass = floating
    ? `${baseWrap} -mt-10 md:-mt-14 relative z-20`
    : `${baseWrap}`;

  const [localSort, setLocalSort] = React.useState("name-asc");
  const [localStatus, setLocalStatus] = React.useState("All");
  const currentSort = sort ?? localSort;
  const currentStatus = status ?? localStatus;

  const [open, setOpen] = React.useState(false);

  // Grey-style chips (active vs idle)
  const chipBase =
    "inline-flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium border transition select-none";
  const chipActive = "bg-neutral-200 text-neutral-800 border-neutral-300";
  const chipIdle =
    "bg-base-100 text-base-content/80 border-base-300 hover:bg-neutral-100";

  function clearAndMaybeUndock() {
    setQuery("");
    if (!floating) onUndockRequest?.();
    onPinChange(false);
  }

  function broadcast(nextSort, nextStatus) {
    window.dispatchEvent(
      new CustomEvent("spaces-filter", {
        detail: { sort: nextSort, status: nextStatus },
      })
    );
  }

  function chooseSort(v) {
    if (setSort) setSort(v);
    else setLocalSort(v);
    broadcast(v, currentStatus);
    setOpen(false);
  }

  function chooseStatus(v) {
    if (setStatus) setStatus(v);
    else setLocalStatus(v);
    broadcast(currentSort, v);
    setOpen(false);
  }

  return (
    <section className={wrapperClass}>
      <div
        className={`mt-3 ${width} mx-auto rounded-full bg-base-100 border border-base-300 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${pad}`}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => {
                onPinChange(true);
                if (floating) onDockRequest?.();
              }}
              onBlur={() => onPinChange(false)}
              onInput={() => {
                onPinChange(true);
                if (floating) onDockRequest?.();
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") clearAndMaybeUndock();
              }}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the perfect co-working spaces and study hubs..."
              className="input input-bordered w-full h-11 rounded-full pl-4 pr-10"
            />
            {query && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearAndMaybeUndock}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
              >
                ×
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className="btn btn-ghost btn-sm rounded-full border border-base-300 px-4"
              onMouseDown={(e) => {
                onPinChange(true);
                if (floating) {
                  e.preventDefault();
                  onDockRequest?.();
                  return;
                }
              }}
              onClick={() => {
                if (!floating) setOpen((o) => !o);
              }}
            >
              Filter
            </button>

            {!floating && open && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-base-100 border border-base-200 shadow-xl p-3 z-[1000]">
                {/* SORT BY */}
                <div className="text-xs uppercase tracking-wide opacity-60 mb-2">
                  Sort by
                </div>
                <div className="grid gap-2">
                  {[
                    ["name-asc", "Name A→Z"],
                    ["name-desc", "Name Z→A"],
                    ["price-asc", "Price: Low → High"],
                    ["price-desc", "Price: High → Low"],
                    ["location-asc", "Location A→Z"],
                    ["location-desc", "Location Z→A"],
                  ].map(([v, label]) => (
                    <button
                      key={v}
                      className={`${chipBase} ${
                        currentSort === v ? chipActive : chipIdle
                      }`}
                      onClick={() => chooseSort(v)}
                    >
                      <span>{label}</span>
                      {currentSort === v && <span className="ml-2">✓</span>}
                    </button>
                  ))}
                </div>

                {/* AVAILABILITY */}
                <div className="text-xs uppercase tracking-wide opacity-60 mt-3 mb-2">
                  Availability
                </div>
                <div className="flex flex-wrap gap-2">
                  {["All", "Available", "Fully Booked", "Closed"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => chooseStatus(opt)}
                      className={`${chipBase} ${
                        currentStatus === opt ? chipActive : chipIdle
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
