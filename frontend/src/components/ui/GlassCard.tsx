import { PropsWithChildren } from "react";

export function GlassCard({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`glass rounded-2xl p-6 ${className}`}>{children}</div>;
}


