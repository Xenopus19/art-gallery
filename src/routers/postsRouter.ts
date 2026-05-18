import z from "zod";
import { publicProcedure, router } from "../utils/trpc.ts";
import Post from "../models/Post.ts";
import { Like, User } from "../models/index.ts";
import type { UserType } from "../models/User.ts";
import { sequelize } from "../utils/db.ts";

type PostWithAuthor = Post & { author: UserType };

const postsRouter = router({
  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
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
            attributes: ["id", "username", "avatarUrl"],
          },
        ],
      });

      return posts.map((p) => {
        const authorInstance = p.author;
        const likes = p.likesCount;

        const plainPost = p.get({ plain: true });

        return {
          id: plainPost.id,
          title: plainPost.title,
          description: plainPost.description,
          imageUrl: plainPost.imageUrl,
          userId: plainPost.userId,
          likesCount: Number(likes || 0),

          author: authorInstance ? authorInstance.get({ plain: true }) : null,
        };
      });
    }),
});

export default postsRouter;
