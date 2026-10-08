import * as React from "react";

import { cn } from "@/lib/utils";
import { BorderBeam } from "./border-beam";

export interface InputProps extends React.ComponentProps<"input"> {
  disableBeam?: boolean;
  wrapperClassName?: string;
  beamSize?: number;
  beamDuration?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disableBeam = false, wrapperClassName, beamSize = 160, beamDuration = 12, ...props }, ref) => {
    if (type === "hidden") {
      return <input type="hidden" ref={ref} {...props} />;
    }

    const widthClasses = className
      ? className
          .split(" ")
          .filter((c) => /^(?:[a-z]+:)?(?:w-|max-w-|min-w-)/.test(c))
          .join(" ")
      : "";

    return (
      <div className={cn("relative w-full rounded-md", widthClasses, wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
        {!disableBeam && (
          <BorderBeam
            size={beamSize}
            duration={beamDuration}
            borderWidth={1.5}
            colorFrom="#ff6a00"
            colorTo="#ffc83d"
          />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
