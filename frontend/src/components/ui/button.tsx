import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "purple" | "pill";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      default: "bg-violet-600 text-white hover:bg-violet-700 shadow-sm",
      purple: "bg-[#7000FF] text-white hover:bg-[#6000e0] shadow-lg shadow-purple-600/30",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      outline: "border border-white/15 bg-transparent hover:bg-white/10 text-zinc-100",
      secondary: "bg-[#1b2536] text-[#c4b5fd] hover:bg-[#222f44] border border-[#27354d]/60",
      ghost: "hover:bg-white/10 text-zinc-300 hover:text-white",
      link: "text-violet-400 underline-offset-4 hover:underline",
      pill: "bg-[#7000FF] text-white rounded-full font-bold shadow-md shadow-purple-600/25",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
      pill: "h-10 px-5 py-2 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.default,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
