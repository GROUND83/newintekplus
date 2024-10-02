"use server";
import { auth } from "@/auth";
import { UploadFile } from "@/lib/fileUploader";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import LessonPerform from "@/models/lessonPerform";
import LessonResult from "@/models/lessonResult";
import Module from "@/models/module";
import Participant from "@/models/participant";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function getLessonDetail({
  lessonId,
  groupId,
}: {
  lessonId: string;
  groupId: string;
}) {
  //
  // console.log("lessonResult", lessonId, participantEmail);
  let session = await auth();
  let res = await Lesson.findOne({
    _id: lessonId,
  })
    .populate({ path: "lessonDirective", model: LessonDirective })
    .populate({ path: "lessonContents", model: LessonContent });

  let participant = await Participant.findOne({
    email: session.user.email,
  });
  let lessonResult = await LessonResult.findOne({
    lessonId: lessonId,
    onwer: participant,
    groupId: groupId,
  });
  // console.log("lessonResult", lessonId, lessonResult, participant);
  return {
    data: JSON.stringify(res),
    lessonResult: JSON.stringify(lessonResult),
  };
}

export async function updateLessonPerform(formData: FormData) {
  //
  let lessonPerform = formData.get("lessonPerform") as string;
  let lessonResultId = formData.get("lessonResultId") as String;
  let groupId = formData.get("groupId") as String;
  let lessonId = formData.get("lessonId") as String;
  //
  console.log("groupId", groupId, lessonId);
  try {
    let session = await auth();
    let onwer = await Participant.findOne({ email: session.user.email });
    console.log("onwer", onwer);
    if (lessonPerform) {
      let newLessonPerForm = JSON.parse(lessonPerform);
      if (newLessonPerForm) {
        let newPerform = await LessonPerform.create({
          groupId: groupId,
          lessonId: lessonId,
          lessonResultId: lessonResultId,
          lessonPerformdownloadURL: newLessonPerForm.lessonPerformdownloadURL,
          lessonPerformFileName: newLessonPerForm.lessonPerformFileName,
          lessonPerformSize: newLessonPerForm.lessonPerformSize,
          onwer: onwer,
        });
        let lessonResultUpdate = await LessonResult.findOneAndUpdate(
          {
            _id: lessonResultId,
          },
          {
            newPerform: newPerform,
            perform: {
              downUrl: newLessonPerForm.lessonPerformdownloadURL,
              fileName: newLessonPerForm.lessonPerformFileName,
              size: newLessonPerForm.lessonPerformSize,
            },
            isLessonDone: true,
            isNewdata: true,
          }
        );
        return JSON.stringify({ data: lessonResultUpdate });
      } else {
        return JSON.stringify({ message: "upload failed" });
      }
    } else {
      return JSON.stringify({ message: "file failed" });
    }
  } catch (e) {
    return JSON.stringify({ message: e });
  }
}
