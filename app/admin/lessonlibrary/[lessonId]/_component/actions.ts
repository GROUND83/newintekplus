"use server";

import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";

import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";
import Lesson from "@/models/lesson";
import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import Group from "@/models/group";
import CourseProfile from "@/models/courseProfile";
import Module from "@/models/module";
export const getLessionLibraryDetail = async ({
  lessonId,
}: {
  lessonId: string;
}) => {
  await connectToMongoDB();
  try {
    const lessonLibrary = await Lesson.findOne({
      _id: lessonId,
    })
      .populate({
        path: "lessonContents",
        select:
          "_id createdAt updatedAt lessonContenFileName lessonContendescription lessonContentSize lessonContentdownloadURL lessoncontentName type link",
      })
      .populate({
        path: "lessonDirective",
        select:
          "_id createdAt updatedAt type LessonDirectiveURL contentName contentSize contentfileName contentdescription",
      });
    let moduleData = await Module.find({
      lessons: { $in: lessonLibrary },
    });
    console.log("moduleData Array", moduleData);

    let courseProfile = await CourseProfile.find({
      modules: {
        $in: moduleData,
      },
    });
    console.log("courseProfile", courseProfile);
    let group = await Group.find({
      status: "개설완료",
      courseProfile: {
        $in: courseProfile,
      },
    });
    console.log("Group", group);
    return {
      data: JSON.stringify(lessonLibrary),
      group: JSON.stringify(group),
    };
  } catch (e) {
    console.log(e);
    return { message: "레슨라이브러리 오류" };
  }
};

export async function updateLessonLibrary(formData: FormData) {
  const lessonId = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const property = formData.get("property") as string;
  const evaluation = formData.get("evaluation") as string;
  const lessonHour = formData.get("lessonHour") as string;
  const lessonDirectivce = formData.get("lessonDirectivce") as string;

  // const lessonDirective_file = formData.get("lessonDirective_file") as File;
  // const lessonDirective_id = formData.get("lessonDirective_id") as string;
  // const lessonDirective_contentdescription = formData.get(
  //   "lessonDirective_contentdescription"
  // ) as string;
  try {
    const client = await connectToMongoDB();
    //   학습교안 있을때
    console.log("lessonDirectivce", lessonDirectivce);
    let lesson = await Lesson.findOneAndUpdate(
      { _id: lessonId },
      {
        title,
        property,
        description,
        evaluation,
        lessonHour: Number(lessonHour),
      }
    );
    if (lessonDirectivce) {
      let lessonDirectivceData = JSON.parse(lessonDirectivce);
      if (lessonDirectivceData._id) {
        await LessonDirective.findOneAndUpdate(
          {
            _id: lessonDirectivceData._id,
          },
          {
            LessonDirectiveURL: lessonDirectivceData.LessonDirectiveURL,
            contentdescription: lessonDirectivceData.contentdescription || "",
            contentfileName: lessonDirectivceData.contentfileName,
            contentSize: lessonDirectivceData.contentSize,
          }
        );
      } else {
        let lessonDirective = await LessonDirective.create({
          LessonDirectiveURL: lessonDirectivceData.LessonDirectiveURL,
          contentdescription: lessonDirectivceData.contentdescription || "",
          contentfileName: lessonDirectivceData.contentfileName,
          contentSize: lessonDirectivceData.contentSize,
        });
        let lesson = await Lesson.findOneAndUpdate(
          { _id: lessonId },
          {
            title,
            property,
            description,
            evaluation,
            lessonHour: Number(lessonHour),
            lessonDirective: lessonDirective,
          }
        );
      }
      //   const fileWithCorrectName = new File([file]);

      console.log("lesson", lesson);
      return { data: JSON.stringify(lesson) };
    }
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}

export async function getContentsData(lessonId: string) {
  //
  await connectToMongoDB();
  try {
    const lessonLibrary = await Lesson.findOne({
      _id: lessonId,
    }).populate({
      path: "lessonContents",
      select:
        "_id createdAt updatedAt lessonContenFileName lessonContendescription lessonContentSize lessonContentdownloadURL lessoncontentName type link",
    });

    return {
      data: JSON.stringify(lessonLibrary),
    };
  } catch (e) {
    console.log(e);
    return { message: "레슨라이브러리 오류" };
  }
}

export async function addContentEdit({
  lessonId,
  contentType,
}: {
  lessonId: string;
  contentType: string;
}) {
  //
  console.log("lessonId", lessonId, contentType);
  try {
    let lessonContent = await LessonContent.create({
      type: contentType,
    });
    let lesson = await Lesson.findOneAndUpdate(
      {
        _id: lessonId,
      },
      {
        $push: {
          lessonContents: lessonContent,
        },
      }
    );
    return { data: "ok" };
  } catch (e) {
    return { message: "error" };
  }
}

export async function deleteContent({
  lessonId,
  contentId,
}: {
  lessonId: string;
  contentId: string;
}) {
  //
  try {
    let lessonContent = await LessonContent.findOne({
      _id: contentId,
    });
    let lesson = await Lesson.findOneAndUpdate(
      {
        _id: lessonId,
      },
      {
        $pull: {
          lessonContents: lessonContent._id,
        },
      }
    );
    let lessonContentdelete = await LessonContent.deleteOne({
      _id: contentId,
    });
    return { data: "ok" };
  } catch (e) {
    return { message: "error" };
  }
}

export async function editContent(formData: FormData) {
  //
  const lessonContentId = formData.get("_id") as string;
  const lessonId = formData.get("lessonId") as string;
  const lessonContent = formData.get("lessonContent") as string;
  let lessonContentdata = JSON.parse(lessonContent);

  console.log("lessonContentId", lessonContentId);
  try {
    let updateContent = await LessonContent.findOneAndUpdate(
      {
        _id: lessonContentId,
      },
      {
        link: lessonContentdata.link,
        lessonContenFileName: lessonContentdata.lessonContenFileName,
        lessonContendescription: lessonContentdata.lessonContendescription,
        type: lessonContentdata.type,
        lessonContentdownloadURL: lessonContentdata.lessonContentdownloadURL,
      }
    );

    return { data: JSON.stringify(updateContent) };
  } catch (e) {
    return { message: e };
  }
}
export async function editContenWithFile(formData: FormData) {
  //
  const lessonId = formData.get("id") as string;
  const lessonContendescription = formData.get(
    "lessonContendescription"
  ) as string;
  const link = formData.get("link") as string;
  const type = formData.get("type") as string;

  const file = formData.get("file") as File;
  let filename = Buffer.from(file.name, "latin1").toString("utf8");

  console.log("file", file, filename);
  //   const fileWithCorrectName = new File([file]);
  let newFormData = new FormData();
  newFormData.append("file", file);
  newFormData.append("folderName", "lessonContent");
  const upload = await UploadFile(newFormData);
  console.log("uplaod", upload);
  try {
    if (upload) {
      let { location } = upload as UploadResponse;
      let updateContent = await LessonContent.findOneAndUpdate(
        {
          _id: lessonId,
        },
        {
          link,
          lessonContenFileName: filename,
          lessonContendescription,
          type,
          lessonContentdownloadURL: location,
        }
      );
      return { data: JSON.stringify(updateContent) };
    } else {
      return { message: "error" };
    }
  } catch (e) {
    return { message: e };
  }
}

export async function deleteLesson(lessonId: string) {
  //
  let res = await Lesson.deleteOne({
    _id: lessonId,
  });
  console.log("res", res);
  return { data: JSON.stringify(res) };
}
