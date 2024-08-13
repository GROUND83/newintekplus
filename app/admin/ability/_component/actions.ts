"use server";

import { connectToMongoDB } from "@/lib/db";
import CommonCompetency from "@/models/commonCompetency";
import CompetencyDictionary from "@/models/competencyDictionanry";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import JobCompetency from "@/models/jobCompetency";
import JobGroup from "@/models/jobGroup";
import JobProfile from "@/models/jobProfile";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import ReadershipCompetency from "@/models/readershipCompetency";
import Survey from "@/models/survey";

export async function getCommonAbility() {
  let res = await CommonCompetency.find()
    .populate({
      path: "competencys",
      model: CompetencyDictionary,
    })
    .lean();
  //공통역량 => 역량들이 모여있다.
  return { data: JSON.stringify(res[0].competencys) };
}
export async function getleadership() {
  let res = await ReadershipCompetency.find()
    .populate({
      path: "competencys",
      model: CompetencyDictionary,
    })
    .lean();
  //공통역량 => 역량들이 모여있다.
  return { data: JSON.stringify(res[0].competencys) };
}
export async function gettaskability() {
  let res = await JobCompetency.find({ company: "intekplus" }).populate({
    path: "group",
    model: JobGroup,
    populate: {
      path: "jobprofile",
      model: JobProfile,
    },
  });

  //공통역량 => 역량들이 모여있다.
  return { data: JSON.stringify(res) };
}
export async function gettaskabilityTitle(title: string) {
  let res = await JobCompetency.findOne({
    company: "intekplus",
    title,
  }).populate({
    path: "group",
    model: JobGroup,
    populate: {
      path: "jobprofile",
      model: JobProfile,
      populate: {
        path: "competencys",
        model: CompetencyDictionary,
      },
    },
  });

  //공통역량 => 역량들이 모여있다.
  return { data: JSON.stringify(res) };
}
