import { ArrowUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const BUTTON_SIZE = 60;
const RING_RADIUS = 24;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function getScrollProgress() {
  const root = document.documentElement;
  const maxScroll = root.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    return 0;
  }

  return Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
}

export function BackToTopButton() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setProgress(getScrollProgress());
      setVisible(window.scrollY > 280);
    };

    updateState();

    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  const strokeDashoffset = useMemo(
    () => RING_CIRCUMFERENCE - progress * RING_CIRCUMFERENCE,
    [progress],
  );

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`back-to-top-button ${visible ? "back-to-top-button-visible" : ""}`}
      aria-label={t("common.backToTop")}
      title={t("common.backToTop")}
    >
      <svg className="back-to-top-ring" viewBox={`0 0 ${BUTTON_SIZE} ${BUTTON_SIZE}`} aria-hidden="true">
        <circle className="back-to-top-ring-track" cx={BUTTON_SIZE / 2} cy={BUTTON_SIZE / 2} r={RING_RADIUS} />
        <circle
          className="back-to-top-ring-progress"
          cx={BUTTON_SIZE / 2}
          cy={BUTTON_SIZE / 2}
          r={RING_RADIUS}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className="back-to-top-core">
        <ArrowUp className="h-5 w-5" />
      </span>
    </button>
  );
}
