"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const session = useSession();
  return (
    <div>
      <div className="w-full grid grid-cols-12 gap-3 flex-1  p-3 ">
        <div className="  flex flex-col  col-span-12 bg-white border p-12">
          <span>이메일</span>
          <p>{session?.data?.user.email}</p>
        </div>

        <div>
          <Button asChild>
            <Link href={"/teacher/profile/changepass"}>비밀번호 변경</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
