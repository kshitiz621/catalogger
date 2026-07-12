"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-2px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default:
          "bg-card text-foreground border-border",
        success:
          "border-success-border bg-success-bg text-success [&>svg]:text-success",
        warning:
          "border-warning-border bg-warning-bg text-warning-foreground [&>svg]:text-warning",
        destructive:
          "border-destructive/30 bg-destructive/8 text-destructive [&>svg]:text-destructive",
        info:
          "border-info-border bg-info-bg text-info [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantIcons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
  info: Info,
} as const

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", icon, dismissible, onDismiss, children, ...props }, ref) => {
    const DefaultIcon = variantIcons[variant ?? "default"]
    const renderIcon = icon ?? <DefaultIcon className="h-4 w-4" />

    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {renderIcon}
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-3 right-3 rounded-md p-1 text-current opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn("mb-1 font-semibold leading-none tracking-tight text-[13px]", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn("text-[12px] leading-relaxed opacity-90", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
