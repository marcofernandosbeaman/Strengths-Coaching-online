import React from "react";
import { Check } from "lucide-react";

export function Checkbox({ className = "", checked = false, ...props }) {
  return (
    <div
      className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 border-neutral-200 ${
        checked ? "bg-neutral-900 border-neutral-900" : ""
      } ${className}`}
      {...props}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </div>
  );
}
