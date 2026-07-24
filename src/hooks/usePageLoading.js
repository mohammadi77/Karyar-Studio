import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const PAGE_LOADING_MS = 3000;

export function usePageLoading() {
  const { pathname } = useLocation();
  const [pageLoading, setPageLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), PAGE_LOADING_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return pageLoading;
}
