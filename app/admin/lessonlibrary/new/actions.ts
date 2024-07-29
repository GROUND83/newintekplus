"use server";

import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import Lesson from "@/models/lesson";
import LessonContent from "@/models/lessonContents";
import LessonDirective from "@/models/lessonDirective";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function createLessonLibrary(formData: FormData) {
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const property = formData.get("property") as string;
  const evaluation = formData.get("evaluation") as string;
  const lessonHour = formData.get("lessonHour") as string;
  const contentdescription = formData.get("contentdescription") as string;
  const lessonContentData = formData.get("lessonContent") as string;
  const contentFile = formData.getAll("contentFile") as [];
  const lessonContent = JSON.parse(lessonContentData);
  console.log("contentFile", contentFile, lessonContent);
  try {
    const client = await connectToMongoDB();
    //   학습교안 있을때
    console.log("file", file);
    if (file) {
      console.log("file", file);
      let filename = Buffer.from(file.name, "latin1").toString("utf8");

      console.log("file", file, filename);
      //   const fileWithCorrectName = new File([file]);
      let newFormData = new FormData();
      newFormData.append("file", file);
      newFormData.append("folderName", "lessonLibrary");
      const upload = await UploadFile(newFormData);
      console.log("uplaod", upload);

      if (upload) {
        let { location } = upload as UploadResponse;

        let lessonDirective = await LessonDirective.create({
          LessonDirectiveURL: location,
          contentdescription: contentdescription || "",
          contentfileName: filename,
          contentSize: file.size,
        });

        //
        let lesson = await Lesson.create({
          title,
          property,
          description,
          evaluation,
          lessonHour: Number(lessonHour),
          lessonDirective: lessonDirective,
        });
        if (lessonContent.length > 0) {
          for (const index in lessonContent) {
            if (lessonContent[index].file) {
              //
              const contentFile = formData.get(`contentFile_${index}`) as File;
              console.log("contentFile_", contentFile);
              let contentFileFormData = new FormData();
              contentFileFormData.append("file", contentFile);
              contentFileFormData.append("folderName", "lessonContents");
              const upload = await UploadFile(contentFileFormData);
              console.log("uplaod", upload);
              if (upload) {
                let { location } = upload as UploadResponse;
                //
                let lessonContenFileName = Buffer.from(
                  contentFile.name,
                  "latin1"
                ).toString("utf8");
                let lessonContentdata = await LessonContent.create({
                  type: lessonContent[index].type,
                  lessonContentdownloadURL: location,
                  lessonContendescription:
                    lessonContent[index].lessonContendescription || "",
                  link: lessonContent[index].link || "",
                  lessonContenFileName: lessonContenFileName,
                  lessonContentSize: contentFile.size,
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
            } else {
              //
              let lessonContentdata = await LessonContent.create({
                type: lessonContent[index].type,
                lessonContentdownloadURL: "",
                contentdescription:
                  lessonContent[index].lessonContendescription || "",
                link: lessonContent[index].link || "",
                lessonContenFileName: "",
                lessonContentSize: "",
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
        } else {
          //
        }

        return { data: JSON.stringify(lesson) };
      } else {
        return { message: "업로드 에러" };
      }
    } else {
      // 학습교안 없을때
      let lesson = await Lesson.create({
        title,
        property,
        description,
        evaluation,
        lessonHour: Number(lessonHour),
      });
      console.log("lesson", lesson);
      if (lessonContent.length > 0) {
        for (const index in lessonContent) {
          if (lessonContent[index].file) {
            //
            const contentFile = formData.get(`contentFile_${index}`) as File;
            console.log("contentFile_", contentFile);
            let contentFileFormData = new FormData();
            contentFileFormData.append("file", contentFile);
            contentFileFormData.append("folderName", "lessonContents");
            const upload = await UploadFile(contentFileFormData);
            console.log("uplaod", upload);
            if (upload) {
              let { location } = upload as UploadResponse;
              //
              let lessonContenFileName = Buffer.from(
                contentFile.name,
                "latin1"
              ).toString("utf8");
              let lessonContentdata = await LessonContent.create({
                type: lessonContent[index].type,
                lessonContentdownloadURL: location,
                contentdescription:
                  lessonContent[index].lessonContendescription,
                link: lessonContent[index].link,
                lessonContenFileName: lessonContenFileName,
                lessonContentSize: contentFile.size,
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
          } else {
            //
            let lessonContentdata = await LessonContent.create({
              type: lessonContent[index].type,
              lessonContentdownloadURL: "",
              lessonContendescription:
                lessonContent[index].lessonContendescription || "",
              link: lessonContent[index].link || "",
              lessonContenFileName: "",
              lessonContentSize: undefined,
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
    }
  } catch (e) {
    console.log(e);
    return { message: e };
  }
}
