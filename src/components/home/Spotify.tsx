import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { getSpotifyTrack } from "@/lib/spotify";

export function SpotifySkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
        <Image src="/assets/spotify.svg" alt="" width={16} height={16} className="shrink-0 opacity-70" />
        <Skeleton className="h-4 w-28 shrink-0" />
        <span className="shrink-0 text-muted-foreground"> — </span>
        <Skeleton className="h-4 min-w-[120px] flex-1 max-w-[200px]" />
      </div>
    </div>
  );
}

/** Server component: "Now playing" / "Last played" line under the hero. */
export async function Spotify() {
  const track = await getSpotifyTrack();
  if (!track) return null;

  return (
    <div className="flex items-center gap-3">
      <p className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground">
        <Image src="/assets/spotify.svg" alt="" width={16} height={16} className="shrink-0" />
        <span className="shrink-0 font-medium text-secondary">
          {track.isPlaying ? "Now playing" : "Last played"}
        </span>
        <span className="shrink-0"> — </span>
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden text-secondary underline-offset-2 hover:underline"
        >
          <span className="shrink-0">{track.title}</span>
          <span className="shrink-0"> · </span>
          <span className="min-w-0 truncate">{track.artists}</span>
        </a>
      </p>
    </div>
  );
}
