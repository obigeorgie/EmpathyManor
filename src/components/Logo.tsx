import React from "react";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vertical Spine (Elevator core / main structure) */}
      <rect x="6" y="4" width="8" height="32" fill="currentColor" />
      
      {/* Top floor / Penthouse */}
      <rect x="16" y="4" width="18" height="6" fill="currentColor" />
      
      {/* Middle floor / Terrace */}
      <rect x="16" y="17" width="12" height="6" fill="currentColor" />
      
      {/* Ground floor / Base */}
      <rect x="16" y="30" width="18" height="6" fill="currentColor" />

      {/* Emerald accent (glass window / green energy indicator) */}
      <rect x="29" y="17" width="5" height="6" className="fill-emerald-500" />
    </svg>
  );
}
