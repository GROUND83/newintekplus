"use server";

import { auth } from "@/auth";
import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import FeedBack from "@/models/feedback";
import Lesson from "@/models/lesson";
import Participant from "@/models/participant";
import WholeNotice from "@/models/wholenotice";

export const getMoreData = async ({
  pageIndex,
  pageSize,
  params,
  page,
  search,
}: {
  pageIndex;
  pageSize;
  params;
  page;
  search;
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
    const courseProfileCount = await WholeNotice.find({
      sendTo: { $ne: "teacher" },
    }).countDocuments();
    const courseProfile = await WholeNotice.find({ sendTo: { $ne: "teacher" } })
      // .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("courseProfile", courseProfile);
    return {
      rows: JSON.stringify(courseProfile),
      pageCount: Math.ceil(courseProfileCount / pageSize),
      totalCount: courseProfileCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};

export async function getFeedBackDetail(feedbackId: string) {
  try {
    // lessonresult id => 확인
    let res = await FeedBack.findOne({
      _id: feedbackId,
    });
    if (res) {
      return { data: JSON.stringify(res) };
    } else {
      return { message: "noting" };
    }
  } catch (error) {
    return { message: error };
  }
}
