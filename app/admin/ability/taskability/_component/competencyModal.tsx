"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import { Search } from "lucide-react";

export default function CompetencyModal({ data }: { data: any }) {
  console.log("data", data);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs" variant="defaultoutline">
          {data?.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[50vw]">
        <DialogHeader className="w-full border-b py-3">
          <DialogTitle className="flex flex-col items-start gap-2 ">
            <p className="">{data?.title}</p>
          </DialogTitle>
          {/* <DialogDescription>
            {dayjs(notice.updatedAt).format("YYYY-MM-DD")}
          </DialogDescription> */}
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full border-b">
          <div className=" col-span-4 flex flex-col items-start w-full p-6 bg-white gap-2">
            <p className=" text-black">{data.description}</p>
            <div className="grid w-full grid-cols-12 gap-3 ">
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
                <p className="mb-2 font-bold text-black">level 1</p>
                <div className="flex flex-col items-start">
                  {data.level1.map((element: any, index: any) => {
                    return (
                      <p
                        key={index}
                        className="w-full px-2 py-1 m-1 text-black rounded-md bg-neutral-200"
                      >
                        {element}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-12 ">
                <p className="mb-2 font-bold text-black">level 2</p>
                <div className="flex flex-col items-start">
                  {data.level2.map((element: any, index: any) => {
                    return (
                      <p
                        key={index}
                        className="w-full px-2 py-1 m-1 text-black rounded-md bg-neutral-200"
                      >
                        {element}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-12 ">
                <p className="mb-2 font-bold text-black">level 3</p>
                <div className="flex flex-col items-start">
                  {data.level3.map((element: any, index: any) => {
                    return (
                      <p
                        key={index}
                        className="w-full px-2 py-1 m-1 text-black rounded-md bg-neutral-200"
                      >
                        {element}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-12 ">
                <p className="mb-2 font-bold text-black">level 4</p>
                <div className="flex flex-col items-start">
                  {data.level4.map((element: any, index: any) => {
                    return (
                      <p
                        key={index}
                        className="w-full px-2 py-1 m-1 text-black rounded-md bg-neutral-200"
                      >
                        {element}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="  justify-end">
          <Button type="button" variant="destructiveoutline">
            행동역량에서 제거
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
