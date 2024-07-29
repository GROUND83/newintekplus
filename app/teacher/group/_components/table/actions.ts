"use server";

import { auth } from "@/auth";
import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { useSession } from "next-auth/react";

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
    // let session = useSession();
    let session = await auth();
    // console.log("sessionuser", session.user);
    let teacher = await Teacher.findOne({ email: session?.user.email });
    const query = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }],
          teacher: teacher,
          status: "개설완료",
        }
      : { teacher: teacher, status: "개설완료" };
    const groupCount = await Group.find(query).countDocuments();
    const group = await Group.find(query)
      .populate({ path: "teacher", model: Teacher, select: "username" })
      .populate({ path: "courseProfile", model: CourseProfile })
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
    // console.log("data", groups);
    return { data: JSON.stringify(groups) };
  } catch (e) {
    return { message: e };
  }
}
