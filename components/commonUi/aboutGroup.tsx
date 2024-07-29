import dayjs from "dayjs";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { SquareArrowOutDownRight } from "lucide-react";
import { Badge } from "../ui/badge";

export function StudentWrap({
  participants,
  height,
}: {
  participants: any;
  height: string;
}) {
  return (
    <div className="w-full">
      <p className="text-neutral-500">참여자 {participants.length}명</p>
      <ScrollArea className={`w-full flex flex-col ${height}`}>
        <div className="flex flex-col w-full gap-1 mt-2">
          {participants.map((item: any, index: any) => {
            return (
              <div
                key={item._id}
                className="py-2 w-full  px-3 flex flex-row items-center gap-2  border  rounded-sm"
              >
                <p className="w-[50px]  text-center">{item.jobPosition}</p>
                <p className="w-[70px]  text-center">{item.username}</p>
                <p className="pl-2">{item.email}</p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export function LeaderWrap({ teacher }: { teacher: any }) {
  return (
    <div className=" w-full">
      <p className="text-neutral-500">리더</p>
      <p>
        {teacher.username} - {teacher.email}
      </p>
    </div>
  );
}
export function PeriodWrap({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  return (
    <div className="w-full">
      <p className="text-neutral-500">교육기간</p>
      <p>
        {dayjs(startDate).format("YYYY-MM-DD")} ~{" "}
        {dayjs(endDate).format("YYYY-MM-DD")}
      </p>
    </div>
  );
}

export function GroupTitle({ name }: { name: String }) {
  return (
    <div className=" w-full ">
      <p className="text-neutral-500">그룹명</p>

      <p className="">{name}</p>
    </div>
  );
}
export function CourseProfileDataWrap({
  courseProfile,
}: {
  courseProfile: any;
}) {
  return (
    <div className=" w-full flex flex-col gap-2">
      <p className="text-neutral-500">코스프로파일</p>
      {courseProfile ? (
        <div className=" w-full   flex flex-col gap-2">
          <Link
            href={`/admin/courseprofile/${courseProfile?._id}`}
            className="flex flex-row items-center gap-2 hover:text-primary underline"
          >
            <SquareArrowOutDownRight className="size-4" />
            <p>
              {courseProfile?.eduForm} -{courseProfile?.title}
            </p>
          </Link>
        </div>
      ) : (
        <div className=" w-full   flex flex-col gap-2 bg-neutral-100 p-2 border rounded-sm">
          <p className="text-neutral-500">
            코스프로파일이 배정되지 않았습니다.
          </p>
        </div>
      )}
    </div>
  );
}

export function SurveyDataWrap({ liveSurvey }: { liveSurvey: any }) {
  return (
    <div className=" w-full flex flex-col gap-2">
      <p className="text-neutral-500">설문</p>
      {liveSurvey ? (
        <div className=" w-full   flex flex-col gap-2">
          <Link
            href={`/admin/evaluation/${liveSurvey?._id}`}
            className="flex flex-row items-center gap-2 hover:text-primary underline"
          >
            <SquareArrowOutDownRight className="size-4" />
            <p>{liveSurvey?.title}</p>
          </Link>
        </div>
      ) : (
        <div className=" w-full   flex flex-col gap-2 bg-neutral-100 p-2 border rounded-sm">
          <p className="text-neutral-500">설문이 배정되지 않았습니다.</p>
        </div>
      )}
    </div>
  );
}
