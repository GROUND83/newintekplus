"use server";

import { UploadFile } from "@/lib/fileUploader";
import feedbackTemplate from "@/lib/mailtemplate/feedbackTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonResult from "@/models/lessonResult";
import Module from "@/models/module";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function getModuleDetail({
  lessonId,
  moduleId,
}: {
  moduleId: string;
  lessonId: string;
}) {
  //
  try {
    let lesson = await Lesson.findOne({
      _id: lessonId,
    });
    let moduledata = await Module.findOne({
      _id: moduleId,
    }).populate({ path: "lessons", model: Lesson });
    console.log("moduledata", moduledata);

    // console.log("lessonResult", lessonId, lessonResult, participant);
    return {
      data: JSON.stringify({ lesson, module: moduledata }),
    };
  } catch (e) {
    return {
      message: e,
    };
  }

  // console.log("lessonResult", lessonId, participantEmail);
}
export async function updataLessonResultPoint({
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
      }
    );
    return { data: JSON.stringify(lessonResult) };
  } catch (e) {
    return { message: JSON.stringify(e) };
    //
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

        sendMail(mailData);

        return { data: JSON.stringify(lessonResult) };
      }
    }
  } catch (e) {
    return { message: JSON.stringify(e) };
    //
  }
}
