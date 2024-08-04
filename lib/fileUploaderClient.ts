"use client";
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//S3 Config
const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;

console.log(
  " process.env.AWS_ACCESS_ID",
  process.env.NEXT_PUBLIC_AWS_ACCESS_ID
);
const s3Config = {
  bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID as string,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ID as string,
};

export const UploadFileClient = async ({
  folderName,
  file,
}: {
  folderName: string;
  file: File;
}) => {
  try {
    // const formData = await req.formData();
    // const files = formData.get("file") as File[];
    console.log("file", file);
    const s3 = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ID as string,
      },
    });
    let date = new Date().getTime();
    const encodedName = Buffer.from(file.name).toString("base64");
    const ext = file.type.split("/")[1];
    const key = `${folderName}/${date}/${file.name}`; // 경로(path)는 버킷이름!
    const uploadToS3 = new PutObjectCommand({
      Bucket: Bucket,
      Key: key,
      Body: file,
    });
    let res = await s3.send(uploadToS3);
    // const imgUrl = await getSignedUrl(
    //   s3,
    //   new GetObjectCommand({
    //     Bucket,
    //     Key: file.name,
    //   }),
    //   { expiresIn: 3600 } //만료시간
    // );

    console.log("res", res);
    if (res?.$metadata?.httpStatusCode === 200) {
      console.log("Success");
      return {
        location: `https://${Bucket}.s3.${
          process.env.NEXT_PUBLIC_AWS_REGION
        }.amazonaws.com/${folderName}/${date}/${encodeURIComponent(file.name)}`,
      };
    } else {
      return {
        error: true,
      };
    }
    // const res = await s3.uploadFile(Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    return {
      error: true,
    };
  }
};
