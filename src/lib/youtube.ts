/** Extracts the video ID from any YouTube URL shape (watch?v=, youtu.be,
 *  shorts/, embed/) so CMS fields can accept whatever the editor pastes. */
export function youtubeIdFrom(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

/** Standard embeddable player URL (used for the product-page video tab). */
export function youtubeEmbedUrl(url: string): string | null {
  const id = youtubeIdFrom(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Autoplaying, muted, looping, chrome-free embed URL for background-video
 *  hero sections. `playlist=<id>` is required by YouTube for `loop` to work
 *  on a single video. Kept as a fallback src for the plain-iframe case —
 *  the primary autoplay path is now the IFrame API driven one below, since
 *  relying on the `autoplay=1` URL param alone is unreliable in several
 *  browsers (notably Safari/iOS, and Chrome once any extension or embed
 *  blocker is present) even when the iframe carries allow="autoplay". */
export function youtubeBackgroundEmbedUrl(url: string): string | null {
  const id = youtubeIdFrom(url);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
    disablekb: "1",
    enablejsapi: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

// ── YouTube IFrame Player API loader ────────────────────────────────────
// The URL-param-only approach (`autoplay=1&mute=1`) silently fails to
// autoplay in a meaningful number of real-world cases — most notably
// Safari/iOS, and any browser where the very first paint hasn't yet
// registered as a "user gesture" for the page. Explicitly calling
// `player.mute()` + `player.playVideo()` from the API, once the player
// reports itself ready, is Google's own documented workaround and is far
// more reliable. This loads the API script once (shared across the page)
// and resolves when it's ready to construct players.
let ytApiPromise: Promise<void> | null = null;

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: { target: YTPlayerInstance }) => void;
            onStateChange?: (e: { data: number; target: YTPlayerInstance }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState?: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerInstance {
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}
