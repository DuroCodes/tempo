import { z } from "zod";
import { Ok, Err } from "./result";

export type SpotifyImage = z.infer<typeof ImageSchema>;
export const ImageSchema = z.object({
  url: z.string(),
});

export type SpotifyArtist = z.infer<typeof ArtistSchema>;
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),
});

export type SpotifyAlbum = z.infer<typeof AlbumSchema>;
export const AlbumSchema = z.object({
  images: z.array(ImageSchema),
  name: z.string(),
  uri: z.string(),
});

export type SpotifyTrack = z.infer<typeof TrackSchema>;
export const TrackSchema = z.object({
  album: AlbumSchema,
  artists: z.array(ArtistSchema),
  id: z.string(),
  name: z.string(),
  uri: z.string(),
});

export type ListeningHistory = z.infer<typeof ListeningHistorySchema>;
export const ListeningHistorySchema = z.object({
  items: z.array(z.object({ track: TrackSchema })),
});

export type TopTracks = z.infer<typeof TopTracksSchema>;
export const TopTracksSchema = z.object({
  items: z.array(TrackSchema),
});

export type Recommendations = z.infer<typeof RecommendationsSchema>;
export const RecommendationsSchema = z.object({
  tracks: z.array(TrackSchema),
});

export const uriToUrl = (uri: string) => {
  const [, type, id] = uri.split(":");
  return `https://open.spotify.com/${type}/${id}`;
};

const zodFetch = async <TSchema extends z.Schema>(
  schema: TSchema,
  error: string,
  ...args: Parameters<typeof fetch>
) => {
  const res = await fetch(...args);

  if (!res.ok) {
    console.error(await res.text());
    return Err(error);
  }

  const json = (await res.json()) as unknown;
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    console.error(
      parsed.error.issues.map((i) => `${i.code} | ${i.message}`).join("\n"),
    );
    return Err(error);
  }

  return Ok(json as z.infer<TSchema>);
};

const filterDuplicates = <T>(arr: T[], discriminator: (item: T) => unknown) => {
  const unique = new Set();

  return arr.filter((i) => {
    const key = discriminator(i);
    if (!unique.has(key)) {
      unique.add(key);
      return true;
    }

    return false;
  });
};

const headers = (token: { accessToken: string }) => ({
  Authorization: `Bearer ${token.accessToken}`,
});

export const listeningHistory = (token: { accessToken: string }) =>
  zodFetch(
    ListeningHistorySchema,
    "Failed to fetch listening history",
    "https://api.spotify.com/v1/me/player/recently-played",
    { headers: headers(token) },
  );

export const topTracks = async (token: { accessToken: string }) =>
  zodFetch(
    TopTracksSchema,
    "Failed to fetch top tracks",
    "https://api.spotify.com/v1/me/top/tracks",
    { headers: headers(token) },
  );

export const topArtists = (tracks: SpotifyTrack[]) => [
  ...new Set(tracks.flatMap((t) => t.artists)),
];

export const topGenres = async (
  token: { accessToken: string },
  artists: SpotifyArtist[],
) => {
  const genres = new Set<string>();
  for (const artist of artists) {
    const data = await zodFetch(
      z.object({ genres: z.array(z.string()) }),
      "Failed to fetch top genres",
      `https://api.spotify.com/v1/artists/${artist.id}`,
      { headers: headers(token) },
    );

    if (!data.ok) continue;
    data.value.genres.forEach((g) => genres.add(g));
  }

  return [...genres];
};

export const recommendations = async (
  token: { accessToken: string },
  tracks: SpotifyTrack[],
  artists: SpotifyArtist[],
) => {
  const seedData = {
    artists: artists
      .slice(0, 2)
      .map((a) => a.id)
      .join(","),
    tracks: tracks
      .slice(0, 3)
      .map((t) => t.id)
      .join(","),
  };

  return zodFetch(
    RecommendationsSchema,
    "Failed to fetch recommendations",
    `https://api.spotify.com/v1/recommendations?seed_artists=${seedData.artists}&seed_tracks=${seedData.tracks}`,
    { headers: headers(token) },
  );
};

export const getSpotifyData = async (token: { accessToken: string }) => {
  const history = await listeningHistory(token);
  if (!history.ok) return Err(history.error);

  const tracks = await topTracks(token);
  if (!tracks.ok) return Err(tracks.error);

  const artists = filterDuplicates(topArtists(tracks.value.items), (a) => a.id);
  const genres = await topGenres(token, artists);

  const recommend = await recommendations(token, tracks.value.items, artists);
  if (!recommend.ok) return Err(recommend.error);

  return Ok({
    listeningHistory: filterDuplicates(
      history.value.items.map((i) => i.track),
      (t) => t.id,
    ),
    topTracks: tracks.value.items,
    topArtists: artists,
    topGenres: genres,
    recommendations: recommend.value,
  });
};
