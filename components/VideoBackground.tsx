"use client";

import { useCallback, useState } from "react";

type VideoBackgroundProps = {
  src: string;
  className?: string;
  /** Extra class on the video element for parallax targeting */
  videoClassName?: string;
};

/**
 * Muted looping background video with graceful fallback when the file is missing.
 */
export function VideoBackground({
  src,
  className = "",
  videoClassName = "",
}: VideoBackgroundProps) {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
      {!failed ? (
        <video
          className={`parallax-layer absolute inset-0 h-full w-full scale-105 object-cover ${videoClassName}`}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onError={handleError}
        />
      ) : (
        <div className="pore-fallback parallax-layer absolute inset-0 scale-105" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,18,0.35)_0%,rgba(10,14,18,0.55)_100%)]" />
    </div>
  );
}
