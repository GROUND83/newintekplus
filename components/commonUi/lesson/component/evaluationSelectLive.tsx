"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { updataLessonResultPointLive } from "@/components/commonActions/commonActions";
import { toast } from "sonner";

export default function evaluationSelectLive({
  lessonResultId,
  setEvaluationOepn,
  getLessonData,
}: {
  lessonResultId: string;
  setEvaluationOepn: (value: any) => void;
  getLessonData: () => void;
}) {
  const [select, setSelct] = React.useState<any>(-1);
  const clickdone = async () => {
    //
    console.log(select);
    setEvaluationOepn(false);
    //
    try {
      let res = await updataLessonResultPointLive({
        lessonResultId,
        point: select,
      });
      if (res.data) {
        console.log("res", JSON.parse(res.data));
        //
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
          variant={select === 3 ? "default" : "outline"}
          onClick={() => setSelct(3)}
        >
          <p>PASSED</p>
        </Button>
      </div>
      <Button onClick={() => clickdone()} size="sm" disabled={select < 0}>
        평가하기
      </Button>
    </div>
  );
}
