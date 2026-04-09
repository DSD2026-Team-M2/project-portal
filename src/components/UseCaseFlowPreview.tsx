import { ChevronDown, GitBranch } from "lucide-react";
import { useId, useState } from "react";

type UseCaseFlowPreviewProps = {
  imageSrc: string;
  title: string;
};

export function UseCaseFlowPreview({ imageSrc, title }: UseCaseFlowPreviewProps) {
  const panelId = useId();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverSuppressed, setIsHoverSuppressed] = useState(false);
  const isOpen = isPinned || (isHovered && !isHoverSuppressed);

  const handleClick = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsHoverSuppressed(true);
      return;
    }

    setIsPinned(true);
    setIsHoverSuppressed(false);
  };

  return (
    <div
      className="usecase-flow"
      data-open={isOpen ? "true" : "false"}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsHoverSuppressed(false);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsHoverSuppressed(false);
      }}
    >
      <button
        type="button"
        className="usecase-flow-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleClick}
      >
        <div className="usecase-flow-copy">
          <GitBranch className="h-4 w-4 shrink-0 text-sky-700" />
          <span className="usecase-flow-kicker">Sequence diagram</span>
          <span className="usecase-flow-divider" aria-hidden="true">
            ·
          </span>
          <span className="usecase-flow-title">{title}</span>
          <span className="usecase-flow-hint">Hover or click</span>
        </div>
        <ChevronDown className="usecase-flow-chevron" />
      </button>

      {isOpen ? (
        <div id={panelId} className="usecase-flow-panel">
          <div className="usecase-flow-image-shell">
            <img
              src={imageSrc}
              alt={`${title} sequence diagram`}
              loading="lazy"
              className="usecase-flow-image"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
