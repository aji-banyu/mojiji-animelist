"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef(({ label, className, ...rest }, ref) => (
  <label
    className={cn(
      "flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-[#A5AAC0] hover:text-[#ECEEF6] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45 select-none transition-colors",
      className
    )}
  >
    <input ref={ref} type="checkbox" className="peer sr-only" {...rest} />
    <span className="grid size-5 place-items-center rounded-md border border-[#2B2D38] bg-[#1E1F24] text-white transition-all duration-150 peer-checked:border-[#6B68C6] peer-checked:bg-[#6B68C6] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#6B68C6]/50 [&>svg]:scale-0 peer-checked:[&>svg]:scale-100">
      <Check className="size-3.5 transition-transform duration-150 ease-out" strokeWidth={2.5} />
    </span>
    {label}
  </label>
));

Checkbox.displayName = "Checkbox";
