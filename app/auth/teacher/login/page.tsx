"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "이메일을 입력하세요." }),
  password: z.string(),
});

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  // const router = useRouter();
  // const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // console.log("data", data);
    try {
      setLoading(true);
      let result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "teacher",
        type: "email",
        callbackUrl: "/teacher",
        redirect: true,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center ">
      <div className="flex flex-col items-center gap-12  w-[800px]">
        <Logo />

        <p className="text-3xl">리더 로그인</p>
        {/* <div className="flex flex-row items-center gap-6">
          <Button>교육생</Button>
          <Button>리더</Button>
          <Button>평가자</Button>
        </div>
        <p>계정의 따로 생성할 필요가 있는가?</p> */}
        <Form {...form}>
          <form
            className="flex flex-col gap-6 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="이메일을 입력하세요."
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="비밀번호를 입력하세요."
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-6" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : "로그인"}
            </Button>
          </form>
        </Form>
        <section className="flex flex-row items-center gap-3  px-6  mt-24 h-6">
          <Link
            href={"/auth/findpassword"}
            className=" flex flex-row items-center gap-2 text-base"
          >
            <LockClosedIcon className="size-4" />
            비밀번호 찾기
          </Link>
        </section>
        <Link href={"/"}>홈</Link>
        <p className="text-sm text-neutral-500">
          {new Date().getFullYear()} © provied by SMARTAL Inc.
        </p>
      </div>
    </main>
  );
}
