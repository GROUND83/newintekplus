"use server";

import { auth } from "@/auth";
import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import Participant from "@/models/participant";
import WholeNotice from "@/models/wholenotice";

export const getDashCount = async () => {
  await connectToMongoDB();
  try {
    const session = await auth();
    let participant = await Participant.findOne({ email: session?.user.email });
    const wholeNoticeCount = await WholeNotice.find({
      sendTo: { $ne: "teacher" },
    }).countDocuments();
    const feedBacksCount = await FeedBack.find({
      participants: participant,
    }).countDocuments();
    const groupCount = await Group.find({
      participants: { $in: [{ _id: participant._id }] },
      status: "개설완료",
    }).countDocuments();
    // console.log("courseProfile", courseProfile);
    return {
      wholeNoticeCount: wholeNoticeCount,
      feedBacksCount: feedBacksCount,
      groupCount: groupCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
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
