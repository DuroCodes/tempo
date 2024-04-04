import "~/styles/globals.css";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import Navbar from "~/components/ui/navbar";
import { api } from "~/utils/api";

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
