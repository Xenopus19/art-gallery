import { TRPCError } from "@trpc/server";
import User from "../models/User.ts";
import { router, publicProcedure } from "../utils/trpc.ts";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import createUserSchema from "../schemas/createUser.ts";
import bcrypt from "bcrypt";
import { getUploadUrl } from "../utils/s3.ts";

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
      return user;
    }),

  getAllUsers: publicProcedure.query(async () => {
    return await User.findAll();
  }),

  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const hashedPassword: string = await bcrypt.hash(input.password, 10);
      const { password: _, ...userData } = input;
      const newUser = await User.create({
        ...userData,
        passwordHash: hashedPassword,
      });
      return newUser;
    }),

  getImageUploadUrl: publicProcedure.input(z.object({
    fileName: z.string().max(200),
    fileType: z.string().max(200)
  })).mutation(async ({input}) => {
    const uniqueKey = `${uuidv4()}-${input.fileName.replace(/\s+/g, '_')}`;
    const url = await getUploadUrl(uniqueKey, input.fileType);
    console.log(url)
    console.log(uniqueKey)
    return {url, key: uniqueKey}
  }),

  //changeUserDescription: publicProcedure.input(createUserSchema.pick({ description: true })).mutation(async () => {

  //})
});

export default userRouter;
