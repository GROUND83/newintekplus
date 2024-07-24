"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import DataTable from "./lessonLibrary/table/table";
import { CirclePlus } from "lucide-react";

//
export default function LessonFromLibrary({
  getModuleData,
  moduleId,
  disabled,
}: {
  moduleId: string;
  getModuleData: () => void;
  disabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {}, []);
  return (
    <div className="">
      <Dialog open={open}>
        <DialogTrigger asChild>
          <Button
            variant="defaultoutline"
            size="sm"
            disabled={disabled}
            onClick={() => setOpen(true)}
            className="flex flex-row items-center gap-1"
          >
            <CirclePlus className="size-4" />
            레슨 라이브러리 가져오기
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] h-[90vh] flex flex-col items-start">
          <div className=" flex flex-row items-center justify-between w-full  h-[70px]">
            <div>
              <DialogTitle>레슨 라이브러리 가져오기</DialogTitle>
              <DialogDescription>레슨을 추가하세요.</DialogDescription>
            </div>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              취소
            </Button>
          </div>
          <div className="w-full ">
            <div className="  flex-1 w-full  relative ">
              <DataTable
                setOpen={setOpen}
                getModuleData={getModuleData}
                moduleId={moduleId}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
