import { TRPCError } from "@trpc/server";
import User from "../models/User.js";
import { router, publicProcedure, protectedProcedure } from "../utils/trpc.js";
import { z } from "zod";
import createUserSchema from "../schemas/createUser.js";
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";

const userRouter = router({
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const user = await User.findByPk(input.id);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with ID ${input.id} not found`,
        });
      }
      return user.get({ plain: true });
    }),

  getAllUsers: publicProcedure.query(async () => {
    return await User.findAll();
  }),

  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        const hashedPassword: string = await bcrypt.hash(input.password, 10);
        const { password: _password, ...userData } = input;
        const newUser = await User.create({
          ...userData,
          passwordHash: hashedPassword,
        });
        return newUser.get({ plain: true });
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          const message =
            error.errors[0]?.message || "User with this name already exists.";
          throw new TRPCError({ message: message, code: "CONFLICT" });
        } else {
          throw new TRPCError({
            message: "Error creating user.",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  changeUserDescription: protectedProcedure
    .input(createUserSchema.pick({ description: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [, updatedUser] = await User.update(
          {
            description: input.description,
          },
          {
            where: {
              id: ctx.user.id,
            },
            returning: true
          },
        );

         const userInDb = updatedUser[0];

        if (!userInDb) {
          throw new TRPCError({
            message: "User is absent from database.",
            code: "NOT_FOUND",
          });
        }

        return userInDb.get({ plain: true });
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong on the server",
        });
      }
    }),
});

export default userRouter;
