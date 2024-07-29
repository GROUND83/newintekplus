"use server";

import { auth } from "@/auth";
import { UploadFile } from "@/lib/fileUploader";
import feedbackTemplate from "@/lib/mailtemplate/feedbackTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonActivity from "@/models/lessonActivity";
import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import LessonPerform from "@/models/lessonPerform";
import LessonResult from "@/models/lessonResult";
import Notice from "@/models/notice";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function getLessonDetail({
  lessonId,
  groupId,
}: {
  groupId: string;
  lessonId: string;
}) {
  //
  let session = await auth();
  // console.log("lessonResult", lessonId, participantEmail);
  let onwer = await Participant.findOne({ email: session.user.email });
  let res = await Lesson.findOne({
    _id: lessonId,
  })
    .populate({ path: "lessonDirective", model: LessonDirective })
    .populate({ path: "lessonContents", model: LessonContent });

  let lessonResult = await LessonResult.findOne({
    lessonId: lessonId,
    groupId: groupId,
    onwer,
  })
    .populate({ path: "newPerform", model: LessonPerform })
    .populate({ path: "onwer", model: Participant })
    .populate({ path: "feedBack", model: FeedBack });
  // console.log("lessonResult", lessonId, lessonResult, participant);
  return {
    data: JSON.stringify(res),
    lessonResult: JSON.stringify(lessonResult),
  };
}
export async function updataLessonResultPointLive({
  lessonResultId,
  point,
}: {
  lessonResultId: string;
  point: number;
}) {
  //
  try {
    let lessonResult = await LessonResult.findOneAndUpdate(
      { _id: lessonResultId },
      {
        point: point,
        isPass: point > 0 ? "passed" : "failed",
        isEvaluationDone: true,
        isLessonDone: true,
      }
    );
    return { data: JSON.stringify(lessonResult) };
  } catch (e) {
    return { message: JSON.stringify(e) };
    //
  }
}
export async function updateLessonPerform(formData: FormData) {
  //
  let file = formData.get("file") as File;
  let lessonResultId = formData.get("lessonResultId") as String;

  //
  try {
    if (file) {
      let filename = Buffer.from(file.name, "latin1").toString("utf8");
      let newFormData = new FormData();
      newFormData.append("file", file);
      newFormData.append("folderName", "lessonPerform");
      const upload = await UploadFile(newFormData);
      console.log("uplaod", upload);
      if (upload) {
        let { location } = upload as UploadResponse;
        let lessonResultUpdate = await LessonResult.findOneAndUpdate(
          {
            _id: lessonResultId,
          },
          {
            perform: {
              downUrl: location,
              fileName: filename,
              size: file.size,
            },
            isLessonDone: true,
          }
        );
        return JSON.stringify({ data: lessonResultUpdate });
      } else {
        return JSON.stringify({ message: "upload failed" });
      }
    }
  } catch (e) {
    return JSON.stringify({ message: e });
  }
}

export async function createFeedBack(formData: FormData) {
  //
  let groupId = formData.get("groupId") as string;
  let title = formData.get("title") as string;
  let description = formData.get("description") as string;
  let lessonResultId = formData.get("lessonResultId") as string;
  let participants = formData.get("participants") as string;
  let file = formData.get("file") as File;
  let group = await Group.findOne({ _id: groupId });
  let teacherId = group.teacher;
  let participant = await Participant.findOne({ _id: participants });
  let teacher = await Teacher.findOne({ _id: teacherId });
  console.log("participant", participant);
  try {
    if (file) {
      let filename = Buffer.from(file.name, "latin1").toString("utf8");
      let newFormData = new FormData();
      newFormData.append("file", file);
      newFormData.append("folderName", "lessonPerform");
      const upload = await UploadFile(newFormData);
      console.log("uplaod", upload);
      if (upload) {
        let { location } = upload as UploadResponse;
        let feedback = await FeedBack.create({
          groupId,
          title: title,
          description: description,
          lessonResultId: lessonResultId,
          contentdownloadURL: location,
          contenFileName: filename,
          contentSize: file.size,
          participants: participant,
          auth: teacher,
        });
        //
        let lessonResult = await LessonResult.findOneAndUpdate(
          { _id: lessonResultId },
          { feedBack: feedback }
        );
        // sendMail
        let to = `${participant.email}`;
        const mailData: any = {
          to: to,
          subject: "살롱캔버스 피드백 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: feedbackTemplate({
            title: title,
            description: description,
          }),
          attachments: [
            {
              filename: filename, // the file name
              path: location, // link your file
              contentType: file.type, //type of file
            },
          ],
        };

        let sendResult = await sendMail(mailData);
        console.log("sendResult", sendResult);

        return { data: JSON.stringify(lessonResult) };
      }
    }
  } catch (e) {
    return { message: JSON.stringify(e) };
    //
  }
}

export async function whoeLessonResultDelete(groupId: string) {
  let res = await LessonResult.deleteMany({
    groupId: groupId,
  });
  return { data: JSON.stringify(res) };
}
export async function resetGroupdata(groupId: string) {
  let resLessonResult = await LessonResult.deleteMany({
    groupId: groupId,
  });
  let resLessonActivity = await LessonActivity.deleteMany({
    groupId: groupId,
  });
  let resLessonNotice = await Notice.deleteMany({
    groupId: groupId,
  });
  let res = await Group.findOneAndUpdate(
    {
      _id: groupId,
    },
    {
      notices: null,
      lessonActivitys: null,
      lessonResults: null,
      status: "개설중",
    }
  );
  return { data: JSON.stringify(res) };
}
