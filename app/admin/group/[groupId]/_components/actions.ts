"use server";
import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonActivity from "@/models/lessonActivity";
import LessonPerform from "@/models/lessonPerform";
import LessonResult from "@/models/lessonResult";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Notice from "@/models/notice";
import Participant from "@/models/participant";
import ResultSurvey from "@/models/resultSurvey";
import Teacher from "@/models/teacher";
import mongoose from "mongoose";

export async function detailGroup(groupId: string) {
  //
  await connectToMongoDB();
  try {
    let groups = await Group.findOne({ _id: groupId })
      .populate({
        path: "teacher",
        model: Teacher,
      })
      .populate({
        path: "liveSurvey",
        model: LiveSurvey,
      })

      .populate({
        path: "participants",
        model: Participant,
      })
      .populate({
        path: "courseProfile",
        model: CourseProfile,
        populate: {
          path: "modules",
          model: Module,
          populate: {
            path: "lessons",
            model: Lesson,
          },
        },
      });
    // console.log("data", groups);
    return { data: JSON.stringify(groups) };
  } catch (e) {
    return { message: e };
  }
}

export async function getLiveSurvey({ groupId }: { groupId: string }) {
  //
  console.log(groupId);
  let liveSurvey = await LiveSurvey.find();

  return { data: JSON.stringify(liveSurvey) };
}

export async function updateLiveSurvey({
  groupId,
  surveyId,
}: {
  groupId: string;
  surveyId: string;
}) {
  //
  // console.log(groupId);
  let liveSurvey = await LiveSurvey.findOne({ _id: surveyId });
  let group = await Group.findOneAndUpdate(
    {
      _id: groupId,
    },
    {
      liveSurvey: liveSurvey,
    }
  );

  return { data: JSON.stringify(group) };
}
// 상태를 바꾸고
// 참가자 순회 하면서
//레슨 result 생성
// resultsurvey 생성
//
export async function updateGroupStatus({ groupId }: { groupId: string }) {
  //
  // console.log(groupId);
  //
  try {
    let groupData = await Group.findOne({ _id: groupId })
      .populate({
        path: "teacher",
        model: Teacher,
      })
      .populate({
        path: "liveSurvey",
        model: LiveSurvey,
      })
      .populate({
        path: "participants",
        model: Participant,
      })
      .populate({
        path: "courseProfile",
        model: CourseProfile,
        populate: {
          path: "modules",
          model: Module,
          populate: {
            path: "lessons",
            model: Lesson,
          },
        },
      });
    // 1. 레슨 결과 생성
    // 2. 레슨 액티비티 생성
    // 3. 레슨 서베이 결과 생성
    // 체크사항
    // 코스프로파일인 모듈을 가져야하고 모듈은 레슨이 있어야된다.
    // 집합교육은 liveSurvey를 가져야된다.

    // 설정 완료 되었을때 코스프로 파일이 변경되면, 완료된 그룹은 꼬이게 된다. 코스프로파일 수정 안되게 막아야된다. 모듈. 레슨또한

    //

    // 1.레슨을 루프돌면서 레슨엑티비티 생성
    // 2.그룹의 참여자를 루푸돌면서 레슨결과 생성
    // 3. 그룹에 설뮨결과와 레슨결과 추가
    // 3. 그룹에 게시판에 환영메세지 추가

    if (groupData) {
      let lessonActivityArray = [];
      let lessonResultArray = [];
      for await (const moduledata of groupData?.courseProfile?.modules) {
        //
        for await (const lesson of moduledata.lessons) {
          //
          let activity = await LessonActivity.create({
            groupId: groupData._id,
            courseProfieId: groupData.courseProfile._id,
            moduleId: moduledata._id,
            lessonId: lesson._id,
            title: lesson.title,
          });
          lessonActivityArray.push(activity);
          // 레슨을 순회 하는동안

          for await (const participant of groupData.participants) {
            // resultSurvey onwer 체크

            let lessonResults = await LessonResult.create({
              lessonActivityId: activity._id,
              groupId: groupData._id,
              courseProfieId: groupData.courseProfile._id,
              moduleId: moduledata._id,
              lessonId: lesson._id,
              onwer: participant,
              liveSurvey: groupData.liveSurvey
                ? groupData.liveSurvey?._id
                : null,
              // resultSurvey: resultSurvey,
              // servays:
              //   courserProfile.eduForm === "집합교육" ? lesson.servay : null,
            });
            lessonResultArray.push(lessonResults);
          }
        }
      }
      // let resultSuveyArray = [];
      // for await (const participant of groupData.participants) {
      //   let resultSurvey = await ResultSurvey.create({
      //     liveSurveyId: groupData?.liveSurvey
      //       ? groupData.liveSurvey?._id
      //       : null,
      //     groupId: groupData._id,
      //     title: groupData.liveSurvey ? groupData.liveSurvey?.title : null,
      //     onwer: participant,
      //   });
      //   resultSuveyArray.push(resultSurvey);
      // }
      let notice = await Notice.create({
        groupId: groupData._id,
        sendTo: "all",
        title: "안녕하세요? 그룹이 성공적으로 개설되었습니다.",
        description: `${Group.name} 과정이 성공적으로 개설되었습니다.\n 문의사항은 intekplus@saloncanvas.kr 으로 문의하세요.`,
      });
      let groupUpdate = await Group.findOneAndUpdate(
        { _id: groupData._id },
        {
          lessonResults: lessonResultArray,
          lessonActivitys: lessonActivityArray,
          status: "개설완료",
          $push: { notices: notice },
          // resultSurvey: resultSuveyArray,
        }
      );
      return { data: JSON.stringify(groupUpdate) };
    } else {
      return { message: "그룹없음" };
    }
  } catch (e) {
    return { message: JSON.stringify(e) };
  }
}

export async function getFeedBackList(groupId: string) {
  //
  try {
    let feedBackList = await LessonResult.find({
      "perform.downUrl": { $ne: null },
    });
    let lessonPerforms = await LessonPerform.find({});
    // for await (let lessonResult of feedBackList) {
    //   //
    //   if (lessonResult.perform.downUrl) {
    //     //
    //     console.log("lessonResult", lessonResult.perform.downUrl);
    //     let perform = await LessonPerform.create({
    //       courseProfileId: lessonResult.courseProfieId,
    //       groupId: lessonResult.groupId,
    //       lessonId: lessonResult.lessonId,
    //       lessonPerformdownloadURL: lessonResult.perform.downUrl,
    //       lessonPerformFileName: lessonResult.perform.fileName,
    //       lessonPerformSize: lessonResult.perform.size,
    //       onwer: lessonResult.onwer,
    //     });
    //     let newRessult = await LessonResult.findOneAndUpdate(
    //       {
    //         _id: lessonResult._id,
    //       },
    //       {
    //         newPerform: perform,
    //       }
    //     );
    //   }
    // }

    //
    // 직접한거 859
    // let filter = feedBackList.filter((item) => item.perform.downUrl);
    // 레슨 퍼폼을 lessson newdp 입력
    // let newArray = [];
    // for await (const lessonPerform of lessonPerforms) {
    //   if (lessonPerform.lessonId) {
    //     console.log("lessonPerform.lessonId", lessonPerform.lessonId);
    //     let lessonResultdata = await LessonResult.findOne({
    //       lessonActivityId: lessonPerform.lessonActivityId,
    //       onwer: lessonPerform.onwer,
    //     });
    //     if (lessonResultdata) {
    //       console.log("lessonResultdata", lessonResultdata);
    //       newArray.push(lessonResultdata);
    //       //
    //     }
    //   }
    // }
    // let filter = feedBackList.filter((item) => item.perform.downUrl);
    return { data: JSON.stringify({ feedBackList }) };
  } catch (e) {
    return { message: e };
  }
}

export async function deleteGroup(groupId: string) {
  try {
    let res = await Group.findOneAndDelete({
      _id: groupId,
    });
    return { data: true };
  } catch (error) {
    return { message: error };
  }
}
