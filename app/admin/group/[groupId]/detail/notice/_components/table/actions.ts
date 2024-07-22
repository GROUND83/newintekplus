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
  groupId,
}: {
  pageIndex: number;
  pageSize: number;
  groupId: string;
}) {
  await connectToMongoDB();
  try {
    console.log("groupId", groupId);
    const noticeCount = await Notice.find({ groupId }).countDocuments();
    const notice = await Notice.find({ groupId })
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({
        createdAt: -1,
      });
    return {
      rows: JSON.stringify(notice),
      pageCount: noticeCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "noticeCount 오류" };
  }
}
