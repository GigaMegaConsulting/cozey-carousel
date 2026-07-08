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
