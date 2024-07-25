"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { ChevronDown, PlusIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { detailGroup } from "./[groupId]/_components/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const [group, setGroup] = React.useState<any>();
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  const getGroup = async () => {
    if (params.groupId) {
      let res = await detailGroup(params.groupId);
      if (res.data) {
        let group = JSON.parse(res.data);
        console.log("group", group);
        setGroup(group);
      }
    } else {
      setGroup(null);
    }
  };
  React.useEffect(() => {
    getGroup();
  }, [params]);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        {group ? (
          <div className="flex flex-row items-center gap-2 bg-primary text-white px-3 py-2">
            <p>{group?.courseProfile?.eduForm}</p>{" "}
          </div>
        ) : (
          <p>학습그룹</p>
        )}

        <div className="flex flex-row items-center gap-3">
          {group && (
            <div className="flex flex-row items-center gap-3 border px-3 py-2 bg-neutral-100">
              <p>그룹명</p>
              <p>{group?.name}</p>
            </div>
          )}
          {group && (
            <div className="flex flex-row items-center gap-3 border px-3 py-2 bg-neutral-100">
              <p>리더</p>
              <p>{group?.teacher.username}</p>
            </div>
          )}
          {group && (
            <Popover>
              <PopoverTrigger className=" bg-neutral-100 hover:bg-primary hover:text-white transition-colors">
                {
                  <div className="flex flex-row items-center gap-3 border px-3 py-2 ">
                    <p>참가자</p>
                    <p>{group?.participants.length}명</p>
                    <ChevronDown className="size-3" />
                  </div>
                }
              </PopoverTrigger>
              <PopoverContent className="w-[600px]">
                <ScrollArea className="max-h-[500px] w-full flex flex-col">
                  <div className=" grid grid-cols-12  gap-2    w-full">
                    {group?.participants.map((item: any, index: any) => {
                      return (
                        <div
                          key={item._id}
                          className=" col-span-12 grid grid-cols-12 gap-3 border bg-neutral-100 px-3 py-2"
                        >
                          <p className=" col-span-3 "> {item?.jobPosition}</p>
                          <p className=" col-span-3"> {item?.username}</p>
                          <p className=" col-span-3"> {item?.email}</p>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
          {group && (
            <div className="flex flex-row items-center gap-3 border px-3 py-2 bg-neutral-100">
              <p>학습그룹 데이터 다운 작업중</p>
              {/* <p>{group?.teacher.username}</p> */}
            </div>
          )}
        </div>
        {pathname === "/admin/group" && (
          <Button asChild size={"sm"}>
            <Link
              href={"/admin/group/new"}
              className="flex flex-row items-center gap-2"
            >
              <PlusIcon className="size-4" />
              학습그룹 생성
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
