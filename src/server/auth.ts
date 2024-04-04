import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "~/env";
import { getSpotifyData } from "~/utils/spotify";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      spotify: Awaited<ReturnType<typeof getSpotifyData>>;
    };
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (!token.accessToken)
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
          },
        };

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          spotify: await getSpotifyData(token as { accessToken: string }),
        },
      };
    },
    jwt: async ({ token, account, user }) => {
      if (user) token.id = user.id;
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email+user-read-recently-played+user-top-read",
    }),
  ],
  session: {
    maxAge: 60 * 60,
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
