import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-12 container mx-auto">
        <Logo />

        <p className="text-3xl">인재육성 교육지원 시스템</p>
        <div className="flex flex-row items-center gap-6">
          <Button asChild>
            <Link href={"/student"}>교육생</Link>
          </Button>
          <Button asChild>
            <Link href={"/teacher"}>리더</Link>
          </Button>
          {/* <Button>리더</Button> */}
          {/* <Button>평가자</Button> */}
        </div>
        {/* <p>계정의 따로 생성할 필요가 있는가?</p> */}
        <Link href={"/admin"}>어드민</Link>
        <p className="text-sm text-neutral-500">
          {new Date().getFullYear()} © provied by SMARTAL Inc.
        </p>
      </div>
    </main>
  );
}
