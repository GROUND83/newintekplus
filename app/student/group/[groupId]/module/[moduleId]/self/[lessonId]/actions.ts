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
  let file = formData.get("file") as File;
  let lessonResultId = formData.get("lessonResultId") as String;
  let groupId = formData.get("groupId") as String;
  let lessonId = formData.get("lessonId") as String;
  //
  console.log("groupId", groupId, lessonId);
  try {
    let session = await auth();
    let onwer = await Participant.findOne({ email: session.user.email });
    console.log("onwer", onwer);
    if (file) {
      let filename = Buffer.from(file.name, "latin1").toString("utf8");
      let newFormData = new FormData();
      newFormData.append("file", file);
      newFormData.append("folderName", "lessonPerform");
      const upload = await UploadFile(newFormData);
      console.log("uplaod", upload);
      if (upload) {
        let { location } = upload as UploadResponse;
        let newPerform = await LessonPerform.create({
          groupId: groupId,
          lessonId: lessonId,
          lessonResultId: lessonResultId,
          lessonPerformdownloadURL: location,
          lessonPerformFileName: filename,
          lessonPerformSize: file.size,
          onwer: onwer,
        });
        let lessonResultUpdate = await LessonResult.findOneAndUpdate(
          {
            _id: lessonResultId,
          },
          {
            newPerform: newPerform,
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
    } else {
      return JSON.stringify({ message: "file failed" });
    }
  } catch (e) {
    return JSON.stringify({ message: e });
  }
}