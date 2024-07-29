"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlignRight,
  ArrowRightIcon,
  MoveRight,
  ScanSearch,
  SearchCheckIcon,
  SearchIcon,
} from "lucide-react";
import {
  CourseProfileDataWrap,
  LeaderWrap,
  PeriodWrap,
  StudentWrap,
  SurveyDataWrap,
} from "./aboutGroup";
export default function GroupData({ group }: { group: any }) {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex flex-row items-center gap-2 ">
            <Badge variant="defaultOutline">
              {group?.courseProfile?.eduForm}
            </Badge>
            <p>{group.name}</p> <ArrowRightIcon className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="">
          <SheetHeader className="mt-6 flex flex-col">
            <div>
              <Badge variant="defaultOutline">
                {group?.courseProfile?.eduForm}
              </Badge>
            </div>
            <SheetTitle> {group.name}</SheetTitle>

            <SheetDescription>{group.courseProfile.title}</SheetDescription>
          </SheetHeader>
          <div className="flex mt-6">
            <PeriodWrap startDate={group?.startDate} endDate={group?.endDate} />
          </div>
          <div className="flex mt-6">
            <LeaderWrap teacher={group?.teacher} />
          </div>
          <div className="flex mt-6">
            <StudentWrap
              participants={group?.participants}
              height="h-[300px]"
            />
          </div>
          <div className="flex mt-6">
            <CourseProfileDataWrap courseProfile={group?.courseProfile} />
          </div>
          <div className="flex mt-6">
            <SurveyDataWrap liveSurvey={group?.liveSurvey} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
