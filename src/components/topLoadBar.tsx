"use client";

import { useEffect, useState } from "react";

export default function TopLoadingBar({ duration = 5000 }: { duration?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: ReturnType<typeof setInterval> | null = null;
    const step = 100 / (duration / 100);

    frame = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (frame) clearInterval(frame);
          return 100;
        }
        return prev + step;
      });
    }, 100);

    return () => {
      if (frame) clearInterval(frame);
    };
  }, [duration]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
