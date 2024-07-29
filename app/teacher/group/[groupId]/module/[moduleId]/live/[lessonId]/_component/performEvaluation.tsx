"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import React from "react";
import EvaluationSelect from "./evaluationSelect";
import EvaluationSelectEdit from "./evaluationSelectEdit";

//
export default function PerformEvaluation({
  lessonResult,
  getLessonData,
}: {
  lessonResult: any;
  getLessonData: () => void;
}) {
  const [evaluationOepn, setEvaluationOepn] = React.useState(false);
  const [evaluationEditOepn, setEvaluationEditOepn] = React.useState(false);
  return (
    <div>
      {lessonResult.isEvaluationDone ? (
        <div className="flex flex-row items-center justify-between w-full gap-3">
          <Badge variant={lessonResult.point === 0 ? "destructive" : "default"}>
            {lessonResult.point === 0
              ? "FAILED"
              : lessonResult.point === 1
              ? "하"
              : lessonResult.point === 2
              ? "중"
              : lessonResult.point === 3
              ? "상"
              : null}
          </Badge>

          <Button
            onClick={() => setEvaluationEditOepn(true)}
            variant="outline"
            color="primary"
            size="sm"
          >
            수정
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setEvaluationOepn(true)}
          variant="outline"
          color="primary"
          size="sm"
        >
          평가하기
        </Button>
      )}

      <Dialog open={evaluationOepn}>
        <DialogContent className="w-[400px] flex flex-col">
          <div className="self-end">
            <Button
              onClick={() => setEvaluationOepn(false)}
              variant="outline"
              color="primary"
              size="sm"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <DialogHeader>
            <DialogTitle>레슨 평가</DialogTitle>
            <DialogDescription>레슨 결과를 업데이트 합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center gap-3 mt-3">
            <p>대상</p>
            <p>{lessonResult.onwer.username}</p>
          </div>
          <EvaluationSelect
            setEvaluationOepn={setEvaluationOepn}
            lessonResultId={lessonResult._id}
            getLessonData={getLessonData}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={evaluationEditOepn}>
        <DialogContent className="w-[400px] flex flex-col">
          <div className="self-end">
            <Button
              onClick={() => setEvaluationEditOepn(false)}
              variant="outline"
              color="primary"
              size="sm"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <DialogHeader>
            <DialogTitle>레슨 평가</DialogTitle>
            <DialogDescription>레슨 평가 업데이트 합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center gap-3 mt-3">
            <p>대상</p>
            <p>{lessonResult.onwer.username}</p>
          </div>
          <EvaluationSelectEdit
            point={lessonResult.point}
            setEvaluationOepn={setEvaluationEditOepn}
            lessonResultId={lessonResult._id}
            getLessonData={getLessonData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
