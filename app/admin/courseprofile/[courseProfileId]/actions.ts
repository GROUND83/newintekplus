"use server";
import { connectToMongoDB } from "@/lib/db";
import { UploadFile } from "@/lib/fileUploader";
import CommonCompetency from "@/models/commonCompetency";
import CompetencyDictionary from "@/models/competencyDictionanry";
import CourseDirective from "@/models/courseDirective";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import JobCompetency from "@/models/jobCompetency";
import JobGroup from "@/models/jobGroup";
import JobProfile from "@/models/jobProfile";
import ReadershipCompetency from "@/models/readershipCompetency";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";

export async function detailCourseProfile(courseProfileId: string) {
  try {
    let courseProfile = await CourseProfile.findOne({
      _id: courseProfileId,
    })
      .populate({ path: "courseDirective", model: CourseDirective })
      .populate({ path: "courseWholeDirective", model: CourseDirective });
    console.log("courseProfile", courseProfile);
    let group = await Group.find({
      status: "개설완료",
      courseProfile: courseProfile,
    });
    console.log("group", group);
    return {
      data: JSON.stringify(courseProfile),
      group: JSON.stringify(group),
    };
  } catch (e) {
    //
    return { message: e };
  }
}

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
        select: "groupName",
        populate: [{ path: "jobprofile", model: JobProfile }],
      });
      let newArray = [];
      for (const jobCompetencydata of jobCompetency) {
        for (const group of jobCompetencydata.group) {
          newArray.push(group);
        }
      }
      // console.log("jobGroup", newArray);
      return { data: JSON.stringify({ group: newArray }) };
    } else {
      let jobCompetency = await JobCompetency.findOne({
        company: "intekplus",
        title: jobGroup,
      }).populate({
        path: "group",
        model: JobGroup,
        select: "groupName",
        populate: [{ path: "jobprofile", model: JobProfile }],
      });
      // console.log("jobGroup", jobCompetency);
      return { data: JSON.stringify(jobCompetency) };
    }
  } catch (e) {
    return { message: e };
  }
}
export async function getComPetency(competency: string) {
  //
  // console.log("jobcompetencies", competency);
  const client = await connectToMongoDB();
  try {
    if (competency === "공통 역량") {
      const data = await CommonCompetency.find({}).populate({
        path: "competencys",
        model: CompetencyDictionary,
        select: "type title",
      });

      // console.log("jobGroup", data);
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
      // console.log("newArray", newArray);
      return { data: JSON.stringify(newArray) };
    } else if (competency === "전체") {
      const jobcompetencies = await CompetencyDictionary.find({});
      // console.log("jobcompetencies", jobcompetencies);
      return { data: JSON.stringify(jobcompetencies) };
    }
  } catch (e) {
    return { message: e };
  }
}

export async function updateCourseProfile(formData: FormData) {
  //
  const id = formData.get("_id") as string;
  const title = formData.get("title") as string;
  const eduTarget = formData.get("eduTarget") as string;
  const jobGroup = formData.get("jobGroup") as string;
  const jobSubGroup = formData.get("jobSubGroup") as string;
  const eduPlace = formData.get("eduPlace") as string;
  const eduForm = formData.get("eduForm") as string;
  const eduAbility = formData.get("eduAbility") as string;
  const eduAbilityData = JSON.parse(eduAbility);
  const competency = formData.get("competency") as string;
  const courseDirective = formData.get("courseDirective") as any;
  const courseWholeDirective = formData.get("courseWholeDirective") as any;
  try {
    let couserProfile = await CourseProfile.findOneAndUpdate(
      { _id: id },
      {
        title,
        eduTarget,
        jobGroup,
        jobSubGroup,
        eduPlace,
        eduForm,
        eduAbilitys: eduAbilityData,
        competency,
      }
    );
    //
    if (courseDirective) {
      let courseDirectiveData = JSON.parse(courseDirective);
      let courseDirectivecreate = await CourseDirective.create({
        LessonDirectiveURL: courseDirectiveData.LessonDirectiveURL,
        contentSize: courseDirectiveData.contentSize,
        contentfileName: courseDirectiveData.contentfileName,
      });
      await CourseProfile.findOneAndUpdate(
        {
          _id: id,
        },
        {
          courseDirective: courseDirectivecreate,
        }
      );
    }
    //
    if (courseWholeDirective) {
      let courseWholeDirectiveData = JSON.parse(courseWholeDirective);
      let courseWholeDirectivecreate = await CourseDirective.create({
        LessonDirectiveURL: courseWholeDirectiveData.LessonDirectiveURL,
        contentSize: courseWholeDirectiveData.contentSize,
        contentfileName: courseWholeDirectiveData.contentfileName,
      });
      await CourseProfile.findOneAndUpdate(
        {
          _id: id,
        },
        {
          courseWholeDirective: courseWholeDirectivecreate,
        }
      );
    }
    return { data: JSON.stringify(couserProfile) };
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}

export async function deleteCourseProfile(courseProfileId: string) {
  let res = await CourseProfile.deleteOne({
    _id: courseProfileId,
  });
  return { data: JSON.stringify(res) };
}
