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

            // { "teacher.username": { $in: search } },
            // { "courseProfile.title": { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const studentCount = await Participant.find(query).countDocuments();
    const student = await Participant.find(query)
      .select(
        "_id username email phone department  jobSubGroup  jobGroup jobPosition  aproved "
      )
      // .select("property title createdAt lessonHour evaluation")
      .sort({
        createdAt: -1,
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
export const getParticipants = async () => {
  await connectToMongoDB();
  try {
    const participant = await Participant.find({}).select(
      "_id email username jobPosition "
    );

    return {
      data: JSON.stringify(participant),
    };
  } catch (e) {
    console.log(e);
    return { message: "participant 오류" };
  }
};
export const getTeachers = async () => {
  await connectToMongoDB();
  try {
    const teacher = await Teacher.find({}).select("_id email username ");

    return {
      data: JSON.stringify(teacher),
    };
  } catch (e) {
    console.log(e);
    return { message: "Teacher 오류" };
  }
};
export const createParticipants = async (formdata: FormData) => {
  try {
    await connectToMongoDB();
    //
    let participant = formdata.get("paticipants") as string;
    let participantParser = JSON.parse(participant);

    for (const student of participantParser) {
      let particapant = await Participant.findOne({ email: student.email });
      if (!particapant) {
        console.log("없음");
        const hash = await bcrypt.hash("intekplus2024", 10);
        let createStudent = await Participant.create({
          status: 1,
          phone: student.phone,
          department: student.department,
          part: student.part,
          jobGroup: student.jobGroup,
          jobSubGroup: student.jobSubGroup,
          jobPosition: student.jobPosition,
          email: student.email,
          password: hash,
          username: student.username,
          aproved: true,
          directCreate: true,
        });
      }
    }
    revalidatePath("/admin/account/student");
    return {
      data: JSON.stringify(participant),
    };
  } catch (e) {
    console.log(e);
    return { message: "participant 오류" };
  }
};
export const createTeacher = async (formdata: FormData) => {
  try {
    await connectToMongoDB();
    //
    let teachers = formdata.get("teachers") as string;
    let teachersParser = JSON.parse(teachers);

    for (const teacher of teachersParser) {
      let teacherData = await Teacher.findOne({ email: teacher.email });
      if (!teacherData) {
        console.log("없음");
        const hash = await bcrypt.hash("intekplus2024", 10);
        let createStudent = await Teacher.create({
          status: 1,

          type: teacher.type,
          email: teacher.email,
          password: hash,
          username: teacher.username,
          aproved: true,
          directCreate: true,
        });
      }
    }
    revalidatePath("/admin/account/teacher");
    return {
      data: JSON.stringify(teachers),
    };
  } catch (e) {
    console.log(e);
    return { message: "participant 오류" };
  }
};

export const approveParticipant = async (studentId: string) => {
  await connectToMongoDB();
  try {
    const participant = await Participant.findOneAndUpdate(
      {
        _id: studentId,
      },
      {
        aproved: true,
        status: 1,
      }
    );
    revalidatePath("/admin/account/student");
    return {
      data: JSON.stringify(participant),
    };
  } catch (e) {
    console.log(e);
    return { message: "participant 오류" };
  }
};
