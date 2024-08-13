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
import { SearchIcon, XIcon } from "lucide-react";
import React from "react";

//
export default function CommonView({
  data,
}: //   getLessonData,
{
  data: any;
  //   getLessonData: () => void;
}) {
  const [evaluationOepn, setEvaluationOepn] = React.useState(false);

  return (
    <div>
      <Button
        onClick={() => setEvaluationOepn(true)}
        variant="outline"
        color="primary"
        size="icon"
      >
        <SearchIcon className="size-4" />
      </Button>

      <Dialog open={evaluationOepn}>
        <DialogContent className="w-[70vw] flex flex-col">
          <div className="self-end">
            <Button
              onClick={() => setEvaluationOepn(false)}
              variant="outline"
              color="primary"
              size="xs"
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          <div className=" col-span-4 flex flex-col items-start w-full p-6 bg-white border rounded-md">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="px-3 py-1 text-blue-700 border-blue-700 rounded-md border bg-blue-700/20">
                {data.title}
              </p>
              <div>
                <Button variant="outline" size="sm">
                  제거
                </Button>
              </div>
            </div>
            <p className="mt-6 text-black">{data.description}</p>
            <div className="grid w-full grid-cols-12 gap-3 mt-6">
              <div className="col-span-12">
                <p className="mb-2 font-bold text-black">하위 요소</p>
                <div className="flex flex-row items-center flex-wrap gap-1">
                  {data.subElements?.map((element: any, index: any) => {
                    return (
                      <p
                        key={index}
                        className="px-2 py-1  text-black rounded-md bg-neutral-200"
                      >
                        {element}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-12 ">
                <p className="mb-2 font-bold text-black">행동 지표</p>
                <ul className="flex flex-col w-full gap-1 pl-3">
                  {data.behaviorIndicator?.map((behavior: any, index: any) => {
                    return (
                      <li key={index} className=" text-black list-disc">
                        {behavior}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
