import * as React from "react";

import { cn } from "@/lib/utils";
import { BorderBeam } from "./border-beam";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  disableBeam?: boolean;
  wrapperClassName?: string;
  beamSize?: number;
  beamDuration?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disableBeam = false, wrapperClassName, beamSize = 200, beamDuration = 12, ...props }, ref) => {
    const widthClasses = className
      ? className
          .split(" ")
          .filter((c) => /^(?:[a-z]+:)?(?:w-|max-w-|min-w-)/.test(c))
          .join(" ")
      : "";

    return (
      <div className={cn("relative w-full rounded-md", widthClasses, wrapperClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";

export { Textarea };
