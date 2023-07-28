import { type Session } from "next-auth";
import type { AppProps } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "npm/utils/api";
import "npm/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      {/* <SessionProvider session={session}> */}
        <Component {...pageProps} />
      {/* </SessionProvider> */}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
