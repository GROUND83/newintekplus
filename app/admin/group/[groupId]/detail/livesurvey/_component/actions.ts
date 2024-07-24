"use server";
import { UploadFile } from "@/lib/fileUploader";
import { generatePdf } from "@/lib/generatePdf";
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
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";
import path from "path";

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

export async function sendCertification(formData: FormData) {
  //

  let file = formData.get("file");

  let newformData = new FormData();
  newformData.append("file", file);
  newformData.append("folderName", "certification");
  let upload = await UploadFile(newformData);
  let { location } = upload as UploadResponse;

  console.log("location", location);
  let fileUrl = location;
  console.log("fileUrl", fileUrl);
  //
}
