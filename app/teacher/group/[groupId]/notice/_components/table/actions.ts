"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Notice from "@/models/notice";
import Teacher from "@/models/teacher";

export async function getMoreData({
  pageIndex,
  pageSize,
  params,
  page,
  search,
  groupId,
}: {
  pageIndex: number;
  pageSize: number;
  params: any;
  page: string;
  search: string;
  groupId: string;
}) {
  await connectToMongoDB();
  try {
    console.log("groupId", groupId);
    const noticeCount = await Notice.find({
      groupId,
      sendTo: { $in: ["all", "teacher"] },
    }).countDocuments();
    const notice = await Notice.find({
      groupId,
      sendTo: { $in: ["all", "teacher"] },
    })
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    return {
      rows: JSON.stringify(notice),
      pageCount: Math.ceil(noticeCount / pageSize),
      totalCount: noticeCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "noticeCount 오류" };
  }
}
