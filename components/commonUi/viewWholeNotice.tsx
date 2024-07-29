"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import DownLoadButton from "./downloadButton";
import { Badge } from "../ui/badge";
export default function ViewWholeNotice({ notice }: { notice: any }) {
  console.log("notice", notice);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Search className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader className="w-full border-b py-3">
          <DialogTitle className="flex flex-col items-start gap-2 ">
            {notice?.sendTo === "all" ? (
              <Badge variant="defaultOutline" className="font-normal">
                전체
              </Badge>
            ) : notice?.sendTo === "teacher" ? (
              <Badge variant="secondaryOutline" className="font-normal">
                리더
              </Badge>
            ) : notice?.sendTo === "student" ? (
              <Badge variant="secondaryOutline" className="font-normal">
                교육생
              </Badge>
            ) : null}
            <p className="">{notice?.title}</p>
          </DialogTitle>
          <DialogDescription>
            {dayjs(notice.updatedAt).format("YYYY-MM-DD")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full border-b">
          <div className="flex items-center  w-full">
            <p className=" whitespace-pre-wrap">{notice?.description}</p>
          </div>
        </ScrollArea>
        {/* contenFileName: "과정안내서(신입SOJT)_프로그래밍기초.pdf"
​
contentSize: 623900
​
contentdownloadURL */}
        <div className="w-full border-b pb-3">
          {notice?.contents?.length > 0 &&
            notice?.contents.map((item: any, index: any) => {
              return (
                <DownLoadButton
                  key={item._id}
                  downLoadUrl={item.contentdownloadURL}
                  fileName={item?.contentName}
                />
              );
            })}
          {notice?.contentdownloadURL && (
            <DownLoadButton
              downLoadUrl={notice?.contentdownloadURL}
              fileName={notice?.contenFileName}
            />
          )}
        </div>
        <DialogFooter className="  justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
