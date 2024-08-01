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
  params,
  page,
  search,
}: {
  pageIndex: number;
  pageSize: number;
  params: any;
  page: string;
  search: string;
}) {
  await connectToMongoDB();
  try {
    const query = search
      ? {
          $or: [
            { status: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            // { "teacher.username": { $in: search } },
            // { "courseProfile.title": { $regex: search, $options: "i" } },
          ],
        }
      : {};
    // let pageSize // 페이지당 출력수
    console.log("pageIndex", search, pageIndex);
    const groupCount = await Group.find(query).countDocuments();
    const group = await Group.find(query)
      .populate({ path: "teacher", model: Teacher, select: "_id username " })
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
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    return {
      rows: JSON.stringify(group),
      pageCount: Math.ceil(groupCount / pageSize),
      totalCount: groupCount,
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
