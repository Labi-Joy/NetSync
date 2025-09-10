import { ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function NeonButton({ variant = "primary", className = "", ...props }: NeonButtonProps) {
  const classes =
    variant === "primary"
      ? "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white glow"
      : "glass text-white";
  return (
    <button
      {...props}
      className={`${classes} px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-all ${className}`}
    />
  );
}


