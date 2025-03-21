"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormLabelWrap from "@/components/formLabel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { findPass } from "./actions";
const FormSchema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력하세요.",
    })
    .email("이메일 형식이 아닙니다."),
});
const PageWrap = () => {
  //
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  //
  console.log("type", type);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  //
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);

    console.log("values", values);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("type", type);
    try {
      let res = await findPass(formData);
      console.log("res", res);
      if (res.data) {
        //
        console.log(res.data);
        toast.success("이메일 발송에 성공하였습니다.");

        router.push("/auth/done");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      //
      console.log("message", e.message);
      // toast.error(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-neutral-100 ">
      <div className=" container mx-auto flex flex-col items-center ">
        <div className="flex flex-col items-center gap-6    border p-6 lg:p-12 rounded-md bg-white  w-full lg:w-1/2">
          <p className="text-lg font-bold">비밀번호 찾기</p>
          <p className="">비밀번호를 찾고자하는 이메일을 입력해주세요.</p>
          <div className="w-full ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col col-span-12 gap-2">
                      <FormLabelWrap title="이메일" required />
                      <Input
                        value={value || ""}
                        onChange={onChange}
                        placeholder="이메일을 입력하세요."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" w-full flex flex-col items-end">
                  <Button type="submit" className="mt-6" disabled={loading}>
                    {loading ? (
                      <Loader2 className=" animate-spin" />
                    ) : (
                      <p>다음</p>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

const FindPassWordComponet = () => {
  return (
    <Suspense>
      <PageWrap />
    </Suspense>
  );
};
export default FindPassWordComponet;
