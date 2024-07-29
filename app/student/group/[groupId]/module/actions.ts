"use server";
import { auth } from "@/auth";
import CourseProfile from "@/models/courseProfile";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonResult from "@/models/lessonResult";
import Module from "@/models/module";
import Participant from "@/models/participant";

export async function getModuleList(groupId: string) {
  // aggreate
  const session = await auth();
  let res = await Group.findOne({
    _id: groupId,
  })
    .populate({
      path: "courseProfile",
      model: CourseProfile,
      populate: {
        path: "modules",
        model: Module,
        populate: {
          path: "lessons",
          model: Lesson,
        },
      },
    })
    .populate({
      path: "lessonResults",
      model: LessonResult,
      populate: [
        { path: "onwer", model: Participant, select: "_id email" },
        { path: "feedBack", model: FeedBack },
      ],
    })
    .lean();

  // console.log("Group", res);
  if (res) {
    let courseProfile = res.courseProfile;
    let modules = courseProfile.modules;
    let newModules = [];
    for await (const moduledata of modules) {
      let newLessonArray = [];
      for await (const lesson of moduledata.lessons) {
        //
        let findarrya = res.lessonResults.find(
          (item: any) =>
            item.lessonId.toString() === lesson._id.toString() &&
            item.onwer.email === session?.user.email
        );
        if (findarrya) {
          console.log(
            "lessonResult",

            findarrya
          );
        }
        if (findarrya?.isLessonDone) {
          let newlesson = {
            ...lesson,
            finishedPerform: true,
            lessonResult: { ...findarrya },
          };
          // lesson.finishedPerform = true;
          newLessonArray.push(newlesson);
        } else {
          let newlesson = {
            ...lesson,
            finishedPerform: false,
            lessonResult: { ...findarrya },
          };
          // lesson.finishedPerform = false;
          newLessonArray.push(newlesson);
        }
      }
      newModules.push({ ...moduledata, lessons: newLessonArray });
    }

    return {
      data: JSON.stringify({
        ...res,
        courseProfile: { ...res.courseProfile, modules: newModules },
      }),
    };
  }
}
