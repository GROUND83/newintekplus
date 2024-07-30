"use server";

import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import Lesson from "@/models/lesson";
import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function createLessonLibrary(formData: FormData) {
  // const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const property = formData.get("property") as string;
  const evaluation = formData.get("evaluation") as string;
  const lessonHour = formData.get("lessonHour") as string;
  const lessonDirectivce = formData.get("lessonDirectivce") as string;
  const newContent = formData.get("newContent") as string;
  // const contentdescription = formData.get("contentdescription") as string;
  // const lessonContentData = formData.get("lessonContent") as string;
  // const contentFile = formData.getAll("contentFile") as [];
  // const lessonContent = JSON.parse(lessonContentData);
  // console.log("contentFile", contentFile, lessonContent);

  try {
    await connectToMongoDB();
    //   학습교안 있을때
    let lesson = await Lesson.create({
      title,
      property,
      description,
      evaluation,
      lessonHour: Number(lessonHour),
    });
    if (lessonDirectivce) {
      console.log("lessonDirectivce", lessonDirectivce);
      const lessonDirectiveData = JSON.parse(lessonDirectivce);
      let lessonDirective = await LessonDirective.create({
        LessonDirectiveURL: lessonDirectiveData.LessonDirectiveURL || "",
        contentdescription: lessonDirectiveData.contentdescription || "",
        contentfileName: lessonDirectiveData.contentfileName || "",
        contentSize: lessonDirectiveData.contentSize || "",
      });
      await Lesson.findOneAndUpdate(
        {
          _id: lesson._id,
        },
        {
          lessonDirective: lessonDirective,
        },
        { upsert: true }
      );
    }
    if (newContent) {
      const newContentData = JSON.parse(newContent);

      if (newContentData.length > 0) {
        for (const lessonContent of newContentData) {
          let lessonContentdata = await LessonContent.create({
            type: lessonContent.type,
            lessonContentdownloadURL:
              lessonContent.lessonContentdownloadURL || "",
            lessonContendescription:
              lessonContent.lessonContendescription || "",
            link: lessonContent.link || "",
            lessonContenFileName: lessonContent.lessonContenFileName || "",
            lessonContentSize: lessonContent.size || undefined,
          });
          await Lesson.findOneAndUpdate(
            {
              _id: lesson._id,
            },
            {
              $push: {
                lessonContents: lessonContentdata,
              },
            },
            { upsert: true }
          );
        }
      }
    }
    return { data: JSON.stringify(lesson) };
    //
  } catch (e) {
    console.log(e);
    return { message: e };
  }
}
