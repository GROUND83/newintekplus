"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { useSession } from "next-auth/react";

export const getGroupList = async ({
  pageIndex,
  pageSize,
  user,
}: {
  pageIndex: number;
  pageSize: number;
  user: any;
}) => {
  await connectToMongoDB();
  try {
    // let session = useSession();
    console.log("user", user);
    let participant = await Participant.findOne({ email: user.email });
    const groupCount = await Group.find({
      participants: { $in: [{ _id: participant._id }] },
      status: "개설완료",
    }).countDocuments();
    const group = await Group.find({
      participants: { $in: [{ _id: participant._id }] },
      status: "개설완료",
    })
      .populate({ path: "teacher", model: Teacher, select: "username" })
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("courseProfile", courseProfile);
    return {
      rows: JSON.stringify(group),
      pageCount: groupCount,
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
