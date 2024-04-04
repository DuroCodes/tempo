import Link from "next/link";
import Image from "next/image";
import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { Card, CardHeader } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { type SpotifyTrack, uriToUrl } from "~/utils/spotify";
import { buttonVariants } from "~/components/ui/button";

function GenreShowcase({ genres }: { genres: string[] }) {
  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="grid w-11/12 grid-cols-2 gap-2 md:grid-cols-4">
        {genres.map((genre) => (
          <Link
            href={`https://open.spotify.com/search/${genre.replace(/ /g, "%20")}`}
            className={buttonVariants({ variant: "secondary" })}
            key={genre}
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TrackCarousel({ tracks }: { tracks: SpotifyTrack[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-3/4 md:w-11/12"
    >
      <CarouselContent>
        {tracks.map((track) => (
          <CarouselItem key={track.id} className="basis-1/2 lg:basis-1/5">
            <div className="h-full">
              <TrackCard track={track} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function TrackCard({ track }: { track: SpotifyTrack }) {
  return (
    <Card className="flex h-full flex-col hover:bg-card/60">
      <CardHeader>
        <Link href={uriToUrl(track.uri)}>
          <div className="relative h-0" style={{ paddingBottom: "100%" }}>
            <Image
              src={track.album.images[0]!.url}
              alt={track.name}
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
              fill={true}
            />
          </div>
          <div className="mt-2">
            <h3 className="font-semibold">{track.name}</h3>
            <p className="text-sm text-muted-foreground">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </Link>
      </CardHeader>
    </Card>
  );
}

export default function Stats() {
  const { data: session } = useSession();
  const spotify = session!.user.spotify;

  if (!spotify.ok) {
    return (
      <div>
        <h1>Spotify data not found. Please clear your cache and try again</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden py-24">
        <div
          aria-hidden="true"
          className="absolute -top-96 start-1/2 flex -translate-x-1/2 transform"
        >
          <div className="h-[44rem] w-[25rem] -translate-x-[10rem] rotate-[-60deg] transform bg-gradient-to-r from-background/50 to-background blur-3xl" />
          <div className="h-[50rem] w-[90rem] origin-top-left -translate-x-[15rem] -rotate-12 rounded-full bg-gradient-to-tl from-primary-foreground via-primary-foreground to-background blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mt-5 max-w-2xl">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Your Stats
                </h1>
              </div>
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-muted-foreground">
                  Your recent listening habits and top tracks over the past 6
                  months.
                </p>
              </div>
            </div>
          </div>
        </div>
        <h2 className="mx-4 text-3xl font-extrabold tracking-tight">
          Top Genres
        </h2>
        <p className="text-md mx-4 mb-4 text-muted-foreground">
          Your top genres from the past 6 months.
        </p>
        <GenreShowcase genres={spotify.value.topGenres} />
        <h2 className="mx-4 text-3xl font-extrabold tracking-tight">
          Top Tracks
        </h2>
        <p className="text-md mx-4 mb-4 text-muted-foreground">
          Your top tracks from the past 6 months.
        </p>
        <div className="mb-6 flex items-center justify-center">
          <TrackCarousel tracks={spotify.value.topTracks} />
        </div>
        <h2 className="mx-4 text-3xl font-extrabold tracking-tight">
          Recent Tracks
        </h2>
        <p className="text-md mx-4 mb-4 text-muted-foreground">
          Your most recent listening history.
        </p>
        <div className="flex items-center justify-center">
          <TrackCarousel tracks={spotify.value.listeningHistory} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  console.log(session);

  if (!session?.user.spotify.ok) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
