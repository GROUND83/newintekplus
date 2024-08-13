"use server";

import { connectToMongoDB } from "@/lib/db";
import CompetencyDictionary from "@/models/competencyDictionanry";
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
          $or: [{ title: { $regex: search, $options: "i" } }],
        }
      : {};
    const competencyDictionaryCount = await CompetencyDictionary.find(
      query
    ).countDocuments();
    const competencyDictionary = await CompetencyDictionary.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("liveSurvey", liveSurvey);
    return {
      rows: JSON.stringify(competencyDictionary),
      pageCount: Math.ceil(competencyDictionaryCount / pageSize),
      totalCount: competencyDictionaryCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};
