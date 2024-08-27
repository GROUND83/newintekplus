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
import ViewFeedBack from "@/components/commonUi/lesson/component/viewfeedBack";
import FeedbackSend from "@/components/commonUi/lesson/component/feedback";
import { getLessonResultDetail } from "./actions";
import ViewFeedBackTeacher from "./viewFeedbackteacher";
import FeedbackSendTeacher from "./feedbackTeacher";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function PerformEvaluationTeacherEdit({ data }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [select, setSelct] = React.useState<any>(data.point);
  const [resultData, setResultData] = React.useState<any>();
  const clickdone = async () => {
    //
    console.log(select);
    // setOpen(false);
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
        // setOpen(false);
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="xs">
          평가수정/피드백
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="h-[80vh]  overflow-y-auto">
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
            <p>{dayjs(data.newPerformInfo?.updatedAt).format("YYYY-MM-DD ")}</p>
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
          <div className="w-full  py-6">
            <Button
              type="button"
              onClick={() => clickdone()}
              size="sm"
              disabled={select < 0}
            >
              평가수정
            </Button>
          </div>
          <div className="w-full border-b py-6">
            <p className="font-bold py-3">피드백</p>
            <div className=" col-span-2 bg-white border p-2">
              {resultData?.feedBack ? (
                <div>
                  <ViewFeedBack
                    lessonResult={resultData}
                    getLessonData={getDetail}
                  />
                </div>
              ) : (
                <FeedbackSendTeacher
                  lessonResult={resultData}
                  getLessonData={getDetail}
                />
              )}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
