"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { getSession, useSession } from "next-auth/react";
import { auth } from "@/auth";
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
// import db from "@/lib/db";

// export async function getMoreData(options: {
//   pageIndex: number;
//   pageSize: number;
// }) {
//   const response = await db.$transaction([
//     db.farm.count(),
//     db.farm.findMany({
//       select: {
//         id: true,
//         initail: true,
//         name: true,
//         visible: true,
//         address: true,
//         created_at: true,
//         owner: {
//           select: {
//             id: true,
//             username: true,
//             phone: true,
//             avatar: true,
//           },
//         },
//       },
//       skip: options.pageSize * options.pageIndex,
//       take: options.pageSize,
//       orderBy: {
//         created_at: "desc", // 내림차순 최신순
//       },
//     }),
//   ]);
//   const pageCount = response[0];
//   const rows = response[1];
//   console.log({ pageCount, rows });
//   return { pageCount, rows };
// }
