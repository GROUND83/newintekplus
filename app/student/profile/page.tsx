"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const session = useSession();
  return (
    <div>
      <div className="w-full grid grid-cols-12 gap-3 flex-1  p-3 ">
        <div className="  flex flex-col  col-span-6 bg-white border p-12">
          <span>이메일</span>
          <p>{session?.data?.user.email}</p>
        </div>
        <div className="  flex flex-col  col-span-6 bg-white border p-12">
          <Link href={"/admin/profile/changepass"}>비밀번호 변경</Link>
        </div>
      </div>
    </div>
  );
}
