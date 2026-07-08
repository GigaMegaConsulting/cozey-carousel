import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Text } from "../Text";
import type { VideoSlideProps } from "./types";

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
            <Button
              size="sm"
              icon={<Icon name={isMuted ? "volume-muted" : "volume"} />}
              onClick={onToggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            />
            <Button
              size="sm"
              icon={<Icon name={isPaused ? "play" : "pause"} />}
              onClick={togglePlay}
              aria-label={isPaused ? "Play video" : "Pause video"}
            />
          </div>
        )}
      </div>
      <Text variant="caption" as="figcaption" className="carousel-slide__title">
        {item.title}
      </Text>
    </figure>
  );
}
