"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  BarChartHorizontalBig,
  BookCheck,
  BookCopy,
  CircleUserRound,
  Group,
  Home,
  ListChecks,
  Megaphone,
  Settings,
  SquareLibrary,
} from "lucide-react";
import type { Metadata } from "next";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const session = useSession();
  const [menuExpend, setMenuExpend] = React.useState(true);
  return (
    <QueryClientProvider client={queryClient}>
      <div className=" h-screen w-screen flex flex-row items-stretch ">
        <div
          className={`${
            menuExpend ? "w-[250px]" : "w-[100px]"
          } h-full bg-[#001529] transition-all flex flex-col items-center text-[#B7BDC2]`}
        >
          <div
            className={`flex   ${
              menuExpend
                ? "flex-row items-center justify-between"
                : "flex-col items-center justify-start gap-2"
            } w-full px-6 py-3`}
          >
            {menuExpend ? (
              <div className={"flex flex-col items-start"}>
                <p className=" text-lg font-semibold">리더</p>
                <p>대쉬보드</p>
              </div>
            ) : (
              <Button size={"icon"} asChild>
                <Link href={"/teacher"}>
                  <Home strokeWidth={1.25} />
                </Link>
              </Button>
            )}

            <Button onClick={() => setMenuExpend(!menuExpend)} size={"icon"}>
              {!menuExpend ? (
                <ArrowRightFromLine strokeWidth={1.25} />
              ) : (
                <ArrowLeftFromLine strokeWidth={1.25} />
              )}
            </Button>
          </div>
          <div className="w-full">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="px-6">
                  <div className="flex flex-row items-center gap-2">
                    <SquareLibrary strokeWidth={1.25} className="size-6" />
                    {menuExpend && (
                      <div className="flex flex-row items-center gap-2">
                        <p className="">교육 컴포넌트</p>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="w-full  flex flex-col items-start justify-center  gap-1">
                  <Link
                    href={"/teacher/group"}
                    className="flex flex-row items-center gap-2 w-full bg-[#0C2135] hover:bg-primary  py-3 px-6 text-neutral-400  hover:text-white transition-all"
                  >
                    <Group strokeWidth={1.25} />

                    {menuExpend && (
                      <div className="flex flex-row items-center gap-2">
                        <p>학습 그룹</p>
                      </div>
                    )}
                  </Link>
                  <Link
                    href={"/teacher/borad"}
                    className="flex flex-row items-center gap-2 w-full bg-[#0C2135] hover:bg-primary  py-3 px-6 text-neutral-400  hover:text-white transition-all"
                  >
                    <BookCheck strokeWidth={1.25} />

                    {menuExpend && (
                      <div className="flex flex-row items-center gap-2">
                        <p>자료</p>
                      </div>
                    )}
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="bg-[#08111b] w-full flex flex-col items-center border-t border-[#152b45]">
            {session?.data?.user && (
              <Link
                className="py-6 gap-2 flex flex-col"
                href={"/teacher/profile"}
              >
                {menuExpend ? (
                  <p>{session?.data?.user.email}</p>
                ) : (
                  <Avatar className="bg-white flex flex-col items-center justify-center">
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                )}
              </Link>
            )}
          </div>
        </div>

        <div className=" flex-1 flex flex-col items-stretch bg-neutral-100 ">
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
