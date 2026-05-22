import { hasLikedProcedure, router } from "../utils/trpc.ts";
import { TRPCError } from "@trpc/server";

import Like from "../models/Like.ts";

const likeRouter = router({
  hasLiked: hasLikedProcedure.query(async ({ ctx }) => {
    try {
      return ctx.hasLiked;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occured",
        });
      }
    }
  }),

  toggleLike: hasLikedProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.hasLiked) {
      await Like.destroy({
        where: { postId: input.postId, userId: ctx.user.id },
      });
      return;
    }
    await Like.create({ userId: ctx.user.id, postId: input.postId });
    return;
  }),
});

export default likeRouter;
