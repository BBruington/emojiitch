import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "npm/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "npm/server/helpers/filterUserForClient";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Post } from "@prisma/client";

const addUsersDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
    userId: userId,
    limit:110,
  })).map(filterUserForClient)

  return posts.map(post => {

    const author = users.find((user) => user.id === post.authorId);

    if(!author?.username || !author) throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Author for post not found",
    })

    return {
      post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
}
 
// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
});

export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {

    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return addUsersDataToPosts(posts);
  }),

  getPostsByUserId: publicProcedure.input(z.object({
    userId: z.string(),
  })).query(({ctx, input}) => ctx.prisma.post.findMany({
      where: {
        authorId: input.userId,
      },
      take: 100,
      orderBy: [{ createdAt: "desc"}],
    }).then(addUsersDataToPosts)
  ),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed").min(1).max(280),
      })
    )
    .mutation(async ({ctx, input}) => {

      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"})

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;

    }),

});
