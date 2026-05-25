import { router, publicProcedure} from "../utils/trpc.ts";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getUploadUrl } from "../utils/s3.ts";


const imageRouter = router({
  getImageUploadUrl: publicProcedure
    .input(
      z.object({
        fileName: z.string().max(200),
        fileType: z.string().max(200),
      }),
    )
    .mutation(async ({ input }) => {
      const uniqueKey = `${uuidv4()}-${input.fileName.replace(/\s+/g, "_")}`;
      const url = await getUploadUrl(uniqueKey, input.fileType);
      console.log(url);
      console.log(uniqueKey);
      return { url, key: uniqueKey };
    }),
});

export default imageRouter;
