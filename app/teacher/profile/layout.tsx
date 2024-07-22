"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
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
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between">
        <p>프로필</p>
        <AlertDialog>
          <AlertDialogTrigger className="flex flex-row items-center gap-2">
            <LogOut className="size-4" />
            로그아웃
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
      <div className=" flex-1 flex flex-col items-stretch bg-neutral-100 ">
        {children}
      </div>
    </div>
  );
}
