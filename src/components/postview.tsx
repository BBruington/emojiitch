import { RouterOutputs } from "npm/utils/api";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {

  const { post, author} = props;

  return (
    <div key={post.id} className="flex p-4 border-b border-slate-400 gap-3">
      <Image 
        alt={`${author.username}'s profile picture`} 
        src={author.profileImageUrl} 
        className="h-14 w-14 rounded-full" 
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`} </span> 
          </Link>
            &nbsp; - &nbsp; 
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span></div>
    </div>
  )
}