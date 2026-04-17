import clsx from "clsx";

export default function StatusBadge({ status }) {
  const map = {
    pending: "bg-gray-200 text-gray-800 border-gray-300",
    approved: "bg-black text-white border-black shadow-[0_0_10px_rgba(0,0,0,0.15)]",
    rejected: "bg-transparent text-gray-600 border-gray-300",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase",
        map[status] || "bg-gray-100 text-gray-500 border-gray-200"
      )}
    >
      {status}
    </span>
  );
}

