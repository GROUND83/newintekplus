"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonResult from "@/models/lessonResult";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";

export async function getMoreData({
  pageIndex,
  pageSize,
  groupId,
}: {
  pageIndex: number;
  pageSize: number;
  groupId: string;
}) {
  await connectToMongoDB();
  try {
    const feedBackListCount = await LessonResult.find({
      groupId: groupId,
      isEvaluationDone: true,
      feedBack: { $ne: null },
    }).countDocuments();
    // const feedBackList = await LessonResult.aggregate([
    //   {
    //     $match: {
    //       groupId: "669e44a33269a859c0028ef5",
    //       isEvaluationDone: true,
    //       feedBack: { $ne: null },
    //     },
    //   },
    //   {
    //     $limit: pageSize,
    //   },
    //   {
    //     $skip: pageSize * pageIndex,
    //   },
    //   {
    //     $lookup: {
    //       from: "participants",
    //       localField: "onwer",
    //       foreignField: "_id",
    //       as: "userinfo",
    //     },
    //   },
    //   { $unwind: "$userinfo" },
    //   {
    //     $lookup: {
    //       from: "feedbacks",
    //       localField: "feedBack",
    //       foreignField: "_id",
    //       as: "feedBackinfo",
    //     },
    //   },
    //   { $unwind: "$feedBackinfo" },
    //   {
    //     $addFields: {
    //       lesosnObjectId: {
    //         $toObjectId: "$lessonId",
    //       },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "lessons",
    //       localField: "lesosnObjectId",
    //       foreignField: "_id",
    //       as: "lessoninfo",
    //     },
    //   },
    //   { $unwind: "$lessoninfo" },
    //   {
    //     $addFields: {
    //       feedbackUpdatedAt: "$feedBackinfo.updatedAt",
    //     },
    //   },
    //   {
    //     $project: {
    //       username: "$userinfo.username",
    //       lessonName: "$lessoninfo.title",
    //       feedBack: "$feedBackinfo",
    //       feedbackUpdatedAt: "$feedBackinfo.updatedAt",
    //     },
    //   },
    //   {
    //     $sort: {
    //       feedbackUpdatedAt: -1,
    //     },
    //   },
    // ]);
    // let feedBackList = await LessonResult.find({
    //   groupId: groupId,
    //   isEvaluationDone: true,
    //   feedBack: { $ne: null },
    // })
    //   .populate({ path: "onwer", model: Participant, select: "username _id" })
    //   .limit(pageSize)
    //   .skip(pageSize * pageIndex)
    //   .sort({
    //     createdAt: -1,
    //   });

    let feedBackList = await LessonResult.aggregate([
      {
        $match: {
          groupId: groupId,
        },
      },
      {
        $lookup: {
          from: "participants",
          localField: "onwer",
          foreignField: "_id",
          as: "user_data",
        },
      },
      {
        $unwind: {
          path: "$user_data",
        },
      },
      {
        $addFields: {
          newGroupId: {
            $toObjectId: "$groupId",
          },
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "newGroupId",
          foreignField: "_id",
          as: "groups",
        },
      },
      {
        $unwind: {
          path: "$groups",
        },
      },
      {
        $addFields: {
          lessonSize: {
            $size: "$groups.lessonResults",
          },
        },
      },
      {
        $addFields: {
          studentSize: { $size: "$groups.participants" },
        },
      },
      {
        $addFields: {
          lessontotalSize: { $divide: ["$lessonSize", "$studentSize"] },
        },
      },
      {
        $project: {
          user_id: "$user_data._id",
          user_name: "$user_data.username",
          isPass: "$isPass",
          isLessonDone: "$isLessonDone",
          point: "$point",
          lessonSize: "$lessonSize",
          studentSize: "$studentSize",
          lessontotalSize: "$lessontotalSize",
        },
      },
      {
        $group: {
          _id: "$user_id",
          lessontotalSize: {
            $first: "$lessontotalSize",
          },
          studentSize: {
            $first: "$studentSize",
          },
          username: {
            $first: "$user_name",
          },
          lessonSize: {
            $first: "$lessonSize",
          },
          totalPoint: {
            $sum: "$point",
          },
          passCount: {
            $sum: {
              $cond: [
                {
                  $eq: ["$isPass", "passed"],
                },
                1,
                0,
              ],
            },
          },
          complete: {
            $sum: {
              $cond: [
                {
                  $eq: ["$isLessonDone", true],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          username: -1,
          _id: -1,
        },
      },
    ]);
    return {
      rows: JSON.stringify(feedBackList),
      pageCount: feedBackList.length,
    };
  } catch (e) {
    console.log(e);
    return { message: "LessonResult 오류" };
  }
}
