"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef(({ label, className, ...rest }, ref) => (
  <label
    className={cn(
      "flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-text-2 hover:text-text has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45 select-none transition-colors",
      className
    )}
  >
    <input ref={ref} type="checkbox" className="peer sr-only" {...rest} />
    <span className="grid size-5 place-items-center rounded-md border border-border bg-surface text-accent-foreground transition-all duration-150 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent/50 [&>svg]:scale-0 peer-checked:[&>svg]:scale-100">
      <Check className="size-3.5 transition-transform duration-150 ease-out" strokeWidth={2.5} />
    </span>
    {label}
  </label>
));

Checkbox.displayName = "Checkbox";
