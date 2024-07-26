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
// import { findPass } from "./actions";
import { useRouter } from "next/navigation";
import { resetPass } from "./actions";
import React from "react";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  password: z.string({
    required_error: "비밀번호를 입력하세요.",
  }),
});
export default function Page({ params }: { params: { auth: string } }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  //
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("token", params.auth);
    setLoading(true);
    try {
      let res = await resetPass(formData);
      if (res.data) {
        //
        toast.success("비밀번호 제설정에 성공하였습니다.");
        console.log("res", res.data);
        let resdata = JSON.parse(res.data);
        if (resdata.type === "student") {
          router.push("/auth/participant/login");
        } else if (resdata.type === "teacher") {
          router.push("/auth/teacher/login");
        } else if (resdata.type === "admin") {
          router.push("/auth/admin/login");
        }
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
      <p className="text-lg font-bold">비밀번호 변경</p>
      <p className="mt-3">변경할 비밀번호를 입력하세요.</p>
      <div className="max-w-[80vw] min-w-[50vw] mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <FormItem className="flex flex-col col-span-12 gap-2">
                  <FormLabelWrap title="비밀번호" required />
                  <Input
                    type="password"
                    value={value || ""}
                    onChange={onChange}
                    placeholder="변경할 비밀번호을 입력하세요."
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
                  <p>비밀번호 재설정</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
