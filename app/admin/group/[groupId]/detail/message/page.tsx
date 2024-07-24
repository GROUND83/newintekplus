"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  return (
    <div className="w-full flex flex-row items-stretch flex-1  ">
      <ScrollArea className="w-[300px] h-[calc(100vh-140px)] bg-white border-r">
        <div className="p-6 w-full">
          <div className="w-full">
            <p className="text-neutral-500">리더</p>
            <div className="border w-full p-3 flex flex-row items-start justify-between mt-2 rounded-sm">
              <div>
                <p>김아무개</p>
                <p className="text-neutral-400 text-xs">wonchang.k@gmail.com</p>
              </div>
              <div className="w-[40px] h-[40px] rounded-full bg-neutral-100 flex flex-col justify-center items-center">
                <p>3</p>
              </div>
            </div>
          </div>
          <div className="w-full mt-6">
            <p className="text-neutral-500">참가자</p>
            {new Array(10).fill("").map((item, index) => {
              return (
                <div
                  key={index}
                  className="border w-full p-3 flex flex-row items-start justify-between mt-2 rounded-sm"
                >
                  <div>
                    <p>김아무개</p>
                    <p className="text-neutral-400 text-xs">
                      wonchang.k@gmail.com
                    </p>
                  </div>
                  <div className="w-[40px] h-[40px] rounded-full bg-neutral-100 flex flex-col justify-center items-center">
                    <p>3</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      <div className=" h-[calc(100vh-140px)] flex-1">
        <div className="h-[calc(100vh-220px)]">
          <p>chat</p>
        </div>
        <div className="h-[80px] w-full bg-white border-t flex flex-col items-start justify-center px-4">
          <p>chat inpit</p>
        </div>
      </div>
    </div>
  );
}
