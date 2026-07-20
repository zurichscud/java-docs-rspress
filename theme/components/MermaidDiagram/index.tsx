import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type WheelEvent,
} from 'react';
import mermaid, { type MermaidConfig } from 'mermaid';

import './index.css';

interface MermaidDiagramProps {
  code: string;
  config?: MermaidConfig;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export default function MermaidDiagram({
  code,
  config = {},
}: MermaidDiagramProps) {
  const diagramId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [svg, setSvg] = useState('');
  const [renderError, setRenderError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);

  const renderDiagram = useCallback(async () => {
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const mermaidConfig: MermaidConfig = {
      securityLevel: 'loose',
      startOnLoad: false,
      theme: hasDarkClass ? 'dark' : 'default',
      ...config,
    };

    try {
      mermaid.initialize(mermaidConfig);
      const { svg: renderedSvg } = await mermaid.render(
        diagramId.replace(/:/g, ''),
        code,
      );

      setSvg(renderedSvg);
      setRenderError(false);
    } catch {
      setRenderError(true);
    }
  }, [code, config, diagramId]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  useEffect(() => {
    const observer = new MutationObserver(renderDiagram);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [renderDiagram]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  if (renderError) {
    return null;
  }

  const modalStyle = {
    '--mermaid-zoom': String(zoom),
  } as CSSProperties;

  const openDialog = () => {
    setZoom(1);
    setIsExpanded(true);
  };

  const closeDialog = () => setIsExpanded(false);

  const preventScrollChaining = (event: WheelEvent<HTMLDivElement>) => {
    if (event.shiftKey) {
      return;
    }

    const viewport = event.currentTarget;
    const hasVerticalOverflow = viewport.scrollHeight > viewport.clientHeight;
    const isAtTop = viewport.scrollTop <= 0;
    const isAtBottom =
      Math.ceil(viewport.scrollTop + viewport.clientHeight) >= viewport.scrollHeight;

    if (
      !hasVerticalOverflow ||
      (event.deltaY < 0 && isAtTop) ||
      (event.deltaY > 0 && isAtBottom)
    ) {
      event.preventDefault();
    }
  };

  return (
    <div className="mermaid-diagram">
      <div
        className="mermaid-diagram__preview"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <button
        className="mermaid-diagram__expand"
        type="button"
        onClick={openDialog}
        aria-label="放大查看 Mermaid 图表"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>

      {isExpanded && (
        <div
          className="mermaid-diagram__overlay"
          onMouseDown={closeDialog}
          role="presentation"
        >
          <section
            className="mermaid-diagram__dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Mermaid 图表放大查看"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="mermaid-diagram__toolbar">
              <span>Mermaid 图表</span>
              <div className="mermaid-diagram__controls">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((currentZoom) =>
                      Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP),
                    )
                  }
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="缩小图表"
                >
                  −
                </button>
                <output aria-live="polite">{Math.round(zoom * 100)}%</output>
                <button
                  type="button"
                  onClick={() =>
                    setZoom((currentZoom) =>
                      Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP),
                    )
                  }
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="放大图表"
                >
                  +
                </button>
                <button type="button" onClick={() => setZoom(1)}>
                  重置
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeDialog}
                  aria-label="关闭图表放大查看"
                >
                  ×
                </button>
              </div>
            </header>
            <div
              className="mermaid-diagram__viewport"
              onWheel={preventScrollChaining}
            >
              <div
                className="mermaid-diagram__canvas"
                style={modalStyle}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
