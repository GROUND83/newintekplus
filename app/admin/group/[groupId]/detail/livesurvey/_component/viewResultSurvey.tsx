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

export default function ViewResultSurvey({
  resultSurvey,
}: {
  resultSurvey: any;
}) {
  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="xs">설문확인</Button>
        </DialogTrigger>
        <DialogContent className="w-[50vw]">
          <DialogHeader>
            <DialogTitle>설문 화인</DialogTitle>
            <DialogDescription>설문 내용을 확인합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col w-full gap-2">
            {resultSurvey.results.map((item: any, index: any) => {
              return (
                <div
                  key={item._id}
                  className="flex flex-row items-center gap-3 border-b py-3 justify-between"
                >
                  <p>
                    {index + 1}. {item.title}
                  </p>
                  <p>{item.point}점</p>
                </div>
              );
            })}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
