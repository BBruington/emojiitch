import Head from "next/head";


export default function SinglePostPage() {

  return (
    <>
      <Head>
        <title>Post</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
          <div>Here is some example text for individual post view</div>
      </main>
    </>
  );
}