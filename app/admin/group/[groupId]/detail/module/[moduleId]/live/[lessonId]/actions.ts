"use server";
import { UploadFile } from "@/lib/fileUploader";
import CourseProfile from "@/models/courseProfile";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import LessonResult from "@/models/lessonResult";
import Module from "@/models/module";
import Participant from "@/models/participant";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function getLessonDetail({
  lessonId,
  groupId,
}: {
  groupId: string;
  lessonId: string;
}) {
  //
  // console.log("lessonResult", lessonId, participantEmail);
  let res = await Lesson.findOne({
    _id: lessonId,
  })
    .populate({ path: "lessonDirective", model: LessonDirective })
    .populate({ path: "lessonContents", model: LessonContent });

  let lessonResult = await LessonResult.find({
    lessonId: lessonId,
    groupId: groupId,
  })
    .populate({ path: "onwer", model: Participant })
    .populate({ path: "feedBack", model: FeedBack });
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
