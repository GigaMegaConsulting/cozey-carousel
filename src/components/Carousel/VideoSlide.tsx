import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "./types";

interface VideoSlideProps {
  item: MediaItem;
  /** Only the active slide plays, shows controls, and accepts pointer input. */
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

/**
 * One card in the carousel. Owns its <video> element and enforces the
 * "only the visible video is interactive" rule:
 *  - active   → attempts playback, shows mute/pause controls, blue highlight
 *  - inactive → paused, rewound, pointer-events disabled (CSS), aria-hidden
 */
export function VideoSlide({ item, isActive, isMuted, onToggleMute }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Muted + playsInline are required for autoplay on iOS/Safari/Chrome.
      // play() returns a promise that rejects if the browser blocks it —
      // we swallow that and let the user start playback via the control.
      if (!isPaused) {
        video.play().catch(() => setIsPaused(true));
      }
    } else {
      video.pause();
      video.currentTime = 0; // rewind so re-entering a slide restarts it
      setIsPaused(false);
    }
  }, [isActive, isPaused]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => undefined);
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <figure
      className={`carousel-slide${isActive ? " is-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="carousel-slide__frame">
        {failed || !item.src ? (
          // Checkerboard placeholder, matching the Figma empty state
          <div className="carousel-slide__placeholder" role="img" aria-label={item.title} />
        ) : (
          <video
            ref={videoRef}
            className="carousel-slide__video"
            src={item.src}
            poster={item.poster}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
          />
        )}

        {isActive && (
          <div className="carousel-slide__controls">
            <button
              type="button"
              className="icon-btn"
              onClick={onToggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <MutedIcon /> : <SoundIcon />}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={togglePlay}
              aria-label={isPaused ? "Play video" : "Pause video"}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
          </div>
        )}
      </div>
      <figcaption className="carousel-slide__title">{item.title}</figcaption>
    </figure>
  );
}

/* Inline icons — keeps the component dependency-free */
function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
