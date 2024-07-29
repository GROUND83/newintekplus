"use server";

import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import Survey from "@/models/survey";

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
            { title: { $regex: search, $options: "i" } },
            // { "teacher.username": { $in: search } },
            // { "courseProfile.title": { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const liveSurveyCount = await LiveSurvey.find(query).countDocuments();
    const liveSurvey = await LiveSurvey.find(query)
      // .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("liveSurvey", liveSurvey);
    return {
      rows: JSON.stringify(liveSurvey),
      pageCount: Math.ceil(liveSurveyCount / pageSize),
      totalCount: liveSurveyCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};

export const detailLiveSurvey = async (liveSurveyId: string) => {
  await connectToMongoDB();
  try {
    const liveSurvey = await LiveSurvey.findOne({ _id: liveSurveyId }).populate(
      { path: "surveys", model: Survey }
    );
    const group = await Group.find({
      liveSurvey: liveSurvey,
      status: "개설완료",
    });

    return {
      data: JSON.stringify(liveSurvey),
      group: JSON.stringify(group),
    };
  } catch (e) {
    console.log(e);
    return { message: "liveSurvey 오류" };
  }
};

export const updateLiveSurvey = async (formdata: FormData) => {
  await connectToMongoDB();
  try {
    let liveSurveyId = formdata.get("_id") as string;
    let title = formdata.get("title") as string;
    let surveys = formdata.get("surveys") as string;
    let surveysArray = JSON.parse(surveys);

    console.log("surveysArray", surveysArray);
    let surveyNewArray = [];
    for (const survey of surveysArray) {
      if (survey._id) {
        //
        let newsurvey = await Survey.findOneAndUpdate(
          { _id: survey._id },
          { title: survey.title }
        );
        surveyNewArray.push(newsurvey);
      } else {
        //
        let newsurvey = await Survey.create({ title: survey.title });
        surveyNewArray.push(newsurvey);
      }
    }
    const liveSurvey = await LiveSurvey.findOneAndUpdate(
      { _id: liveSurveyId },
      {
        title,
        $set: { surveys: surveyNewArray },
      }
    );

    // .select("property title createdAt lessonHour evaluation")

    // console.log("liveSurvey", liveSurvey);
    return {
      data: JSON.stringify(liveSurvey),
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};
export const createLiveSurvey = async (formdata: FormData) => {
  await connectToMongoDB();
  try {
    let title = formdata.get("title") as string;
    let surveys = formdata.get("surveys") as string;
    let surveysArray = JSON.parse(surveys);

    console.log("surveysArray", surveysArray);
    let surveyNewArray = [];
    for (const survey of surveysArray) {
      let newsurvey = await Survey.create({ title: survey.title });
      surveyNewArray.push(newsurvey);
    }
    const liveSurvey = await LiveSurvey.create({
      title,
      $set: { surveys: surveyNewArray },
    });

    // .select("property title createdAt lessonHour evaluation")

    // console.log("liveSurvey", liveSurvey);
    return {
      data: JSON.stringify(liveSurvey),
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};
