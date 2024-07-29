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

export async function getMoreData(groupId: string) {
  await connectToMongoDB();
  try {
    const feedBackList = await LessonResult.aggregate([
      {
        $match: {
          groupId: groupId,
          isEvaluationDone: true,
          feedBack: { $ne: null },
        },
      },
      {
        $lookup: {
          from: "participants",
          localField: "onwer",
          foreignField: "_id",
          as: "userinfo",
        },
      },
      { $unwind: "$userinfo" },
      {
        $lookup: {
          from: "feedbacks",
          localField: "feedBack",
          foreignField: "_id",
          as: "feedBackinfo",
        },
      },
      { $unwind: "$feedBackinfo" },
      {
        $addFields: {
          lesosnObjectId: {
            $toObjectId: "$lessonId",
          },
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "lesosnObjectId",
          foreignField: "_id",
          as: "lessoninfo",
        },
      },
      { $unwind: "$lessoninfo" },
      {
        $addFields: {
          feedbackUpdatedAt: "$feedBackinfo.updatedAt",
        },
      },
      {
        $project: {
          username: "$userinfo.username",
          lessonName: "$lessoninfo.title",
          feedBack: "$feedBackinfo",
          feedbackUpdatedAt: "$feedBackinfo.updatedAt",
        },
      },
      {
        $sort: {
          feedbackUpdatedAt: -1,
        },
      },
    ]);

    // const feedBackList = await LessonResult.find({
    //   groupId: groupId,
    // }).populate({ path: "onwer", model: Participant });
    return {
      rows: JSON.stringify(feedBackList),
      totalCount: feedBackList.length,
    };
  } catch (e) {
    console.log(e);
    return { message: "LessonResult 오류" };
  }
}
