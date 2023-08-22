import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "npm/utils/api";
import { generateSSGHelper } from "npm/server/helpers/ssgHelper";
import { PageLayout } from "npm/components/layout";
import Image from "next/image";


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const {data, isLoading} = api.profile.getUserByUsername.useQuery({username})

  if (isLoading) return <div>Loading...</div>

  if(!data) return <div>404</div>


  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>

      <PageLayout>
        <div className="h-48 bg-slate-600 relative">
          <Image 
            src={data.profileImageUrl} 
            alt={`${data.username ?? ""}'s profile pic`} 
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        
        <div>Here is some example text for profile view: {data.username}</div>
      </PageLayout>
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