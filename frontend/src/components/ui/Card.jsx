import clsx from "clsx";

export default function Card({ className, ...props }) {
  return (
    <div
      className={clsx("glass-panel rounded-2xl", className)}
      {...props}
    />
  );
}
