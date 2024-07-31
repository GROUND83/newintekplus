"use server";

import { connectToMongoDB } from "@/lib/db";
import { feedBackData } from "@/lib/feedData";
import { resultFeedBack } from "@/lib/resultFeedBack";
import CourseProfile from "@/models/courseProfile";
import FeedBack from "@/models/feedback";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonActivity from "@/models/lessonActivity";
import LessonResult from "@/models/lessonResult";
import LiveSurvey from "@/models/liveSurvey";
import Module from "@/models/module";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";

export async function getMoreData({
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
}) {
  await connectToMongoDB();
  try {
    const query = search
      ? {
          $or: [
            { status: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            // { "teacher.username": { $in: search } },
            // { "courseProfile.title": { $regex: search, $options: "i" } },
          ],
        }
      : {};
    // let pageSize // 페이지당 출력수
    console.log("pageIndex", search, pageIndex);
    const groupCount = await Group.find(query).countDocuments();
    const group = await Group.find(query)
      .populate({ path: "teacher", model: Teacher, select: "_id username " })
      .populate({
        path: "courseProfile",
        model: CourseProfile,
        select: "_id eduform title",
        populate: {
          path: "modules",
          model: Module,
          populate: {
            path: "lessons",
            model: Lesson,
          },
        },
      })
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1))
      .sort({
        createdAt: -1,
      });
    return {
      rows: JSON.stringify(group),
      pageCount: Math.ceil(groupCount / pageSize),
      totalCount: groupCount,
    };
  } catch (e) {
    // console.log(e);
    return { message: "그룹 오류" };
  }
}

export async function getLiveSurvey(groupId: string) {
  let res = await LiveSurvey.find({ groupId: groupId });
  return { data: JSON.stringify(res) };
}

// export async function getTestData() {
//   let newArray = [];

//   let feedBacks = await FeedBack.find({
//     lessonResultId: null,
//   })
//     .populate({
//       path: "participants",
//       model: Participant,
//     })
//     .populate({
//       path: "auth",
//       model: Teacher,
//     })
//     .lean();
//   console.log(feedBacks);
//   for (const feedBack of feedBacks) {
//     if (feedBack.participants) {
//       // let lessonReulst = await LessonResult.find({
//       //   lessonId: feedBack.lessonId,
//       //   onwer: feedBack.participants,
//       // });
//       let group = await Group.findOne({
//         teacher: { $in: [feedBack.auth] },
//         participants: { $in: [feedBack.participants] },
//       })
//         .populate({ path: "teacher", model: Teacher })
//         .populate({ path: "participants", model: Participant })
//         .populate({
//           path: "lessonResults",
//           model: LessonResult,
//           populate: { path: "onwer", model: Participant },
//         })
//         .lean();
//       newArray.push({ ...group, feedBack });
//     }
//     // let lessonId = feedBack.lessonId;
//     // let lessonResult = await LessonResult.findOne({
//     //   _id: feedBack.lessonResultId,
//     // });
//     // if (!feedBack.participants) {
//     //   newArray.push(feedBack);
//     //   console.log("feedBack", feedBack);
//     //   // let updateFeedBack = await FeedBack.deleteOne({
//     //   //   _id: feedBack._id,
//     //   // });
//     // }
//   }
//   // let group = await Group.find({
//   //   "courseProfile.eduForm": { $ne: "집합교육" },
//   //   participants: { $in: [feedBack.participants] },
//   // })
//   //   .populate({ path: "participants", model: Participant })
//   //   .populate({ path: "courseProfile", model: CourseProfile })
//   //   .populate({ path: "lessonResults", model: LessonResult });
//   // }

//   return {
//     data: JSON.stringify(newArray),
//   };
//   // let newDAta = await feedBackData.json();
//   // for await (const feedBack of resultFeedBack) {
//   //   let lessons = await Lesson.find({
//   //     title: feedBack.lessonId.title,
//   //   }).select("_id");
//   //   console.log("lessons", lessons);
//   //   for (const lesson of lessons) {
//   //     let lessonResult = await LessonResult.findOne({
//   //       lessonId: lesson._id,
//   //     }).populate({ path: "onwer", model: Participant });
//   //     if (lessonResult) {
//   //       if (lessonResult.feedBack) {
//   //         newArray.push(lessonResult);
//   //       } else {
//   //         let feedBackdata = await FeedBack.findOne({ _id: feedBack._id });
//   //         let updateLessonResult = await LessonResult.findOneAndUpdate(
//   //           { _id: lessonResult._id },
//   //           {
//   //             feedBack: feedBackdata,
//   //           }
//   //         );
//   //         newArray.push(updateLessonResult);
//   //       }
//   //     }
//   //   }
//   // let feedBackdatadfas = await FeedBack.findOne({ _id: feedBack._id.$oid })
//   //   .populate({ path: "participants", model: Participant })
//   //   .populate({ path: "auth", model: Teacher })
//   //   .populate({ path: "lessonId", model: Lesson });
//   // //
//   // console.log("feedBackdata", feedBackdatadfas);
//   // //   let participants = "";
//   // //   let lesson = await Lesson.findOne({ _id: feedBack.lessonId });
//   // //   console.log("lesson", lesson);
//   // //   if (lesson) {
//   // //     if (feedBack.participants?.$oid !== null) {
//   // //       participants = await Participant.findOne({
//   // //         _id: feedBack.participants.$oid,
//   // //       });
//   // //     } else {
//   // //       participants = "";
//   // //     }
//   // //     if (lesson && participants) {
//   // //       console.log("lesson", lesson._id, participants);
//   // //       let lessonResult = await LessonResult.findOne({
//   // //         // lessonId: lesson._id,
//   // //         onwer: participants,
//   // //       }).lean();
//   // //       newArray.push(lessonResult);
//   // //     }
//   // //   }
//   // //   //
//   // // }
//   // // for (const resultFeed of resultFeedBack) {
//   // //   if (resultFeed.feedBack) {
//   // //     newLessonResult.push(resultFeed);
//   // //   }
//   // // }
//   // //
//   // if (
//   //   feedBackdatadfas.participants &&
//   //   feedBackdatadfas.lessonId &&
//   //   feedBackdatadfas.auth
//   // ) {
//   //   newArray.push(feedBackdatadfas);
//   // }
//   // }

//   // let res = await FeedBack.findOne()
// }
