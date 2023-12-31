import { LoadingPage, LoadingSpinner } from "npm/components/loading";
import Head from "next/head";
import { api } from "npm/utils/api";
import { 
  SignInButton,
  useUser
  } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "npm/components/layout";
import { PostView } from "npm/components/postview";

  const CreatePostWizard = () => {

    //gets logged in user info and gets their profile image and ability to post
    //as their header

    const {user} = useUser();

    const [input, setInput] = useState('')

    const ctx = api.useContext();

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");

        //void tells typescript that even though i know this is a promise, in this particular context
        //it's ok to not use async / await and to ignore it
        void ctx.posts.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;

        if ( errorMessage![0] && errorMessage) {
          toast.error(errorMessage[0])
        } else {
          toast.error("Failed to post! Please try again later.");
        }
      }
    });
    
    if(!user) return null;
    
    return (
      <div className="flex w-full gap-3">
        <Image 
          src={user.profileImageUrl} 
          alt={`profile picture`} 
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
        />
        <input 
          placeholder="Type some emojis!" 
          className="bg-transparent grow outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              e.preventDefault();
              if(input !== "") {
                mutate({ content: input });
              }
            }
          }}
          disabled={isPosting}
        />
        { input !== "" && !isPosting && (
          <button disabled={isPosting} onClick={() => mutate({ content: input })}>
            Post
          </button>
        )}

        { isPosting && (
        <div className="flex justify-center items-center">
          <LoadingSpinner size={20} /> 
        </div>
        )}
      </div>
    )
  };

  const Feed = () => {

    //generates all of the posts onto the page as feed

    //1st time fetching feed data and react query allows me to quickly fetch it again later on
    //if needed using old cache
    const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

    if (postsLoading) return <LoadingPage />;

    if(!data) return <div>Something went wrong</div>

    return (
      <div>
        {[...data]?.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
          ))}
      </div>
    )
  }

export default function Home() {

  
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  //since i've already fetched this data earlier, react query can use the cached data to quickly
  //fetch it again w/o the const
  //api.posts.getAll.useQuery()

  // user loads really fast so while both posts AND user are loading make the page empty instead 
  //of using a loading page
  if(!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>Emojiitch</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="border-b border-slate-400 p-4">
          {!isSignedIn && 
          <div className="flex justify-center">
            <SignInButton />
          </div>}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
}

