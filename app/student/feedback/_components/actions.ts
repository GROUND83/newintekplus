"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { getSession, useSession } from "next-auth/react";
import { auth } from "@/auth";
import FeedBack from "@/models/feedback";
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
          participants: participant,
          // isSend: true,
          $or: [{ title: { $regex: search, $options: "i" } }],
        }
      : {
          participants: participant,
          // isSend: true,
        };

    console.log("sessionuser", session);
    const feedBacksCount = await FeedBack.find(query).countDocuments();
    const feedBacks = await FeedBack.find(query)
      .populate({ path: "auth", model: Teacher })
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("courseProfile", courseProfile);
    // for (const feedBack of feedBacks) {
    //   let groupId = feedBack.groupId
    //   let group = await Group.findOne({_id:groupId})
    // }
    return {
      rows: JSON.stringify(feedBacks),
      pageCount: Math.ceil(feedBacksCount / pageSize),
      totalCount: feedBacksCount,
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
