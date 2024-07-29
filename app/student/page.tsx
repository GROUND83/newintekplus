"use client";
import { Button } from "@/components/ui/button";
import {
  BarChartHorizontalBig,
  BookCheck,
  CircleArrowRight,
  Group,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { getDashCount } from "./_components/actions";

export default function Page() {
  const [data, setDate] = React.useState<any>();
  const getCount = async () => {
    let res = await getDashCount();
    console.log("Res", res);
    setDate(res);
  };
  React.useEffect(() => {
    getCount();
  }, []);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <p>교육생 대쉬보드</p>
      </div>
      <div className="flex-1 flex flex-col  w-full bg-white ">
        <div className="  p-6 w-full grid grid-cols-12 gap-3">
          <div className="p-3 border col-span-3 h-[200px] flex flex-col items-center   rounded-sm justify-between">
            <div className=" flex-1 flex flex-col items-center justify-center">
              <BookCheck strokeWidth={1.25} />
              <p>전체 공지사항</p>
              {data?.wholeNoticeCount > 0 && (
                <p className="text-xl">{data.wholeNoticeCount}</p>
              )}
            </div>
            <div className="     w-full justify-end flex flex-col items-end">
              <Button asChild size="icon" variant={"ghost"}>
                <Link href={"/student/board"}>
                  <CircleArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-3 border col-span-3 h-[200px] flex flex-col items-center   rounded-sm justify-between">
            <div className=" flex-1 flex flex-col items-center justify-center">
              <Group strokeWidth={1.25} />
              <p>학습그룹</p>
              {data?.groupCount > 0 && (
                <p className="text-xl">{data.groupCount}</p>
              )}
            </div>
            <div className="     w-full justify-end flex flex-col items-end">
              <Button asChild size="icon" variant={"ghost"}>
                <Link href={"/student/group"}>
                  <CircleArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-3 border col-span-3 h-[200px] flex flex-col items-center   rounded-sm justify-between">
            <div className=" flex-1 flex flex-col items-center justify-center">
              <BarChartHorizontalBig strokeWidth={1.25} />
              <p>피드백</p>
              {data?.feedBacksCount > 0 && (
                <p className="text-xl">{data.feedBacksCount}</p>
              )}
            </div>
            <div className="     w-full justify-end flex flex-col items-end">
              <Button asChild size="icon" variant={"ghost"}>
                <Link href={"/student/feedback"}>
                  <CircleArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-3 border col-span-3 h-[200px] flex flex-col items-center   rounded-sm justify-between">
            <div className=" flex-1 flex flex-col items-center justify-center">
              <User strokeWidth={1.25} />
              <p>프로필</p>
            </div>
            <div className="     w-full justify-end flex flex-col items-end">
              <Button asChild size="icon" variant={"ghost"}>
                <Link href={"/student/profile"}>
                  <CircleArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
