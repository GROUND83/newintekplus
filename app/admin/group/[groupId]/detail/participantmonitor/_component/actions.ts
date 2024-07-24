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
          "perform.downUrl": { $ne: null },
        },
      },

      {
        $addFields: {
          newLessonId: {
            $toObjectId: "$lessonId",
          },
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "newLessonId",
          foreignField: "_id",
          as: "lessonInfo",
        },
      },
      {
        $unwind: {
          path: "$lessonInfo",
        },
      },
      {
        $lookup: {
          from: "participants",
          localField: "onwer",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
        },
      },
      {
        $lookup: {
          from: "lessonperforms",
          localField: "newPerform",
          foreignField: "_id",
          as: "newPerformInfo",
        },
      },
      {
        $unwind: {
          path: "$newPerformInfo",
        },
      },
      {
        $addFields: {
          newPerformUpdatedAt: "$newPerform.updatedAt",
        },
      },
      {
        $project: {
          groupId: 1,
          isEvaluationDone: 1,
          lessonTitle: "$lessonInfo.title",
          perform: 1,
          newPerformInfo: 1,
          newPerform: 1,
          userName: "$userInfo.username",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          point: "$point",
          newPerformUpdatedAt: "$newPerformUpdatedAt",
        },
      },
      // {
      //   $group: {
      //     _id: "$isEvaluationDone",
      //     data: {
      //       $push: {
      //         perform: "$perform",
      //         isEvaluationDone: "$isEvaluationDone",
      //         user_name: "$user_name",
      //         createdAt: "$createdAt",
      //         updatedAt: "$updatedAt",
      //         lessonTitle: "$lessonTitle",
      //         point: "$point",
      //         _id: "$_id",
      //       },
      //     },
      //   },
      // },
    ]);
    return {
      rows: JSON.stringify(feedBackList),
      pageCount: feedBackListCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "LessonResult 오류" };
  }
}
