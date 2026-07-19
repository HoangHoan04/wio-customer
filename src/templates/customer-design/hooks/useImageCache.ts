import { useEffect, useRef, useState } from "react";

const globalCache = new Map<string, HTMLImageElement>();

export function useImageCache(src: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(() =>
    src ? (globalCache.get(src) ?? null) : null
  );
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    const cached = globalCache.get(src);
    if (cached) {
      setImage(cached);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      globalCache.set(src, img);
      if (mountedRef.current) {
        setImage(img);
      }
    };
    img.onerror = () => {
      if (mountedRef.current) setImage(null);
    };
  }, [src]);

  return image;
}
