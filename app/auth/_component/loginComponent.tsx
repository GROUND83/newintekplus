"use client";
import React, { Suspense } from "react";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authenticate } from "./actions";

const formSchema = z.object({
  email: z.string().email({ message: "이메일을 입력하세요." }),
  password: z.string(),
});
const LoginWrap = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  console.log("type", type);
  //
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
      let formData = new FormData();
      if (type === "admin") {
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", "admin");
        formData.append("callbackUrl", "/admin");
      }
      if (type === "student") {
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", "participant");
        formData.append("callbackUrl", "/student");
      }
      if (type === "teacher") {
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", "teacher");
        formData.append("callbackUrl", "/teacher");
      }
      //
      let res = await authenticate(formData);
      console.log("res", res);
      if (type === "admin") {
        console.log("이동");
        router.push("/admin");
      }
      if (type === "student") {
        router.push("/student");
      }
      if (type === "teacher") {
        router.push("/teacher");
      }
      if (res) {
        console.log("res", res);
        let resdata = JSON.parse(res);
        if (resdata.passwrod) {
          toast.error(resdata.passwrod);
        }
      } else {
        console.log("res", res, type);
      }
    } catch (e) {
      console.log("ee,", e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-neutral-100 ">
      <div className=" container mx-auto flex flex-col items-center ">
        <div className="flex flex-col items-center gap-12    border p-6 lg:p-12 rounded-md bg-white  w-full lg:w-1/2">
          <Logo />

          <p className="text-2xl font-bold">
            {type === "admin"
              ? "관리자"
              : type === "teacher"
              ? "리더"
              : "교욱생"}{" "}
            로그인
          </p>

          <Form {...form}>
            <form
              className="flex flex-col gap-6 w-full "
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
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  `${
                    type === "admin"
                      ? "관리자"
                      : type === "teacher"
                      ? "리더"
                      : "교욱생"
                  } 로그인`
                )}
              </Button>
            </form>
          </Form>
          <section className="flex flex-row items-center gap-3  px-6  mt-24 h-6">
            <Button asChild variant="outline">
              <Link
                href={`/auth/findpassword?type=${type}`}
                className=" flex flex-row items-center gap-2 text-base"
              >
                <LockClosedIcon className="size-4" />
                비밀번호 찾기
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={"/"}>홈</Link>
            </Button>
          </section>
        </div>
        <div className="py-6">
          <p className="text-sm text-neutral-500">
            {new Date().getFullYear()} © provied by SMARTAL Inc.
          </p>
        </div>
      </div>
    </main>
  );
};
const LoginComponent = () => {
  return (
    <Suspense>
      <LoginWrap />
    </Suspense>
  );
};
export default LoginComponent;
