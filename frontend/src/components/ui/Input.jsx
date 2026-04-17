import clsx from "clsx";

export default function Input({ label, error, className, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-1.5 text-sm font-medium text-gray-800">{label}</div> : null}
      <input
        className={clsx(
          "w-full rounded-xl px-4 py-2.5 text-sm",
          "glass-input",
          error ? "!border-red-500 focus:!border-red-600 focus:ring-1 focus:ring-red-500 text-red-900" : "",
          className
        )}
        {...props}
      />
      {error ? <div className="mt-1.5 text-xs text-red-600">{error}</div> : null}
    </label>
  );
}

