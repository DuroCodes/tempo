import Link from "next/link";
import { FaChartLine, FaCrown, FaMusic, FaSignOutAlt } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { Avatar, AvatarImage } from "./avatar";
import { signOut, useSession } from "next-auth/react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import type { Session } from "next-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";

function AvatarButton({ session }: { session: Session }) {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Avatar className="border-2 border-primary">
            <AvatarImage src={session.user.image!} alt="Profile Picture" />
            <AvatarFallback>{session.user.name![0]}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{session.user.name}</h4>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <Separator />
            <div className="grid gap-2 font-medium text-zinc-50">
              <Link
                href="/stats"
                className="flex items-center gap-2 hover:text-zinc-300"
              >
                <FaChartLine />
                Stats
              </Link>
              <Link
                href="/discover"
                className="flex items-center gap-2 hover:text-zinc-300"
              >
                <IoSparkles />
                Discover
              </Link>
              <Link
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <FaCrown />
                Premium
              </Link>
              <Separator />
              <Button onClick={() => signOut()} className="gap-2">
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default function Navbar() {
  const { data: sessionData } = useSession();

  return (
    <div className="w-full bg-background">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link
          className="flex items-center space-x-2 text-zinc-50 hover:text-zinc-100"
          href="/"
        >
          <FaMusic />
          <span className="font-bold">Tempo</span>
        </Link>
        {sessionData && <AvatarButton session={sessionData} />}
      </div>
    </div>
  );
}
