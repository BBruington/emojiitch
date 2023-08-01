import { z } from "zod";
import type {User} from "@clerk/nextjs/api"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "npm/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";

const filterUserForClient = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    profileImageUrl: user.profileImageUrl, 
  }
 }

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit:100,
    })).map(filterUserForClient)

    console.log(users)

    return posts.map(post => ({
      post,
      author: users.find((user) => user.id === post.authorId),
    }))

  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
