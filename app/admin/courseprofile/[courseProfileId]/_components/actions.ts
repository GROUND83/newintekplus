"use server";
import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import CommonCompetency from "@/models/commonCompetency";
import CompetencyDictionary from "@/models/competencyDictionanry";
import CourseDirective from "@/models/courseDirective";
import CourseProfile from "@/models/courseProfile";
import JobCompetency from "@/models/jobCompetency";
import JobGroup from "@/models/jobGroup";
import JobProfile from "@/models/jobProfile";
import Lesson from "@/models/lesson";
import Module from "@/models/module";
import ReadershipCompetency from "@/models/readershipCompetency";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function createModule(formData: FormData) {
  const courseProfileId = formData.get("courseProfileId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  try {
    let moduledata = await Module.create({
      title,
      description: description || "",
    });
    let courseProfile = await CourseProfile.findOneAndUpdate(
      {
        _id: courseProfileId,
      },
      {
        $push: {
          modules: moduledata,
        },
      }
    );
    return { data: JSON.stringify(moduledata) };
  } catch (e) {
    //
    return { message: e };
  }
}
export async function editModule(formData: FormData) {
  const moduleId = formData.get("moduleId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  try {
    let moduledata = await Module.findOneAndUpdate(
      { _id: moduleId },
      {
        title,
        description: description || "",
      }
    );

    return { data: JSON.stringify(moduledata) };
  } catch (e) {
    //
    return { message: e };
  }
}
export async function moduleDetailId(moduleId: string) {
  try {
    let moduledata = await Module.findOne({
      _id: moduleId,
    }).select("_id title description");

    return { data: JSON.stringify(moduledata) };
  } catch (e) {
    //
    return { message: e };
  }
}
export async function moduleDetail(courseProfileId: string) {
  try {
    let moduledata = await CourseProfile.findOne({
      _id: courseProfileId,
    }).populate({
      path: "modules",
      model: Module,
      populate: {
        path: "lessons",
        model: Lesson,
      },
    });

    return { data: JSON.stringify(moduledata) };
  } catch (e) {
    //
    return { message: e };
  }
}

export async function deleteLessonFromModule(formData: FormData) {
  let moduleId = formData.get("moduleId");
  let lessonId = formData.get("lessonId");
  try {
    console.log(moduleId, lessonId);
    let lesson = await Lesson.findOne({ _id: lessonId });
    console.log("lesson", lesson);
    let moduledata = await Module.findOneAndUpdate(
      {
        _id: moduleId,
      },
      {
        $pull: {
          lessons: lesson._id,
        },
      }
    ).exec();
    console.log("moduledata", moduledata);
    return { data: JSON.stringify(moduledata) };
  } catch (e) {
    //
    return { message: e };
  }
}
export async function deleteModuleFromCourseProfile(formData: FormData) {
  let moduleId = formData.get("moduleId");
  let courseProfileId = formData.get("courseProfileId");
  try {
    console.log(moduleId, courseProfileId);
    let modulesData = await Module.findOne({ _id: moduleId });
    console.log("modulesData", modulesData);
    let courseProfile = await CourseProfile.findOneAndUpdate(
      {
        _id: courseProfileId,
      },
      {
        $pull: {
          modules: modulesData._id,
        },
      }
    );
    console.log("courseProfile", courseProfile);
    return { data: JSON.stringify(courseProfile) };
  } catch (e) {
    //
    return { message: e };
  }
}
