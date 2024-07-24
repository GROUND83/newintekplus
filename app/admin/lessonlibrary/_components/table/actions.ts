"use server";

import { connectToMongoDB } from "@/lib/db";
import Lesson from "@/models/lesson";

export const getMoreData = async ({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}) => {
  await connectToMongoDB();
  try {
    const lessonCount = await Lesson.find().countDocuments();
    const lessonLibrary = await Lesson.find()
      .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("lessonLibrary", lessonLibrary);
    return {
      rows: JSON.stringify(lessonLibrary),
      pageCount: lessonCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "레슨라이브러리 오류" };
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
