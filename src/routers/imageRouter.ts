import { router, publicProcedure} from "../utils/trpc.js";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getUploadUrl } from "../utils/s3.js";


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
      return { url, key: uniqueKey };
    }),
});

export default imageRouter;
