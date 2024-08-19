"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
export default function Page() {
  const session = useSession();
  console.log("session", session);
  return (
    <div>
      {session.status === "authenticated" ? (
        <div className="w-full grid grid-cols-12 gap-1 flex-1 bg-white  ">
          <div className="flex flex-col  col-span-12 bg-white border px-12 ">
            <div className="w-full border-b py-6">
              <span>이름</span>
              <p>{session?.data?.user.username}</p>
            </div>
            <div className="w-full py-6 flex flex-col items-start justify-center">
              <span>이메일</span>
              <p>{session?.data?.user.email}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-white p-12 col-span-12 border">
            <div>
              <Button asChild>
                <Link href={"/student/profile/changepass"}>비밀번호 변경</Link>
              </Button>
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger
                  className="flex flex-row items-center gap-2"
                  asChild
                >
                  <Button>
                    <LogOut className="size-4" />
                    로그아웃
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>로그아웃</AlertDialogTitle>
                    <AlertDialogDescription>
                      로그아웃 시 로그인으로 이동합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={() => signOut()}>
                      로그아웃
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full  gap-1 flex-1 bg-white flex flex-col  items-center justify-center h-[calc(100vh-70px)] ">
          <Loader2 className=" animate-spin size-4" />
        </div>
      )}
    </div>
  );
}
