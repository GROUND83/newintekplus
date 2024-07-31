"use server";

import { UploadFile } from "@/lib/fileUploader";
import Notice from "@/models/notice";
import NoticeContent from "@/models/noticeContent";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function detailGroupNotice(noticeId: string) {
  //

  try {
    const notice = await Notice.findOne({ _id: noticeId }).populate({
      path: "contents",
      model: NoticeContent,
    });

    //

    return { data: JSON.stringify(notice) };
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}

export async function updateGroupNotice(formData: FormData) {
  //
  const noticeId = formData.get("noticeId") as string;
  const useremail = formData.get("user") as string;
  const groupId = formData.get("groupId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sendTo = formData.get("sendTo") as string;
  const contents = formData.get("contents") as string;
  const contentsArray = JSON.parse(contents);

  try {
    const notice = await Notice.findOneAndUpdate(
      { _id: noticeId },
      {
        groupId: groupId,
        title,
        description,
        sendTo,
      }
    );

    //
    if (contentsArray.length > 0) {
      let newContentsArray = [];
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
            newContentsArray.push(noticeContentdata);
          }
        } else {
          let newdata = {
            ...contentsArray[index],
          };
          delete newdata.file;
          //
          newContentsArray.push(newdata);
        }
      }
      await Notice.findOneAndUpdate(
        {
          _id: notice._id,
        },
        {
          $set: {
            contents: newContentsArray,
          },
        },
        { upsert: true }
      );
    }
    return { data: JSON.stringify(notice) };
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}
export async function deleteGroupNotice(noticeId: string) {
  //

  try {
    let notice = await Notice.deleteOne({
      _id: noticeId,
    });
    return { data: JSON.stringify(notice) };
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}
