"use server";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonResult from "@/models/lessonResult";
import Module from "@/models/module";
import Participant from "@/models/participant";

export async function getModuleList({ groupId }: { groupId: string }) {
  //
  console.log("groupID", groupId);
  //
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
      populate: { path: "onwer", model: Participant, select: "_id email" },
    });
  return { data: JSON.stringify(res) };
}
