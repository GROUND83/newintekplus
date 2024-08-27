"use client";

import React from "react";
import ActionModal from "@/components/commonUi/ActionModal";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import EvaluationSelect from "@/components/commonUi/lesson/component/evaluationSelect";
import { updataLessonResultPoint } from "@/components/commonActions/commonActions";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getLessonResultDetail } from "./actions";
import { useQuery } from "@tanstack/react-query";
import ViewFeedBack from "@/components/commonUi/lesson/component/viewfeedBack";
import FeedbackSend from "@/components/commonUi/lesson/component/feedback";
export default function PerformEvaluationTeacher({ data }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [select, setSelct] = React.useState<any>(-1);
  const [resultData, setResultData] = React.useState<any>();
  const clickdone = async () => {
    //
    console.log(select);
    setOpen(false);
    //
    try {
      let res = await updataLessonResultPoint({
        lessonResultId: data._id,
        point: select,
      });
      if (res.data) {
        console.log("res", JSON.parse(res.data));
        //
        toast.success("평가 업데이트가 성공하였습니다.");
        setOpen(false);
        // getLessonData();
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e);
    }

    //
  };

  const getDetail = async () => {
    let res = await getLessonResultDetail(data._id);
    if (res.data) {
      let lessonResult = JSON.parse(res.data);
      console.log("lessonResult", lessonResult);
      setResultData(lessonResult);
      //   return lessonResult;
    }
  };
  React.useEffect(() => {
    if (open) {
      getDetail();
    }
  }, [open]);
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="defaultoutline" size="xs">
            평가하기
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>과제수행 평가</AlertDialogTitle>
            <AlertDialogDescription>
              과제수행 평가를 합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full">
            <div className="w-full border-b py-6">
              <p>과제 제출</p>
              <a
                className=" underline  hover:text-primary cursor-pointer"
                href={data.newPerformInfo?.lessonPerformdownloadURL}
                download={data.newPerformInfo?.lessonPerformdownloadURL}
                target="_black"
              >
                {data.newPerformInfo?.lessonPerformFileName}
              </a>
            </div>

            <div className="w-full border-b py-6">
              <p>과제 제출일</p>
              <p>
                {dayjs(data.newPerformInfo?.updatedAt).format("YYYY-MM-DD ")}
              </p>
            </div>
            <div className="w-full border-b py-6">
              <div className="flex flex-row items-center gap-1">
                <Button
                  variant={select === 0 ? "destructiveoutline" : "outline"}
                  onClick={() => setSelct(0)}
                >
                  <p>FAILED</p>
                </Button>
                <Button
                  variant={select === 1 ? "default" : "outline"}
                  onClick={() => setSelct(1)}
                >
                  <p>하</p>
                </Button>
                <Button
                  variant={select === 2 ? "default" : "outline"}
                  onClick={() => setSelct(2)}
                >
                  <p>중</p>
                </Button>
                <Button
                  variant={select === 3 ? "default" : "outline"}
                  onClick={() => setSelct(3)}
                >
                  <p>상</p>
                </Button>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button
                onClick={() => clickdone()}
                size="sm"
                disabled={select < 0}
              >
                평가하기
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
