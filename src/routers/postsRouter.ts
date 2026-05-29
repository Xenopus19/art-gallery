import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc.ts";
import Post, { type PostType } from "../models/Post.ts";
import { Comment, Like, User } from "../models/index.ts";
import { sequelize } from "../utils/db.ts";
import { TRPCError } from "@trpc/server";
import type { CommentType } from "../models/Comment.ts";
import createPostSchema from "../schemas/createPost.ts";
import { Op } from "sequelize";

type CommentWithAuthor = CommentType & {
  author?: Pick<User, "id" | "username" | "avatarUrl">;
};

type SimplePost = PostType & {
  author?: Pick<User, "id" | "username" | "avatarUrl">;
};

type PostWithRelations = SimplePost & {
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
    .query(async ({ input }): Promise<SimplePost[]> => {
      const posts = await Post.findAll({
        where: { userId: input.userId },
        include: [
          {
            model: User,
            as: "author",
          },
        ],
        order: [["id", "DESC"]],
      });

      return posts.map((postInstance) => {
        const plain = postInstance.get({ plain: true }) as PostType & {
          author?: User;
        };

        return {
          ...plain,
          author: plain.author
            ? {
                id: plain.author.id,
                username: plain.author.username,
                avatarUrl: plain.author.avatarUrl,
              }
            : null,
        } as SimplePost;
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong on the server",
          cause: error,
        });
      }
    }),

  commentPost: protectedProcedure
    .input(z.object({ text: z.string(), postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await Comment.create({
        postId: input.postId,
        userId: ctx.user.id,
        text: input.text,
      });
    }),

  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await Post.create({ ...input, userId: ctx.user.id });
        return post.get({ plain: true });
      } catch {
        throw new TRPCError({
          message: "Error creating new post",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getInfinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(5).max(100).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      const posts = await Post.findAll({
        where: cursor ? { id: { [Op.lt]: cursor } } : {},
        order: [["id", "DESC"]],
        limit: limit + 1,
        include: {
          model: User,
          as: "author",
          attributes: ["id", "username", "avatarUrl"],
        },
      });

      let newCursor: string | undefined = undefined;

      if (posts.length > limit) {
        newCursor = posts.pop()?.id;
      }

      const simplePosts = posts.map((postInstance) =>
        postInstance.get({ plain: true }),
      ) as SimplePost[];

      return {
        posts: simplePosts,
        newCursor,
      };
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await Post.findByPk(input.postId, {
          include: {
            model: User,
            as: "author",
            attributes: ["id"],
          },
        });
        if (!post) {
          throw new TRPCError({
            message: "Post is absent",
            code: "NOT_FOUND",
          });
        }
        const isPostOwner = post.author?.id === ctx.user.id;

        if (!isPostOwner) {
          throw new TRPCError({
            message: "User is not permitted to delete the post",
            code: "FORBIDDEN",
          });
        }
        await post.destroy();
        return {
          message: "Post successfully deleted.",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          message: "Error deleting post",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getPostsLikedByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const likesWithPosts = await Like.findAll({
      where: {
        userId,
      },
      include: {
        model: Post,
        as: "post",
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "avatarUrl"],
          },
        ],
        order: [["id", "DESC"]],
      },
    });

    const posts = likesWithPosts.map(like => like.post.get({plain: true}) as SimplePost);

    return posts;
  }),
});

export default postsRouter;
