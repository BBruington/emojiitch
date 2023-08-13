import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "npm/utils/api";
import { generateSSGHelper } from "npm/server/helpers/ssgHelper";


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const {data, isLoading} = api.profile.getUserByUsername.useQuery({username})

  if (isLoading) return <div>Loading...</div>

  if(!data) return <div>404</div>


  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>

      <main className="flex h-screen justify-center">
        <div>Here is some example text for profile view: {data.username}</div>
      </main>
    </>
  );
}


export const getStaticProps: GetStaticProps = async (context) => {

  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;