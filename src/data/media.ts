import type { MediaItem } from "../components/Carousel";

/**
 * Media manifest.
 * Drop the provided video files into /public/videos and update `src` below.
 * Titles match the Figma comp; slides with a missing/failed source render
 * the Figma checkerboard placeholder instead of breaking.
 */
export const media: MediaItem[] = [
  { id: "whispers",   title: "Whispers of Ipsum",            src: "/videos/whispers.mp4" },
  { id: "forest",     title: "Forest of Lorem Ipsum",        src: "/videos/forest.mp4" },
  { id: "wilderness", title: "Lorem Ipsum in the Wilderness", src: "/videos/wilderness.mp4" },
  { id: "tide",       title: "The Ipsum Tide",               src: "/videos/tide.mp4" },
  { id: "echoes",     title: "Echoes of Ipsum",              src: "/videos/echoes.mp4" },
];
