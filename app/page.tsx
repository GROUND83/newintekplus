import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3 container mx-auto">
        <Logo />

        <p className="text-2xl ">인재육성 교육지원 시스템</p>
        <div className="flex flex-row items-center gap-6 mt-12">
          <Button
            asChild
            className="h-[200px] w-[200px]"
            variant="defaultoutline"
          >
            <Link href={"/student"} className="flex flex-col items-center">
              <span>교육생</span>
              <span>로그인</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-[200px] w-[200px]"
            variant="defaultoutline"
          >
            <Link href={"/teacher"} className="flex flex-col items-center">
              <span>리더</span>
              <span>로그인</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-[200px] w-[200px]"
            variant="defaultoutline"
          >
            <Link href={"/admin"} className="flex flex-col items-center">
              <span>관리자</span>
              <span>로그인</span>
            </Link>
          </Button>
          {/* <Button>리더</Button> */}
          {/* <Button>평가자</Button> */}
        </div>
        {/* <p>계정의 따로 생성할 필요가 있는가?</p> */}
        <p className="text-sm text-neutral-500 mt-6">
          {new Date().getFullYear()} © provied by SMARTAL Inc.
        </p>
      </div>
    </main>
  );
}
