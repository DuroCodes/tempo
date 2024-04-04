import Link from "next/link";
import { FaGithub, FaSpotify } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, buttonVariants } from "~/components/ui/button";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <div className="relative overflow-hidden py-24 lg:py-32">
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
                Tempo
              </h1>
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-xl text-muted-foreground">
                Analyze your Spotify listening habits and discover new music
                based on what you love.
              </p>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <Button
                size={"lg"}
                onClick={
                  sessionData ? () => signOut() : () => signIn("spotify")
                }
                className="gap-2"
              >
                <FaSpotify />
                {sessionData ? "Log Out" : "Login with Spotify"}
              </Button>
              <Link
                className={`${buttonVariants({ variant: "outline", size: "lg" })} gap-2`}
                href="https://github.com/durocodes/tempo"
              >
                <FaGithub />
                Source Code
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
