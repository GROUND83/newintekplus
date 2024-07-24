"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Teacher from "@/models/teacher";

export async function getMoreData({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}) {
  await connectToMongoDB();
  try {
    const groupCount = await Group.find().countDocuments();
    const group = await Group.find()
      .populate({ path: "teacher", model: Teacher, select: "_id username" })
      .populate({
        path: "courseProfile",
        model: CourseProfile,
        select: "_id eduform title",
        populate: {
          path: "modules",
          model: Module,
          populate: {
            path: "lessons",
            model: Lesson,
          },
        },
      })
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({
        createdAt: -1,
      });
    return {
      rows: JSON.stringify(group),
      pageCount: groupCount,
    };
  } catch (e) {
    // console.log(e);
    return { message: "그룹 오류" };
  }
}

export async function getLiveSurvey(groupId: string) {
  let res = await LiveSurvey.find({ groupId: groupId });
  return { data: JSON.stringify(res) };
}
