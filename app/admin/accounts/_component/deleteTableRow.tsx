"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../../../components/ui/button";
import { Loader2 } from "lucide-react";

// 테이블 로우에서 바로
export default function DeleteTableRow({
  id,
  type,
}: {
  id: string;
  type: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const onClickDelete = () => {
    //
    if (type === "participants") {
      //
    }
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            size="xs"
            className=" "
            //   disabled={disabled}
            variant="destructiveoutline"
          >
            <p>삭제</p>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>교육생 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              교육생을 삭제합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>

            <Button onClick={onClickDelete} variant="destructiveoutline">
              {deleteLoading ? (
                <Loader2 className=" animate-spin" />
              ) : (
                <p>준비중</p>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
