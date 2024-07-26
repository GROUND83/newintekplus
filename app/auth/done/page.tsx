"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  //

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <p className="text-lg text-center text-black">
        입력한 이메일로 임시비밀번호를 발송하였습니다.
      </p>
      <p className="text-lg text-center text-black">
        임시비밀번호로 로그인 하시고 프로필-비밀번호 변경을 통해 비밀번호를
        변경하세요.
      </p>
      <Button asChild className="mt-3">
        <Link href={"/"}>홈으로</Link>
      </Button>
    </div>
  );
}
