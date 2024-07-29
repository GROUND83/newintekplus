"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { getSession, useSession } from "next-auth/react";
import { auth } from "@/auth";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
export const getMoreData = async ({
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
}) => {
  await connectToMongoDB();
  try {
    const session = await auth();
    let participant = await Participant.findOne({ email: session?.user.email });
    const query = search
      ? {
          participants: { $in: [{ _id: participant._id }] },
          status: "개설완료",
          $or: [{ name: { $regex: search, $options: "i" } }],
        }
      : {
          participants: { $in: [{ _id: participant._id }] },
          status: "개설완료",
        };

    console.log("sessionuser", session);
    const groupCount = await Group.find(query).countDocuments();
    const group = await Group.find(query)
      .populate({ path: "teacher", model: Teacher, select: "username" })
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("courseProfile", courseProfile);
    return {
      rows: JSON.stringify(group),
      pageCount: Math.ceil(groupCount / pageSize),
      totalCount: groupCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "그룹 오류" };
  }
};
export async function detailGroup(groupId: string) {
  //
  await connectToMongoDB();
  try {
    let groups = await Group.findOne({ _id: groupId })
      .populate({
        path: "teacher",
        model: Teacher,
      })
      .populate({
        path: "liveSurvey",
        model: LiveSurvey,
      })

      .populate({
        path: "participants",
        model: Participant,
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
      });
    console.log("data", groups);
    return { data: JSON.stringify(groups) };
  } catch (e) {
    return { message: e };
  }
}
