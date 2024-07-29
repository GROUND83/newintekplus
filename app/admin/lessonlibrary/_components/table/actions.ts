"use server";

import { connectToMongoDB } from "@/lib/db";
import Lesson from "@/models/lesson";

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
    const query = search
      ? {
          $or: [
            { property: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } },
            // { "teacher.username": { $in: search } },
            // { "courseProfile.title": { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const lessonCount = await Lesson.find(query).countDocuments();
    const lessonLibrary = await Lesson.find(query)
      .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("lessonLibrary", lessonLibrary);
    return {
      rows: JSON.stringify(lessonLibrary),
      pageCount: Math.ceil(lessonCount / pageSize),
      totalCount: lessonCount,
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
