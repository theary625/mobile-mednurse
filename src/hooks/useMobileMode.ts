import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Returns whether the app should use "mobile mode".
 * - Supports query overrides: ?mobile=1 forces mobile, ?mobile=0 forces desktop.
 * - Otherwise uses a viewport media query.
 */
export function useMobileMode(maxWidthPx = 768) {
  const location = useLocation();

  const forced = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("mobile");
    if (v === "1" || v === "true") return true;
    if (v === "0" || v === "false") return false;
    return null;
  }, [location.search]);

  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    const mq = `(max-width: ${maxWidthPx}px)`;
    return window.matchMedia?.(mq)?.matches ?? window.innerWidth <= maxWidthPx;
  });

  useEffect(() => {
    if (forced !== null) return;
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = `(max-width: ${maxWidthPx}px)`;
    const mediaQueryList = window.matchMedia(mq);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handler);
    return () => mediaQueryList.removeEventListener("change", handler);
  }, [forced, maxWidthPx]);

  return forced ?? matches;
}

