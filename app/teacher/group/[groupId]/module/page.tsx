"use client";

import React from "react";
import { getModuleList } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { groupId: string } }) {
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="flex-1 flex flex-col  w-full h-full items-center justify-center">
        <p>학습리스트를 선택하세요.</p>
      </div>
    </div>
  );
}
