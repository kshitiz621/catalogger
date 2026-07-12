import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Core layout — h-9 (36px) aligns to 8px grid
        "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-[13px] text-foreground transition-all duration-150 outline-none",
        // Placeholder
        "placeholder:text-muted-foreground",
        // Focus state
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        // File input
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
        // Invalid state
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        // Dark mode input
        "dark:bg-input/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
