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
