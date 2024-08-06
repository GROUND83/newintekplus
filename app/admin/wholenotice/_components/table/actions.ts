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
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          // { "teacher.username": { $in: search } },
          // { "courseProfile.title": { $regex: search, $options: "i" } },
        ],
      }
    : {};
  try {
    const wholeNoticeCount = await WholeNotice.find(query).countDocuments();
    const wholeNotice = await WholeNotice.find(query)
      .populate({ path: "contents", model: NoticeContent })
      // .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("liveSurvey", liveSurvey);
    return {
      rows: JSON.stringify(wholeNotice),
      pageCount: Math.ceil(wholeNoticeCount / pageSize),
      totalCount: wholeNoticeCount,
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
    const newContent = formdata.get("newContent") as string;
    const newContentData = JSON.parse(newContent);

    let whoteNotice = await WholeNotice.create({
      sendTo,
      title,
      description,
    });
    if (newContent) {
      for (const content of newContentData) {
        let noticeContent = await NoticeContent.create({
          contentdownloadURL: content.contentdownloadURL,
          contentName: content.contentName,
          contentSize: content.contentSize,
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

    return {
      data: JSON.stringify(whoteNotice),
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};
export const updateWholeNotice = async (formdata: FormData) => {
  await connectToMongoDB();
  try {
    let _id = formdata.get("_id") as string;
    let sendTo = formdata.get("sendTo") as string;
    let title = formdata.get("title") as string;
    let description = formdata.get("description") as string;
    const newContent = formdata.get("newContent") as string;
    const newContentData = JSON.parse(newContent);

    let whoteNotice = await WholeNotice.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        sendTo,
        title,
        description,
      }
    );
    if (newContent) {
      if (newContentData.length > 0) {
        let newContent = [];
        for (const content of newContentData) {
          console.log("content", content);
          if (!content._id) {
            let noticeContent = await NoticeContent.create({
              contentdownloadURL: content.contentdownloadURL,
              contentName: content.contentName,
              contentSize: content.contentSize,
            });
            newContent.push(noticeContent);
          } else {
            if (content.isnew) {
              let noticeContent = await NoticeContent.create({
                contentdownloadURL: content.contentdownloadURL,
                contentName: content.contentName,
                contentSize: content.contentSize,
              });
              newContent.push(noticeContent);
            } else {
              newContent.push(content);
            }
          }
        }
        await WholeNotice.findOneAndUpdate(
          {
            _id: whoteNotice._id,
          },
          {
            $set: {
              contents: newContent,
            },
          },
          { upsert: true }
        );
      }
    } else {
      await WholeNotice.findOneAndUpdate(
        {
          _id: whoteNotice._id,
        },
        {
          $set: {
            contents: null,
          },
        },
        { upsert: true }
      );
    }

    return {
      data: JSON.stringify(whoteNotice),
    };
  } catch (e) {
    console.log(e);
    return { message: "코스프로파일 오류" };
  }
};
