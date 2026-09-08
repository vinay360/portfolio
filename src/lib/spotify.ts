import "server-only";

export type SpotifyTrack = {
  title: string;
  artists: string;
  url: string;
  isPlaying: boolean;
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token as string;
}

type SpotifyItem = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
};

/**
 * Returns the currently playing track, or the most recently played one.
 * Resolves to null when Spotify credentials are not configured.
 */
export async function getSpotifyTrack(): Promise<SpotifyTrack | null> {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    const headers = { Authorization: `Bearer ${token}` };

    const now = await fetch(NOW_PLAYING_URL, { headers, cache: "no-store" });
    if (now.status === 200) {
      const data = await now.json();
      const item = data?.item as SpotifyItem | undefined;
      if (item && data.is_playing) {
        return {
          title: item.name,
          artists: item.artists.map((a) => a.name).join(", "),
          url: item.external_urls.spotify,
          isPlaying: true,
        };
      }
    }

    const recent = await fetch(RECENTLY_PLAYED_URL, { headers, cache: "no-store" });
    if (!recent.ok) return null;
    const data = await recent.json();
    const item = data?.items?.[0]?.track as SpotifyItem | undefined;
    if (!item) return null;
    return {
      title: item.name,
      artists: item.artists.map((a) => a.name).join(", "),
      url: item.external_urls.spotify,
      isPlaying: false,
    };
  } catch {
    return null;
  }
}
