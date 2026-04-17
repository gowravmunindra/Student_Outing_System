import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({ open, title, children, onClose, className }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-white/60 backdrop-blur-sm cursor-default"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className={clsx("relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-black/5 shadow-2xl", className)}>
        {title ? <div className="mb-4 text-xl font-bold text-gray-900 tracking-tight">{title}</div> : null}
        {children}
      </div>
    </div>
  );
}

