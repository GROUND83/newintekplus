"use server";

import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Participant from "@/models/participant";
import ResultSurvey from "@/models/resultSurvey";
import Survey from "@/models/survey";
import Teacher from "@/models/teacher";
import mongoose from "mongoose";

export async function getGroupDetail(groupId: string) {
  //
  // console.log(groupId);
  //
  try {
    let groupData = await Group.findOne({ _id: groupId })
      .populate({
        path: "teacher",
        model: Teacher,
      })
      .populate({
        path: "liveSurvey",
        model: LiveSurvey,
        populate: {
          path: "surveys",
          model: Survey,
        },
      })
      .populate({
        path: "participants",
        model: Participant,
        select: "_id username email department",
      })
      .populate({
        path: "courseProfile",
        model: CourseProfile,
        populate: {
          path: "modules",
          model: Module,
          populate: {
            path: "lessons",
            model: Lesson,
          },
        },
      })
      .populate({
        path: "resultSurvey",
        model: ResultSurvey,
      });
    //
    let resultSurvey = await ResultSurvey.find({
      groupId: groupId,
      liveSurveyId: groupData.liveSurvey._id,
    }).populate({
      path: "onwer",
      model: Participant,
      select: "_id username email",
    });
    return {
      data: JSON.stringify(groupData),
      resultSurvey: JSON.stringify(resultSurvey),
    };
  } catch (e) {
    return { message: e };
  }
}

export async function resultSurveyUpdate(resultSurveyId: string) {
  //
  let res = await ResultSurvey.findOneAndUpdate(
    {
      _id: resultSurveyId,
    },
    {
      isSend: true,
    }
  );
  return { data: JSON.stringify(res) };
  //
}

export async function getTotalResultSurvey(groupId: string) {
  let res = await Group.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(groupId),
      },
    },

    {
      $lookup: {
        from: "resultsurveys",
        localField: "resultSurvey",
        foreignField: "_id",
        as: "resultsurveys",
      },
    },
    {
      $unwind: {
        path: "$resultsurveys",
      },
    },
    {
      $unwind: {
        path: "$resultsurveys.results",
      },
    },
    {
      $group: {
        _id: "$resultsurveys.results.surveyId",
        name: { $first: "$name" },
        title: {
          $first: "$resultsurveys.results.title",
        },
        resultsurveyslength: {
          $first: { $size: "$resultSurvey" },
        },
        totalPoint: {
          $sum: "$resultsurveys.results.point",
        },
        participantsLength: {
          $first: { $size: "$participants" },
        },

        // $count: "sum",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        name: 1,
        totalPoint: 1,
        resultsurveyslength: 1,
        participantsLength: 1,
        total: {
          $multiply: ["$participantsLength", 5],
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return { data: JSON.stringify(res) };
}
