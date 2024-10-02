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
  LogOut,
  Megaphone,
  Settings,
  SquareLibrary,
} from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import React from "react";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { usePathname } from "next/navigation";
import { ProfileButton } from "@/components/commonUi/menuButton";
import { ScrollArea } from "@/components/ui/scroll-area";
// JobCompetency
const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const [menuExpend, setMenuExpend] = React.useState(true);

  // const session = useSession();
  // console.log("session", session);
  const pathname = usePathname();
  return (
    <QueryClientProvider client={queryClient}>
      <div className=" h-screen w-screen flex flex-row items-stretch ">
        <ScrollArea className="h-[100vh] flex flex-col bg-[#001529]">
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
              <div className="p-2">
                {menuExpend ? (
                  <Link
                    href={"/admin"}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <p className=" text-lg font-semibold">관리자</p>
                    <p>대쉬보드</p>
                  </Link>
                ) : (
                  <Link href={"/admin"}>
                    <Home strokeWidth={1.25} />
                  </Link>
                )}
              </div>

              <Button onClick={() => setMenuExpend(!menuExpend)} size={"icon"}>
                {!menuExpend ? (
                  <ArrowRightFromLine strokeWidth={1.25} className="size-4" />
                ) : (
                  <ArrowLeftFromLine strokeWidth={1.25} className="size-4" />
                )}
              </Button>
            </div>
            <div className="w-full flex-1">
              <div className="flex flex-row items-center gap-2 py-2 px-6">
                {/* <Settings strokeWidth={1.25} /> */}
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>시스템</p>
                  </div>
                )}
              </div>

              <Link
                href={"/admin/wholenotice"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/wholenotice")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <Megaphone strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>공지사항</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/accounts/teacher"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/accounts")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <CircleUserRound strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>계정관리</p>
                  </div>
                )}
              </Link>
              <div className={`flex flex-row items-center gap-2 py-2 px-6 `}>
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p className="">교육 컴포넌트</p>
                  </div>
                )}
              </div>

              <Link
                href={"/admin/group"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/group")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <Group strokeWidth={1.25} />

                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>학습 그룹</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/complete/personal"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/complete")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <BarChartHorizontalBig strokeWidth={1.25} />

                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>이수 현황</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/courseprofile"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/courseprofile")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <BookCopy strokeWidth={1.25} />

                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>코스프로파일</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/lessonlibrary"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/lessonlibrary")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <BookCheck strokeWidth={1.25} />

                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>레슨 라이브러리</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/evaluation"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("admin/evaluation")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <ListChecks strokeWidth={1.25} />

                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>평가/설문</p>
                  </div>
                )}
              </Link>

              <div className="flex flex-row items-center gap-2 py-2 px-6">
                {/* <Settings strokeWidth={1.25} /> */}
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>역량모델링</p>
                  </div>
                )}
              </div>
              <Link
                href={"/admin/ability/dictionary"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/admin/ability/dictionary")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <CircleUserRound strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>역량사전</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/ability/common"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/admin/ability/common")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <Megaphone strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>공통역량</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/ability/taskability/base?type=일반직군"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/admin/ability/taskability")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <CircleUserRound strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>직무역량</p>
                  </div>
                )}
              </Link>
              <Link
                href={"/admin/ability/leadership"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/admin/ability/leadership")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <CircleUserRound strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>리더십역량</p>
                  </div>
                )}
              </Link>

              <div className="flex flex-row items-center gap-2 py-2 px-6">
                {/* <Settings strokeWidth={1.25} /> */}
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>직무쳬계</p>
                  </div>
                )}
              </div>

              <Link
                href={"/admin/dutysystem"}
                className={`flex flex-row items-center gap-2 w-full ${
                  pathname.includes("/admin/dutysystem")
                    ? "bg-primary hover:bg-primary/50  text-white"
                    : "bg-[#0C2135] hover:bg-primary hover:text-white"
                }  py-3 px-6 text-neutral-400   transition-all`}
              >
                <CircleUserRound strokeWidth={1.25} />
                {menuExpend && (
                  <div className="flex flex-row items-center gap-2">
                    <p>직무쳬계</p>
                  </div>
                )}
              </Link>
            </div>
            <div className="bg-[#08111b] w-full flex flex-col items-center border-t border-[#152b45]">
              {/* <ProfileButton /> */}
              <Link
                className="py-6 gap-2 flex flex-col"
                href={"/admin/profile"}
              >
                {menuExpend ? (
                  <p>프로필</p>
                ) : (
                  <Avatar className="bg-white flex flex-col items-center justify-center">
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                )}
              </Link>
            </div>
          </div>
        </ScrollArea>

        <div className=" flex-1 flex flex-col items-stretch bg-neutral-100 h-screen  ">
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
