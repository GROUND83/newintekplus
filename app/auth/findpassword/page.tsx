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
import { findPass } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Loader2 } from "lucide-react";
const FormSchema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력하세요.",
    })
    .email("이메일 형식이 아닙니다."),
});
export default function Page() {
  //
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  //
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    const type = searchParams.get("type");
    console.log("searchParams", type);
    console.log("values", values);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("type", type);
    try {
      let res = await findPass(formData);
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
      console.log("message", e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <p className="text-lg font-bold">비밀번호 찾기</p>
      <p className="mt-3">비밀번호를 찾고자하는 이메일을 입력해주세요.</p>
      <div className="max-w-[80vw] min-w-[50vw] mt-6">
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
                {loading ? <Loader2 className=" animate-spin" /> : <p>다음</p>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
