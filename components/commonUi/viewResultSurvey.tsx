"use client";
import ActionModal from "@/components/commonUi/ActionModal";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React from "react";

export default function ViewResultSurveyt({
  resultSurvey,
}: {
  resultSurvey: any;
}) {
  const [open, setOpen] = React.useState(false);
  console.log("resultSurveyresultSurvey", resultSurvey);
  return (
    <div className="">
      <ActionModal
        open={open}
        setOpen={setOpen}
        title={"설문 확인"}
        desc={"설문 내용을 확인합니다."}
        trigger={
          <Button size="xs" className="flex flex-row items-center gap-2">
            <Search className="size-3" />
            설문확인
          </Button>
        }
        onClick={() => {}}
        btnText=""
      >
        <div className="flex flex-col w-full gap-2">
          {resultSurvey &&
            resultSurvey.results.map((item: any, index: any) => {
              return (
                <div
                  key={item._id}
                  className={`flex ${
                    item.type === "객관식"
                      ? "flex-row items-center"
                      : "flex-col items-start"
                  } gap-3 border-b py-3 justify-between`}
                >
                  <p>
                    {index + 1}. {item.title}
                  </p>
                  {item.type === "객관식" ? (
                    <p>{item.point}점</p>
                  ) : (
                    <p className=" whitespace-pre-wrap">{item.answer}</p>
                  )}
                </div>
              );
            })}
        </div>
      </ActionModal>
    </div>
  );
}
