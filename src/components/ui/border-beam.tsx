"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Injects a block of CSS into the document head exactly once (keyed by id).
 */
function useGlobalStyles(css: string, id: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }, [css, id]);
}

const BORDER_BEAM_STYLES = `
@keyframes border-beam-spin {
  from {
    --angle: 0deg;
  }
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
`;

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  /** Match iOS-style squircle corners (requires Chrome 139+) */
  squircle?: boolean;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#ff6a00",
  colorTo = "#ffc83d",
  borderWidth = 1.5,
  squircle = false,
}: BorderBeamProps) {
  useGlobalStyles(BORDER_BEAM_STYLES, "border-beam-styles");

  const squircleStyle = squircle
    ? ({ cornerShape: "squircle" } as React.CSSProperties)
    : {};

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className,
      )}
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--border-width": `${borderWidth}px`,
          ...squircleStyle,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={
          {
            padding: "var(--border-width)",
            background: `
            conic-gradient(
              from var(--angle, 0deg) at 50% 50%,
              transparent 0deg,
              transparent 245deg,
              var(--color-from) 290deg,
              var(--color-to) 325deg,
              #ffffff 350deg,
              var(--color-to) 356deg,
              transparent 360deg
            )
          `,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            animation: `border-beam-spin var(--duration) linear infinite var(--delay)`,
            filter: "drop-shadow(0 0 5px var(--color-to)) drop-shadow(0 0 2px var(--color-from))",
            ...squircleStyle,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default BorderBeam;
