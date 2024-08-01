"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import {
  CourseProfileDataWrap,
  LeaderWrap,
  PeriodWrap,
  StudentWrap,
  SurveyDataWrap,
} from "./aboutGroup";
import { useQuery } from "@tanstack/react-query";
import { detailGroup } from "../commonActions/commonActions";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function GroupData() {
  //

  const params = useParams<{ groupId: string }>();
  const fetchDataOptions = {
    groupId: params.groupId,
  };
  const {
    data: groupdata,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    //

    queryKey: ["groupData", fetchDataOptions],
    queryFn: async () => {
      if (fetchDataOptions.groupId) {
        let reponse = await detailGroup(fetchDataOptions.groupId);
        if (reponse.data) {
          let group = JSON.parse(reponse.data);
          console.log("groupData", group);
          return group;
        }
      } else {
        return null;
      }
    },
  });

  return (
    <div className="flex flex-row items-center gap-2">
      <p>학습그룹</p>
      {isLoading && params.groupId && (
        <Skeleton className="w-[200px] h-[30px] rounded-sm bg-neutral-200 ml-6" />
      )}
      {groupdata && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-row items-center gap-2 "
            >
              <Badge variant="defaultOutline">
                {groupdata?.courseProfile?.eduForm}
              </Badge>
              <p>{groupdata.name}</p> <ArrowRightIcon className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="">
            <SheetHeader className="mt-6 flex flex-col">
              <div>
                <Badge variant="defaultOutline">
                  {groupdata?.courseProfile?.eduForm}
                </Badge>
              </div>
              <SheetTitle> {groupdata.name}</SheetTitle>

              <SheetDescription>
                {groupdata.courseProfile.title}
              </SheetDescription>
            </SheetHeader>
            <div className="flex mt-6">
              <PeriodWrap
                startDate={groupdata?.startDate}
                endDate={groupdata?.endDate}
              />
            </div>
            <div className="flex mt-6">
              <LeaderWrap teacher={groupdata?.teacher} />
            </div>
            <div className="flex mt-6">
              <StudentWrap
                participants={groupdata?.participants}
                height="h-[300px]"
              />
            </div>
            <div className="flex mt-6">
              <CourseProfileDataWrap courseProfile={groupdata?.courseProfile} />
            </div>
            <div className="flex mt-6">
              <SurveyDataWrap liveSurvey={groupdata?.liveSurvey} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
