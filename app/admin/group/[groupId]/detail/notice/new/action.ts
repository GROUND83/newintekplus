"use server";

import { auth } from "@/auth";

import groupNotiveTemplate from "@/lib/mailtemplate/groupNoticeTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import Notice from "@/models/notice";
import NoticeContent from "@/models/noticeContent";
import User from "@/models/user";
import { revalidatePath } from "next/cache";

export async function createGroupNotice(formData: FormData) {
  //
  let session = await auth();
  let admin = await User.findOne({
    email: session.user.email,
  });
  const data = formData.get("data") as string;
  const newEmail = formData.get("newEmail") as string;
  const { groupId, title, description, sendTo, mail } = JSON.parse(data);

  const newContent = formData.get("newContent") as string;

  try {
    const notice = await Notice.create({
      groupId: groupId,
      title,
      description,
      sendTo,
      admin: admin,
      mail,
    });
    if (newContent) {
      const contentsArray = JSON.parse(newContent);
      if (contentsArray.length > 0) {
        for (const index in contentsArray) {
          //
          let noticeContentdata = await NoticeContent.create({
            groupId: groupId,
            contentdownloadURL: contentsArray[index].contentdownloadURL,
            contentName: contentsArray[index].contentName,
            contentSize: contentsArray[index].contentSize,
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
      }
    }
    console.log("mail", mail);
    if (mail) {
      let senderData = JSON.parse(newEmail);
      console.log("senderData", senderData);
      if (senderData.length > 0) {
        //
        let attachments = [];
        let noticeData = await Notice.findOne({ _id: notice._id }).populate({
          path: "contents",
          model: NoticeContent,
        });
        for (const content of noticeData.contents) {
          attachments.push({
            filename: content.contentName, // the file name
            path: encodeURI(content.contentdownloadURL), // link your file
            contentType: content.type,
            // contentType: file.type, //type of file
          });
        }
        let to = senderData;
        const mailData: any = {
          to: to,
          subject: title,
          from: "noreply@saloncanvas.kr",
          html: groupNotiveTemplate({
            title: title,
            description: description,
          }),
          attachments: attachments,
        };
        let res = await sendMail(mailData);
        console.log("res", res);
        revalidatePath(`/admin/group/${groupId}/detail/notice`);
      }
    }
    //
    return { data: JSON.stringify(notice) };
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}
