import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { TrackCarousel } from "./stats";

export default function Discover() {
  const { data: sessionData } = useSession();
  const spotify = sessionData!.user.spotify;

  if (!spotify.ok) {
    return (
      <div>
        <h1>Spotify data not found. Please clear your cache and try again</h1>
      </div>
    );
  }

  return (
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
                Discover
              </h1>
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-xl text-muted-foreground">
                Find new music based on what you actually like.
              </p>
            </div>
          </div>
        </div>
      </div>
      <h2 className="mx-4 text-3xl font-extrabold tracking-tight">
        Song Recommendations
      </h2>
      <p className="text-md mx-4 mb-4 text-muted-foreground">
        Based on your listening habits, here are some tracks you might like.
      </p>
      <div className="mb-6 flex items-center justify-center">
        <TrackCarousel tracks={spotify.value.recommendations.tracks} />
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
