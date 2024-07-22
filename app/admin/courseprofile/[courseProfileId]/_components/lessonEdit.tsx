"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { deleteLessonFromModule } from "./actions";
import { toast } from "sonner";
import { CircleMinus, Pencil } from "lucide-react";
export default function LessonEdit({
  lesson,
  lessonIndex,
  moduleId,
  getModuleData,
  disabled,
}: {
  lesson: any;
  lessonIndex: number;
  moduleId: string;
  disabled: boolean;
  getModuleData: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  // console.log("lesson", lesson);
  const clickDelete = async () => {
    //
    const formData = new FormData();
    formData.append("moduleId", moduleId);
    formData.append("lessonId", lesson._id);
    try {
      let res = await deleteLessonFromModule(formData);
      if (res.data) {
        //
        toast.success("레슨이 제거 되었습니다.");
        getModuleData();
      } else {
        //
      }
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <div className="w-full p-3 flex flex-row items-center  justify-between  border-b">
      <p className="">{lesson.title}</p>
      <div className="flex flex-row items-center gap-2">
        {disabled ? (
          <Button size="xs" variant="defaultoutline" disabled={disabled}>
            <Pencil className="size-3" />
            레슨 수정
          </Button>
        ) : (
          <Button
            size="xs"
            variant="defaultoutline"
            asChild
            disabled={disabled}
          >
            <Link
              href={`/admin/lessonlibrary/${lesson._id}`}
              className="flex flex-row items-center gap-1"
            >
              <Pencil className="size-3" />
              레슨 수정
            </Link>
          </Button>
        )}

        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button
              size="xs"
              disabled={disabled}
              variant="destructiveoutline"
              onClick={() => setOpen(true)}
              className="flex flex-row items-center gap-1"
            >
              <CircleMinus className="size-3" />
              레슨 제거
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>레슨 제거</DialogTitle>
              <DialogDescription>모듈에서 레슨을 제거합니다.</DialogDescription>
            </DialogHeader>

            <div className="flex items-center space-x-2">
              <div className=" flex-1 flex flex-col gap-6"></div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="outline"
              >
                취소
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => clickDelete()}
              >
                제거
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
