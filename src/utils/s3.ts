import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } from "./config.ts";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const getUploadUrl = async (fileName: string, fileType: string) => {
  const command = new PutObjectCommand({
    Bucket: "my-bucket-name",
    Key: fileName,
    ContentType: fileType,
  });


  return await getSignedUrl(s3, command, { expiresIn: 60 });
};