"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

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

const GIF_TEXT_STYLES = `
@keyframes mpl-gold-sweep {
  0% {
    background-position: 250% 50%;
  }
  100% {
    background-position: -150% 50%;
  }
}
`;

export interface GifTextProps {
  /**
   * The text to display
   */
  text?: string;
  /**
   * The source URL for the background image/gif
   */
  gif?: string;
  /**
   * Class for the text element
   */
  className?: string;
  /**
   * Class for the container
   */
  containerClassName?: string;
  /**
   * Semantic HTML tag (default: "h1")
   */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /**
   * Optional child elements if not using the text prop
   */
  children?: React.ReactNode;
}

export const GifText = ({
  text = "MASUR PREMIER LEAGUE",
  gif = "",
  className,
  containerClassName,
  as: Component = "h1",
  children,
}: GifTextProps) => {
  useGlobalStyles(GIF_TEXT_STYLES, "mpl-gif-text-styles");

  const [loading, setLoading] = useState(Boolean(gif));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!gif) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasError(false);

    const img = new Image();
    img.src = gif;

    img.onload = () => {
      setLoading(false);
    };

    img.onerror = () => {
      setLoading(false);
      setHasError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [gif]);

  // If a gif is provided and loaded, use the gif background.
  // Otherwise, fallback to the visually equivalent CSS-based gold/orange stadium lighting sweep.
  const isUsingGif = Boolean(gif) && !loading && !hasError;

  const textStyle: React.CSSProperties = isUsingGif
    ? {
        backgroundImage: `url(${gif})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        color: "transparent",
      }
    : {
        backgroundImage:
          "linear-gradient(110deg, #FFFFFF 15%, #FFF0B3 30%, #FFD84D 42%, #FFC83D 50%, #FF6A00 60%, #FFF0B3 72%, #FFFFFF 85%)",
        backgroundSize: "250% 100%",
        animation: "mpl-gold-sweep 5s ease-in-out infinite",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        color: "transparent",
      };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center max-w-full",
        containerClassName
      )}
    >
      <Component
        className={cn(
          "text-center uppercase leading-tight transition-colors duration-300 max-w-full break-words",
          "text-transparent bg-clip-text",
          className
        )}
        style={textStyle}
      >
        {children ?? text}
      </Component>
    </div>
  );
};

export default GifText;
