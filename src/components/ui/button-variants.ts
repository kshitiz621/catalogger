import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none cursor-pointer " +
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 " +
    "active:scale-[0.98] " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        outline:
          "border-border bg-card text-foreground hover:bg-secondary hover:text-foreground dark:border-input dark:bg-input/20 dark:hover:bg-input/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost:
          "text-foreground hover:bg-secondary hover:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-9 px-4",
        lg: "h-10 px-5 rounded-lg text-[13px]",
        icon: "size-9",
        "icon-sm": "size-8 rounded-md",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
