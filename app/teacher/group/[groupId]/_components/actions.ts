"use server";
import { connectToMongoDB } from "@/lib/db";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonActivity from "@/models/lessonActivity";
import LessonResult from "@/models/lessonResult";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Participant from "@/models/participant";
import ResultSurvey from "@/models/resultSurvey";
import Teacher from "@/models/teacher";

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
    console.log("data", groups);
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
  console.log(groupId);
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
          let resultSurvey = await ResultSurvey.create({
            liveSurveyId: groupData?.liveSurvey
              ? groupData.liveSurvey?._id
              : null,
            groupId: groupData._id,
            lessonActivityId: activity._id,
            title: groupData.liveSurvey ? groupData.liveSurvey?.title : null,
            onwer: [participant],
          });
          let lessonResults = await LessonResult.create({
            lessonActivityId: activity._id,
            groupId: groupData._id,
            courseProfieId: groupData.courseProfile._id,
            moduleId: moduledata._id,
            lessonId: lesson._id,
            onwer: participant,
            liveSurvey: groupData.liveSurvey ? groupData.liveSurvey?._id : null,
            resultSurvey: resultSurvey,
            // servays:
            //   courserProfile.eduForm === "집합교육" ? lesson.servay : null,
          });
          lessonResultArray.push(lessonResults);
        }
      }
    }
    let groupUpdate = await Group.findOneAndUpdate(
      { _id: groupData._id },
      {
        lessonResults: lessonResultArray,
        lessonActivitys: lessonActivityArray,
        status: "개설완료",
      }
    );
    return { data: JSON.stringify(groupUpdate) };
  } else {
    return { message: "error" };
  }
}
