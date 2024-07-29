"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { updataLessonResultPoint } from "./actions";
import { toast } from "sonner";

export default function EvaluationSelectEdit({
  lessonResultId,
  setEvaluationOepn,
  getLessonData,
  point,
}: {
  lessonResultId: string;
  setEvaluationOepn: (value: any) => void;
  getLessonData: () => void;
  point: number;
}) {
  const [select, setSelct] = React.useState<any>(point);
  const clickdone = async () => {
    //
    console.log(select);
    setEvaluationOepn(false);
    //
    try {
      let res = await updataLessonResultPoint({
        lessonResultId,
        point: select,
      });
      if (res.data) {
        console.log("res", JSON.parse(res.data));
        //
        toast.success("평가 업데이트가 성공하였습니다.");
        setEvaluationOepn(false);
        getLessonData();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e);
    }

    //
  };
  return (
    <div className="w-full flex flex-col gap-6">
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
      <Button onClick={() => clickdone()} size="sm" disabled={select < 0}>
        평가하기
      </Button>
    </div>
  );
}
