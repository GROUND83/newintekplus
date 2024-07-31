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
import { approveParticipant } from "../student/_components/table/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 테이블 로우에서 바로
export default function UpdateTableRow({
  id,
  type,
  aproved,
}: {
  id: string;
  type: string;
  aproved: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const onClickApprove = async () => {
    //
    setDeleteLoading(true);
    if (type === "participants") {
      //
      try {
        let res = await approveParticipant(id);
        if (res.data) {
          toast.success("업데이트 성공");
          setOpen(false);
          window.location.reload();
        }
      } catch (e) {
        toast.error(e);
      } finally {
        setDeleteLoading(false);
      }
      //
    }
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {aproved ? (
            <Button
              type="button"
              size="xs"
              className=" "
              variant="defaultoutline"
              disabled={aproved}
            >
              <p>승인 완료</p>
            </Button>
          ) : (
            <Button
              type="button"
              size="xs"
              className=" "
              variant="defaultoutline"
            >
              <p>승인 </p>
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>교육생 승인</AlertDialogTitle>
            <AlertDialogDescription>
              교육생을 승인합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>

            <Button onClick={onClickApprove}>
              {deleteLoading ? (
                <Loader2 className=" animate-spin" />
              ) : (
                <p>승인</p>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
