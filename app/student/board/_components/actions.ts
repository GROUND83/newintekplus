"use server";

import { auth } from "@/auth";
import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Lesson from "@/models/lesson";
import NoticeContent from "@/models/noticeContent";
import Participant from "@/models/participant";
import WholeNotice from "@/models/wholenotice";

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
  page: number;
  search: string;
}) => {
  await connectToMongoDB();
  try {
    const session = await auth();

    // const query = search
    //   ? {
    //       participants: { $in: [{ _id: participant._id }] },
    //       status: "개설완료",
    //       $or: [{ name: { $regex: search, $options: "i" } }],
    //     }
    //   : {
    //       participants: { $in: [{ _id: participant._id }] },
    //       status: "개설완료",
    //     };
    const wholeNoticeCount = await WholeNotice.find({
      sendTo: { $ne: "teacher" },
    }).countDocuments();
    const wholeNotice = await WholeNotice.find({ sendTo: { $ne: "teacher" } })
      .populate({ path: "contents", model: NoticeContent })
      // .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("courseProfile", courseProfile);
    return {
      rows: JSON.stringify(wholeNotice),
      pageCount: Math.ceil(wholeNoticeCount / pageSize),
      totalCount: wholeNoticeCount,
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
