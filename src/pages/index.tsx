import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "npm/utils/api";
import { SignIn,
  SignInButton,
  SignOutButton,
  useUser
  } from "@clerk/nextjs";

  const CreatePostWizard = () => {
    const {user} = useUser();

    if(!user) return null;

    console.log(user)

    return (
      <div className="flex w-full gap-3">
        <img 
        src={user.profileImageUrl} 
        alt="Profile Image" 
        className="h-14 w-14 rounded-full"
        />
        <input 
        placeholder="Type some emojis!" 
        className="bg-transparent grow outline-none"/>
      </div>
    )
  };

  type PostWithUser = RouterOutputs["posts"]["getAll"][number];

  const PostView = (props: PostWithUser) => { 

    const {post, author} = props;

    return (
      <div key={post.id} className="p-8 border-b border-slate-400">
        <img src={author.profileImageUrl} />
        {post.content}
      </div>
    )
  }

export default function Home() {
  
  const user = useUser();

  const {data, isLoading} = api.posts.getAll.useQuery()

  if(!data || isLoading) return <div>Loading...</div>

  if(!data) return <div>Something went wrong</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && 
            <div className="flex justify-center">
              <SignInButton />
            </div>}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div>
            {[...data, ...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
              ))}
          </div>
        </div>
        {/* <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /> */}
      </main>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
