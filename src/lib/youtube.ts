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
 *  on a single video. */
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
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
