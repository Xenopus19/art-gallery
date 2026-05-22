import z, { includes } from "zod";
import { publicProcedure, router } from "../utils/trpc.ts";
import Post, { type PostType } from "../models/Post.ts";
import { Comment, Like, User } from "../models/index.ts";
import { sequelize } from "../utils/db.ts";
import { TRPCError } from "@trpc/server";
import type { CommentType } from "../models/Comment.ts";

type CommentWithAuthor = CommentType & {
  author?: Pick<User, "id" | "username" | "avatarUrl">;
};

type PostWithRelations = PostType & {
  author?: Pick<User, "id" | "username" | "avatarUrl">;
  comments?: CommentWithAuthor[];
  likesCount: number;
};

const postsRouter = router({
  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }): Promise<PostWithRelations[]> => {
      const posts = await Post.findAll({
        where: { userId: input.userId },
        attributes: {
          include: [
            [
              sequelize.literal(`(
            SELECT COUNT(*)
            FROM Likes AS likes
            WHERE likes.post_id = posts.id
          )`),
              "likesCount",
            ],
          ],
        },
        include: [
          {
            model: User,
            as: "author",
          },
        ],
      });

      return posts.map((postInstance) => {
        const plain = postInstance.get({ plain: true }) as any;

        return {
          ...plain,
          likesCount: Number(plain.likesCount ?? 0),
          author: plain.author
            ? {
                id: plain.author.id,
                username: plain.author.username,
                avatarUrl: plain.author.avatarUrl,
              }
            : null,
        } as PostWithRelations;
      });
    }),

  getPostById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }): Promise<PostWithRelations> => {
      try {
        const post = await Post.findByPk(input.postId, {
          attributes: {
          include: [
            [
              sequelize.literal(`(
            SELECT COUNT(*)
            FROM Likes AS likes
            WHERE likes.post_id = posts.id
          )`),
              "likesCount",
            ],
          ],
        },
          include: [
            {
              model: User,
              as: "author",
            },
            {
              model: Comment,
              as: "comments",
              attributes: ["id", "text", "createdAt"],
              include: [
                {
                  model: User,
                  as: "author",
                  attributes: ["id", "username", "avatarUrl"],
                },
              ],
              order: [["createdAt", "DESC"]],
            },
          ],
        });
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post with this Id is absent.",
          });
        }

        const result = post.get({ plain: true }) as PostWithRelations;

        return {
          ...result,
          likesCount: Number(result.likesCount ?? 0),
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong on the server",
          cause: error,
        });
      }
    }),
});

export default postsRouter;
