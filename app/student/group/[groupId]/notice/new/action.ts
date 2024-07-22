"use server";

import { UploadFile } from "@/lib/fileUploader";
import Notice from "@/models/notice";
import NoticeContent from "@/models/noticeContent";
import User from "@/models/user";

import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function createGroupNotice(formData: FormData) {
  //
  const useremail = formData.get("user") as string;
  const groupId = formData.get("groupId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sendTo = formData.get("sendTo") as string;
  const contents = formData.get("contents") as string;
  const contentsArray = JSON.parse(contents);
  const user = await User.findOne({ email: useremail });
  console.log("user", user);
  try {
    const notice = await Notice.create({
      groupId: groupId,
      title,
      description,
      sendTo,
      admin: user,
    });

    //
    if (contentsArray.length > 0) {
      for (const index in contentsArray) {
        if (contentsArray[index].file) {
          //
          const contentFile = formData.get(`contents_${index}`) as File;
          console.log("contents_", contentFile);
          let contentFileFormData = new FormData();
          contentFileFormData.append("file", contentFile);
          contentFileFormData.append("folderName", "groupNotice");
          const upload = await UploadFile(contentFileFormData);
          console.log("uplaod", upload);
          if (upload) {
            let { location } = upload as UploadResponse;
            //
            let contenFileName = Buffer.from(
              contentFile.name,
              "latin1"
            ).toString("utf8");
            console.log("contenFileName", contenFileName);
            let noticeContentdata = await NoticeContent.create({
              groupId: groupId,
              contentdownloadURL: location,
              contentName: contenFileName,
              contentSize: contentFile.size,
            });
            console.log("noticeContentdata", noticeContentdata);
            await Notice.findOneAndUpdate(
              {
                _id: notice._id,
              },
              {
                $push: {
                  contents: noticeContentdata,
                },
              },
              { upsert: true }
            );
          }
        } else {
          //
        }
      }
    }
    return { data: JSON.stringify(notice) };
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}
