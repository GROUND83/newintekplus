"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Notice from "@/models/notice";
import NoticeContent from "@/models/noticeContent";
import Participant from "@/models/participant";
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
    const query = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }],
          groupId: groupId,
        }
      : { groupId: groupId };
    console.log("groupId", groupId);
    const noticeCount = await Notice.find(query).countDocuments();
    const notice = await Notice.find(query)
      .populate({ path: "contents", model: NoticeContent })
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

export async function getSenderData({
  sendTo,
  groupId,
}: {
  sendTo: string;
  groupId: string;
}) {
  //
  let group = await Group.findOne({ _id: groupId })
    .populate({
      path: "teacher",
      model: Teacher,
      select: "email _id username",
    })
    .populate({
      path: "participants",
      model: Participant,
      select: "email _id username",
    });
  console.log("sendTo", sendTo);
  if (sendTo === "all") {
    //
    let to = [group.teacher, ...group.participants];
    return { data: JSON.stringify(to) };
  }
  if (sendTo === "teacher") {
    //
    let to = [group.teacher];
    return { data: JSON.stringify(to) };
  }
  if (sendTo === "student") {
    //
    let to = group.participants;
    return { data: JSON.stringify(to) };
  }
}
