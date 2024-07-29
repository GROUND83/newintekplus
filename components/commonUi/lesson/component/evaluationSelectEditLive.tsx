"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { updataLessonResultPointLive } from "@/components/commonActions/commonActions";
import { toast } from "sonner";

export default function EvaluationSelectEditLive({
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
  const [select, setSelct] = React.useState<any>(point || 0);
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
        toast.success("레슨평가가 업데이트 되었습니다.");
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
      <div>
        <p>
          성공인 경우 집합 교육인 경우 과제제출 완료, 점수 3점, 레슨 성공으로
          업데이트 됩니다.
        </p>
      </div>
      <Button onClick={() => clickdone()} size="sm" disabled={select < 0}>
        수정하기
      </Button>
    </div>
  );
}
