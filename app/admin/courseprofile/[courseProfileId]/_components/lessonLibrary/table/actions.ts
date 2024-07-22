"use server";

import { connectToMongoDB } from "@/lib/db";
import Lesson from "@/models/lesson";
import Module from "@/models/module";

export const getLessionLibrary = async ({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}) => {
  await connectToMongoDB();
  try {
    const lessonCount = await Lesson.find().countDocuments();
    const lessonLibrary = await Lesson.find()
      .select("property title createdAt lessonHour evaluation")
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({
        createdAt: -1,
      });
    console.log(pageIndex, pageSize);
    // console.log("lessonLibrary", lessonLibrary);
    return {
      rows: JSON.stringify(lessonLibrary),
      pageCount: lessonCount,
    };
  } catch (e) {
    console.log(e);
    return { message: "레슨라이브러리 오류" };
  }
};

export async function addLesson(formData: FormData) {
  //
  let modulid = formData.get("moduleId");
  let lessonId = formData.get("lessonId");

  let lesson = await Lesson.findOne({ _id: lessonId });
  let moduleData = await Module.findOneAndUpdate(
    {
      _id: modulid,
    },
    {
      $push: {
        lessons: lesson,
      },
    }
  );

  return { data: JSON.stringify(moduleData) };
}
