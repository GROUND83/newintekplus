"use server";

import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LiveSurvey from "@/models/liveSurvey";
import NoticeContent from "@/models/noticeContent";
import Survey from "@/models/survey";
import WholeNotice from "@/models/wholenotice";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export const getMoreData = async ({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}) => {
  await connectToMongoDB();
  try {
    const wholeNoticeCount = await WholeNotice.find().countDocuments();
    const wholeNotice = await WholeNotice.find()
      // .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("liveSurvey", liveSurvey);
    return {
      rows: JSON.stringify(wholeNotice),
      pageCount: wholeNoticeCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "wholeNotice 오류" };
  }
};

export const detailWholeNotice = async (wholeNoticeId: string) => {
  await connectToMongoDB();
  try {
    const liveSurvey = await WholeNotice.findOne({
      _id: wholeNoticeId,
    }).populate({ path: "contents", model: NoticeContent });

    return {
      data: JSON.stringify(liveSurvey),
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
export const createWholeNotice = async (formdata: FormData) => {
  await connectToMongoDB();
  try {
    let sendTo = formdata.get("sendTo") as string;
    let title = formdata.get("title") as string;
    let description = formdata.get("description") as string;
    const lessonContentData = formdata.get("lessonContent") as string;
    const lessonContent = JSON.parse(lessonContentData);

    let whoteNotice = await WholeNotice.create({
      sendTo,
      title,
      description,
    });
    if (lessonContent.length > 0) {
      for (const index in lessonContent) {
        if (lessonContent[index].file) {
          //
          const contentFile = formdata.get(`contentFile_${index}`) as File;
          console.log("contentFile_", contentFile);
          let contentFileFormData = new FormData();
          contentFileFormData.append("file", contentFile);
          contentFileFormData.append("folderName", "noticeContents");
          const upload = await UploadFile(contentFileFormData);
          console.log("uplaod", upload);
          if (upload) {
            let { location } = upload as UploadResponse;
            //
            let lessonContenFileName = Buffer.from(
              contentFile.name,
              "latin1"
            ).toString("utf8");
            let noticeContent = await NoticeContent.create({
              contentdownloadURL: location,
              contentName: lessonContenFileName,
              contentSize: contentFile.size,
            });
            await WholeNotice.findOneAndUpdate(
              {
                _id: whoteNotice._id,
              },
              {
                $push: {
                  contents: noticeContent,
                },
              },
              { upsert: true }
            );
          }
        }
      }
    }

    // .select("property title createdAt lessonHour evaluation")

    // console.log("liveSurvey", liveSurvey);
    return {
      data: JSON.stringify(whoteNotice),
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};
