import { type Session } from "next-auth";
import type { AppProps } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'
import { type AppType } from "next/app";
import { api } from "npm/utils/api";
import "npm/styles/globals.css";

//used to implement react notifications https://react-hot-toast.com
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { ...pageProps },
}: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center"/>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
