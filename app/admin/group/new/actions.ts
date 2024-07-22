"use server";
import CourseProfile from "@/models/courseProfile";
import Group from "@/models/group";
import Lesson from "@/models/lesson";
import LessonActivity from "@/models/lessonActivity";
import LessonResult from "@/models/lessonResult";
import Module from "@/models/module";
import Participant from "@/models/participant";
import ResultSurvey from "@/models/resultSurvey";
import Teacher from "@/models/teacher";
import dayjs from "dayjs";

dayjs.locale("ko");
export async function getSelectInitData() {
  //
  try {
    let reader = await Teacher.find({ aproved: true })
      .select("_id username email")
      .sort({
        username: 1,
      });
    let courseProfile = await CourseProfile.find()
      .populate({
        path: "modules",
        model: Module,
        populate: { path: "lessons", model: Lesson },
      })
      .sort({
        createdAt: -1,
      });
    let participants = await Participant.find({ aproved: true })
      .select("_id username email jobPosition")
      .sort({
        username: 1,
      });
    if (reader) {
      return {
        data: {
          reader: JSON.stringify(reader),
          courseProfile: JSON.stringify(courseProfile),
          participants: JSON.stringify(participants),
        },
      };
    }
  } catch (e) {
    return { message: e };
  }
}

export async function createGroup(formData: FormData) {
  //
  let courseProfileId = formData.get("courseProfileId") as string;
  let teacherId = formData.get("teacherId") as string;
  let name = formData.get("name") as string;
  let startDate = formData.get("startDate") as string;
  let startDateParser = dayjs(startDate, "YYYY-MM-DD").add(9, "hours").toDate();
  let endDate = formData.get("endDate") as string;
  let endDateParser = dayjs(endDate, "YYYY-MM-DD").add(9, "hours").toDate();
  let participants = formData.get("participants") as any;
  let participantsParser = JSON.parse(participants);
  //
  try {
    let courseProfile = await CourseProfile.findOne({
      _id: courseProfileId,
    }).populate({
      path: "modules",
      model: Module,
      populate: { path: "lessons", model: Lesson },
    });
    let teacher = await Teacher.findOne({ _id: teacherId });

    let group = await Group.create({
      name,
      teacher,
      courseProfile,
      startDate: startDateParser,
      endDate: endDateParser,
      participants: participantsParser,
    });

    return { data: JSON.stringify(group) };
  } catch (e) {
    return { message: e };
  }
}
