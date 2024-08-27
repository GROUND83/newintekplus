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
          <p className=" whitespace-pre">{lessonResult.feedBack.description}</p>
        </div>
        {lessonResult.feedBack.contentdownloadURL && (
          <div className="py-3  w-full">
            <p>첨부파일</p>
            <a
              href={lessonResult.feedBack.contentdownloadURL}
              download={lessonResult.feedBack.contenFileName}
              target="_blank"
            >
              {lessonResult.feedBack.contenFileName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
