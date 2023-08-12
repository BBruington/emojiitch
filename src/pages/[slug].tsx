import Head from "next/head";
import { api } from "npm/utils/api";


export default function ProfilePage() {

  const {data, isLoading} = api.profile.getUserByUsername.useQuery({username: "bbruington"})

  if (isLoading) return <div>Loading...</div>

  if(!data) return <div>404</div>


  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <main className="flex h-screen justify-center">
        <div>Here is some example text for profile view: {data.username}</div>
      </main>
    </>
  );
}