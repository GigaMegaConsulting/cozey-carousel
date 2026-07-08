import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { useCarousel } from "./useCarousel";
import { VideoSlide } from "./VideoSlide";
import type { CarouselProps } from "./types";
import "./Carousel.css";

/**
 * Video carousel — infinite in both directions, first video autoplays,
 * only the focused card is interactive.
 *
 * Design decisions (see README for the long version):
 * - The track renders items ×3 and snaps silently between copies for
 *   infinite scrolling (logic isolated in useCarousel).
 * - Slide geometry lives in CSS custom properties (--slide-w, --slide-gap),
 *   so the transform math and the responsive layout can't drift apart.
 * - Navigation is disabled while a transition runs: rapid clicks can't
 *   queue up animations or desync state.
 */
export function Carousel({ items, heading = "A day in the life" }: CarouselProps) {
  const { extIndex, activeIndex, snap, next, prev, handleTransitionEnd } =
    useCarousel(items.length);
  const [isMuted, setIsMuted] = useState(true); // muted = autoplay-safe default
  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  // 3 copies of the list; keys encode the copy so React never remounts wrongly.
  const extended = [0, 1, 2].flatMap((copy) =>
    items.map((item, i) => ({ item, key: `${copy}-${item.id}`, extPos: copy * items.length + i }))
  );

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label={heading}
      onKeyDown={onKeyDown}
    >
      <div className="carousel__header">
        <Text variant="heading">{heading}</Text>
        <div className="carousel__nav">
          <Button icon={<Icon name="chevron-left" />} onClick={prev} aria-label="Previous video" />
          <Button icon={<Icon name="chevron-right" />} onClick={next} aria-label="Next video" />
        </div>
      </div>

      <div className="carousel__viewport">
        <ul
          className={`carousel__track${snap ? " no-transition" : ""}`}
          style={{ "--ext-index": extIndex } as React.CSSProperties}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map(({ item, key, extPos }) => (
            <li key={key} className="carousel__cell">
              <VideoSlide
                item={item}
                isActive={extPos === extIndex}
                isMuted={isMuted}
                onToggleMute={toggleMute}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Screen-reader position announcement */}
      <p className="visually-hidden" aria-live="polite">
        Video {activeIndex + 1} of {items.length}: {items[activeIndex].title}
      </p>
    </section>
  );
}
