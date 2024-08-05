"use server";

import { auth } from "@/auth";
import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import feedbackTemplate from "@/lib/mailtemplate/feedbackTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import CourseDirective from "@/models/courseDirective";
import CourseProfile from "@/models/courseProfile";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";

import Lesson from "@/models/lesson";

import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import LessonPerform from "@/models/lessonPerform";
import LessonResult from "@/models/lessonResult";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";

import Participant from "@/models/participant";
import Teacher from "@/models/teacher";

export const getSession = async () => {
  let session = await auth();
  console.log("session", session);
};
//
export async function detailGroup(groupId: string) {
  //
  await connectToMongoDB();
  try {
    let groups = await Group.findOne({ _id: groupId })
      .populate({
        path: "teacher",
        model: Teacher,
        select: "_id username email",
      })
      .populate({
        path: "liveSurvey",
        model: LiveSurvey,
      })

      .populate({
        path: "participants",
        model: Participant,
        select: "_id username email jobPosition",
      })
      .populate({
        path: "courseProfile",
        model: CourseProfile,
        select:
          "_id title eduForm eduPlace eduTarget eduAbilitys competency courseDirective courseWholeDirective jobGroup jobPosition jobSubGroup modules status train",
        populate: [
          {
            path: "modules",
            model: Module,
            populate: {
              path: "lessons",
              model: Lesson,
            },
          },
          {
            path: "courseWholeDirective",
            model: CourseDirective,
          },
          {
            path: "courseDirective",
            model: CourseDirective,
          },
        ],
      });
    // console.log("data", groups);
    return { data: JSON.stringify(groups) };
  } catch (e) {
    return { message: e };
  }
}

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
    .populate({ path: "feedBack", model: FeedBack })
    .populate({ path: "newPerform", model: LessonPerform });
  // console.log("lessonResult", lessonId, lessonResult, participant);
  return {
    data: JSON.stringify(res),
    lessonResult: JSON.stringify(lessonResult),
  };
}

export async function createFeedBack(formData: FormData) {
  //
  let groupId = formData.get("groupId") as string;
  let title = formData.get("title") as string;
  let description = formData.get("description") as string;
  let lessonResultId = formData.get("lessonResultId") as string;
  let participants = formData.get("participants") as string;
  let group = await Group.findOne({ _id: groupId });
  let teacherId = group.teacher;
  let participant = await Participant.findOne({ _id: participants });
  let teacher = await Teacher.findOne({ _id: teacherId });

  //
  let feedBackFile = formData.get("feedBackFile") as string;

  console.log("participant", feedBackFile, participant);
  try {
    if (feedBackFile) {
      let feedBackParser = JSON.parse(feedBackFile);
      console.log("feedBackParser", feedBackParser);
      let feedback = await FeedBack.create({
        groupId,
        title: title,
        description: description,
        lessonResultId: lessonResultId,
        contentdownloadURL: feedBackParser.contentdownloadURL,
        contenFileName: feedBackParser.contenFileName,
        contentSize: feedBackParser.contentSize,
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
            filename: feedBackParser.contenFileName, // the file name
            path: feedBackParser.contentdownloadURL, // link your file
            contentType: feedBackParser.type, //type of file
          },
        ],
      };

      sendMail(mailData);

      return { data: JSON.stringify(lessonResult) };
    } else {
      //
      let feedback = await FeedBack.create({
        groupId,
        title: title,
        description: description,
        lessonResultId: lessonResultId,

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
      };

      sendMail(mailData);

      return { data: JSON.stringify(lessonResult) };
    }
  } catch (e) {
    return { message: JSON.stringify(e) };
    //
  }
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
