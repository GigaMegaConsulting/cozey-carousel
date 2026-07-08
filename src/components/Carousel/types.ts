export interface MediaItem {
  /** Stable identifier — used for React keys across clones */
  id: string;
  /** Title rendered under the card (per Figma) */
  title: string;
  /** Video source URL. Drop files in /public/videos and reference as /videos/name.mp4 */
  src: string;
  /** Optional poster shown before playback / if the video fails to load */
  poster?: string;
}

export interface CarouselProps {
  items: MediaItem[];
  /** Section heading, per Figma ("A day in the life") */
  heading?: string;
}

export interface VideoSlideProps {
  item: MediaItem;
  /** Only the active slide plays, shows controls, and accepts pointer input. */
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}
