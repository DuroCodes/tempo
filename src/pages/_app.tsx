import "~/styles/globals.css";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import Navbar from "~/components/ui/navbar";
import { api } from "~/utils/api";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Head>
        <title>Tempo</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Analyze and discover music you enjoy."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tempo" />
        <meta
          property="og:description"
          content="Analyze and discover music you enjoy."
        />
        <meta property="og:image" content="/banner.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="/banner.png" />
      </Head>
      <SessionProvider session={session}>
        <main className={`font-sans ${inter.variable}`}>
          <Navbar />
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
