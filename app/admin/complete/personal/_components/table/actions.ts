"use server";
import bcrypt from "bcrypt";
import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import NoticeContent from "@/models/noticeContent";
import Participant from "@/models/participant";
import Survey from "@/models/survey";
import WholeNotice from "@/models/wholenotice";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";
import { revalidatePath } from "next/cache";
import Teacher from "@/models/teacher";
import LessonResult from "@/models/lessonResult";

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
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
          aproved: true,
        }
      : { aproved: true };
    const studentCount = await Participant.find(query).countDocuments();
    const student = await Participant.find(query)
      .select(
        "_id username email phone department  jobSubGroup  jobGroup jobPosition  aproved "
      )
      // .select("property title createdAt lessonHour evaluation")

      .sort({
        username: 1,
      });
    console.log(pageIndex, pageSize);
    // console.log("liveSurvey", liveSurvey);
    return {
      rows: JSON.stringify(student),
      pageCount: Math.ceil(studentCount / pageSize),
      totalCount: studentCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "wholeNotice 오류" };
  }
};

export const getPersonalData = async (studentId: string) => {
  // let newdata = JSON.parse(data);
  // console.log("newData", newdata);
  await connectToMongoDB();
  try {
    let groups = await Group.find(
      { participants: { $in: [studentId] } },
      "courseProfile modules name startDate endDate place"
    )
      .populate({ path: "courseProfile", populate: { path: "modules" } })

      .lean();
    let newgroup = [];
    let totalPass = 0;
    let totalLesson = 0;
    for (const group of groups) {
      console.log("group", group);
      let lessonResultCount = await LessonResult.find({
        onwer: studentId,
        groupId: group._id,
      }).countDocuments();

      let passCount = await LessonResult.find({
        onwer: studentId,
        isPass: "passed",
        groupId: group._id,
      }).countDocuments();
      totalPass += passCount;
      let grouptotalLesson = 0;
      if (group.courseProfile.modules.length > 0) {
        for (const moduledata of group.courseProfile.modules) {
          grouptotalLesson += moduledata.lessons.length;
        }
        //
        newgroup.push({
          ...group,
          grouptotalLesson,
          passCount,
          lessonResultCount,
        });
      }
      totalLesson += grouptotalLesson;
    }

    let totalFailed = totalLesson - totalPass;

    return {
      data: JSON.stringify({
        groups: newgroup,
        totalFailed,
        totalPass,
        totalLesson,
      }),
    };
  } catch (e) {
    return { message: e };
  }
};
