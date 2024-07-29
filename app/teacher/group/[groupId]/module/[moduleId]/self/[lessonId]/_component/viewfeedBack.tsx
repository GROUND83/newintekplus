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
export default function ViewFeedBack({
  lessonResult,
  getLessonData,
}: {
  lessonResult: any;
  getLessonData: () => void;
}) {
  const [evaluationOepn, setEvaluationOepn] = React.useState(false);

  return (
    <div>
      <Button
        onClick={() => setEvaluationOepn(true)}
        variant="outline"
        color="primary"
        size="sm"
      >
        확인
      </Button>

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
            <DialogTitle>피드백</DialogTitle>
            <DialogDescription>피드백 내용을 확인합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center gap-3 mt-3">
            <p>대상</p>
            <p>{lessonResult.onwer.username}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="py-3 border-b w-full">
              <p>제목</p>
              <p>{lessonResult.feedBack.title}</p>
            </div>
            <div className="py-3 border-b w-full min-h-[300px]">
              <p>내용</p>
              <p className=" whitespace-pre">
                {lessonResult.feedBack.description}
              </p>
            </div>
            <div className="py-3 border-b w-full">
              <p>첨부파일</p>
              <a
                href={lessonResult.feedBack.contentdownloadURL}
                download={lessonResult.feedBack.contenFileName}
                target="_blank"
              >
                {lessonResult.feedBack.contenFileName}
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
