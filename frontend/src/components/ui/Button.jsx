import clsx from "clsx";

export default function Button({ className, variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "glass-button-primary",
    secondary: "glass-button-secondary",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300",
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}

