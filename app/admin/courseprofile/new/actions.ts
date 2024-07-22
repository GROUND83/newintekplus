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
import ReadershipCompetency from "@/models/readershipCompetency";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

//
export async function getJobSubGroup(jobGroup: string) {
  //
  const client = await connectToMongoDB();
  try {
    if (jobGroup === "전체") {
      let jobCompetency = await JobCompetency.find({
        company: "intekplus",
      }).populate({
        path: "group",
        model: JobGroup,
        populate: [{ path: "jobprofile", model: JobProfile }],
      });
      let newArray = [];
      for (const jobCompetencydata of jobCompetency) {
        for (const group of jobCompetencydata.group) {
          newArray.push(group);
        }
      }
      console.log("jobGroup", newArray);
      return { data: JSON.stringify({ group: newArray }) };
    } else {
      let jobCompetency = await JobCompetency.findOne({
        company: "intekplus",
        title: jobGroup,
      }).populate({
        path: "group",
        model: JobGroup,
        populate: [{ path: "jobprofile", model: JobProfile }],
      });
      console.log("jobGroup", jobCompetency);
      return { data: JSON.stringify(jobCompetency) };
    }
  } catch (e) {
    return { message: e };
  }
}
export async function getComPetency(competency: string) {
  //
  const client = await connectToMongoDB();
  try {
    if (competency === "공통 역량") {
      const data = await CommonCompetency.find({}).populate({
        path: "competencys",
        model: CompetencyDictionary,
        select: "type title",
      });

      console.log("jobGroup", data);
      return { data: JSON.stringify(data) };
    } else if (competency === "리더십 역량") {
      //
      const data = await ReadershipCompetency.find({}).populate({
        path: "competencys",
        model: CompetencyDictionary,
        select: "type title",
      });
      return { data: JSON.stringify(data) };
    } else if (competency === "직무 역량") {
      //
      const data = await JobCompetency.find({ company: "intekplus" }).populate({
        path: "group",
        model: JobGroup,
        populate: [
          {
            path: "jobprofile",
            model: JobProfile,
            populate: [
              {
                path: "competencys",
                model: CompetencyDictionary,
                select: "type title",
              },
            ],
          },
        ],
      });
      let newArray = [];
      console.log("job", data);
      data.forEach((item) => {
        item.group.forEach((group: any) => {
          group.jobprofile.forEach((jobprofile: any) => {
            jobprofile.competencys.forEach((competency: any) => {
              let index = newArray.findIndex(
                (ele) => ele._id === competency._id
              );
              if (index > -1) {
              } else {
                newArray.push(competency);
              }
            });
          });
        });
      });
      console.log("newArray", newArray);
      return { data: JSON.stringify(newArray) };
    } else if (competency === "전체") {
      const jobcompetencies = await CompetencyDictionary.find({});
      return { data: JSON.stringify(jobcompetencies) };
    }
  } catch (e) {
    return { message: e };
  }
}

export async function createCourseProfile(formData: FormData) {
  //
  const title = formData.get("title") as string;
  const eduTarget = formData.get("eduTarget") as string;
  const jobGroup = formData.get("jobGroup") as string;
  const jobSubGroup = formData.get("jobSubGroup") as string;
  const eduPlace = formData.get("eduPlace") as string;
  const eduForm = formData.get("eduForm") as string;
  const eduAbilitys = formData.get("eduAbilitys") as string;
  const eduAbilityData = JSON.parse(eduAbilitys);
  const competency = formData.get("competency") as string;
  const courseDirective_file = formData.get("courseDirective_file") as File;
  const courseWholeDirective_file = formData.get(
    "courseWholeDirective_file"
  ) as File;
  try {
    let couserProfile = await CourseProfile.create({
      title,
      eduTarget: eduTarget ? eduTarget : "",
      jobGroup,
      jobSubGroup,
      eduPlace,
      eduForm,
      eduAbilitys: eduAbilityData,
      competency,
    });
    //
    if (courseDirective_file) {
      let courseDirective_filename = Buffer.from(
        courseDirective_file.name,
        "latin1"
      ).toString("utf8");
      let newFormData = new FormData();
      newFormData.append("file", courseDirective_file);
      newFormData.append("folderName", "courseDirective");
      const upload = await UploadFile(newFormData);
      console.log("uplaod", upload);
      if (upload) {
        let { location } = upload as UploadResponse;
        let courseDirective = await CourseDirective.create({
          LessonDirectiveURL: location,
          contentSize: courseDirective_file.size,
          contentfileName: courseDirective_filename,
        });
        //
        await CourseProfile.findOneAndUpdate(
          {
            _id: couserProfile._id,
          },
          {
            courseDirective: courseDirective,
          }
        );
      }
    }
    //
    if (courseWholeDirective_file) {
      let courseWholeDirective_file_filename = Buffer.from(
        courseWholeDirective_file.name,
        "latin1"
      ).toString("utf8");
      let newFormData = new FormData();
      newFormData.append("file", courseWholeDirective_file);
      newFormData.append("folderName", "courseWholeDirective");
      const upload = await UploadFile(newFormData);
      console.log("uplaod", upload);
      if (upload) {
        let { location } = upload as UploadResponse;
        let courseDirective = await CourseDirective.create({
          LessonDirectiveURL: location,
          contentSize: courseWholeDirective_file.size,
          contentfileName: courseWholeDirective_file_filename,
        });
        //
        await CourseProfile.findOneAndUpdate(
          {
            _id: couserProfile._id,
          },
          {
            courseWholeDirective: courseDirective,
          }
        );
      }
    }
    return { data: JSON.stringify(couserProfile) };
  } catch (e) {
    return {
      message: e,
    };
  }
}
