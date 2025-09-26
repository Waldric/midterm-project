import React from "react";
import { createPortal } from "react-dom";

export default function AuthToasts() {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [kind, setKind] = React.useState("login");
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    function show(message, type) {
      setMsg(message);
      setKind(type);
      setOpen(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpen(false), 2200);
    }

    function onLogin(e) {
      const name = e?.detail?.user?.name || "User";
      show(`Welcome back, ${name}! You’re now logged in.`, "login");
    }
    function onLogout() {
      show("You have successfully logged out.", "logout");
    }

    window.addEventListener("auth:login", onLogin);
    window.addEventListener("auth:logout", onLogout);
    return () => {
      window.removeEventListener("auth:login", onLogin);
      window.removeEventListener("auth:logout", onLogout);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!open) return null;

  const cls =
    kind === "login" ? "bg-gray-700 text-white" : "bg-[#1f2937] text-white";

  return createPortal(
    <div className="toast toast-top toast-center z-[9999]">
      <div className={`alert ${cls} shadow-lg`}>
        <span className="text-sm">{msg}</span>
        <button className="btn btn-ghost btn-xs" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
