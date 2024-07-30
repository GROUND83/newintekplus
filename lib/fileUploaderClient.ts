import { s3Client } from "nodejs-s3-typescript";

//S3 Config
const s3Config = {
  bucketName: process.env.AWS_BUCKET_NAME as string,
  region: process.env.AWS_REGION as string,
  accessKeyId: process.env.AWS_ACCESS_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ID as string,
};

export const UploadFileClient = async ({
  folderName,
  file,
}: {
  folderName: string;
  file: File;
}) => {
  try {
    const s3 = new s3Client({
      ...s3Config,
      dirName: folderName,
    });
    const res = await s3.uploadFile(Buffer.from(await file.arrayBuffer()));
    return res;
  } catch (e) {
    return "file Upload failed";
  }
};
