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
import { model } from "mongoose";
import path from "path";

export async function getGroupDetail({
  groupId,
  userEmail,
}: {
  groupId: string;
  userEmail: string;
}) {
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
    let onwer = await Participant.findOne({ email: userEmail });
    let resultSurvey = await ResultSurvey.find({
      groupId: groupId,
      liveSurveyId: groupData.liveSurvey._id,
      onwer,
    });
    return {
      data: JSON.stringify(groupData),
      resultSurvey: JSON.stringify(resultSurvey),
    };
  } catch (e) {
    return { message: e };
  }
}

export async function createResultSurvey(formData: FormData) {
  //
  let liveSurveyId = formData.get("liveSurveyId") as string;
  let groupId = formData.get("groupId") as string;
  let userEmail = formData.get("onwer") as string;
  let resultsString = formData.get("results") as string;
  let result = JSON.parse(resultsString);
  let onwer = await Participant.findOne({ email: userEmail });
  //
  try {
    let resultSurveyfind = await ResultSurvey.findOne({
      liveSurveyId,
      groupId,
      onwer,
    });
    if (resultSurveyfind) {
      return { message: "이미 생성하였습니다." };
    } else {
      let resultSurvey = await ResultSurvey.create({
        liveSurveyId,
        groupId,
        results: result,
        onwer,
        isDone: true,
      });
      let group = await Group.findOneAndUpdate(
        {
          _id: groupId,
        },
        {
          $addToSet: {
            resultSurvey: resultSurvey,
          },
        }
      );
      return { data: JSON.stringify(group) };
    }
  } catch (e) {
    return { message: e };
  }
}
