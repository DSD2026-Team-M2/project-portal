import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouterEffects() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace(/^#/, "");

    if (hash) {
      window.requestAnimationFrame(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ block: "start" });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [location.hash, location.pathname]);

  return null;
}
