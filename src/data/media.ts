import type { MediaItem } from "../components/Carousel";

/**
 * Media manifest — the 15 provided videos (compressed to 720p portrait for
 * web delivery; originals were up to 130 MB, far too heavy to autoplay).
 * The first five titles match the Figma comp; the rest continue its
 * lorem-ipsum naming. Slides with a missing/failed source render the Figma
 * checkerboard placeholder instead of breaking.
 */
export const media: MediaItem[] = [
  { id: "v1",  title: "Whispers of Ipsum",             src: "/videos/1.mp4" },
  { id: "v2",  title: "Forest of Lorem Ipsum",         src: "/videos/2.mp4" },
  { id: "v3",  title: "Lorem Ipsum in the Wilderness", src: "/videos/3.mp4" },
  { id: "v4",  title: "The Ipsum Tide",                src: "/videos/4.mp4" },
  { id: "v5",  title: "Echoes of Ipsum",               src: "/videos/5.mp4" },
  { id: "v6",  title: "Dolor Under the Pines",         src: "/videos/6.mp4" },
  { id: "v7",  title: "Sit Amet at Dawn",              src: "/videos/7.mp4" },
  { id: "v8",  title: "Consectetur Shores",            src: "/videos/8.mp4" },
  { id: "v9",  title: "Adipiscing Trails",             src: "/videos/9.mp4" },
  { id: "v10", title: "The Elit Meadow",               src: "/videos/10.mp4" },
  { id: "v11", title: "Tempor of the North",           src: "/videos/11.mp4" },
  { id: "v12", title: "Incididunt Falls",              src: "/videos/12.mp4" },
  { id: "v13", title: "Labore by the Lake",            src: "/videos/13.mp4" },
  { id: "v14", title: "Magna Horizons",                src: "/videos/14.mp4" },
  { id: "v15", title: "Aliqua Nights",                 src: "/videos/15.mp4" },
];
