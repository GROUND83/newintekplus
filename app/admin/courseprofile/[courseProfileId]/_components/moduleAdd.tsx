"use client";
import FormLabelWrap from "@/components/formLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createModule } from "./actions";
import { toast } from "sonner";
import { CirclePlus } from "lucide-react";

export const FormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export default function ModuleAdd({
  courseProfileId,
  getModuleData,
  disabled,
}: {
  courseProfileId: string;
  getModuleData: () => void;
  disabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    const formData = new FormData();
    formData.append("courseProfileId", courseProfileId);
    formData.append("title", values.title);
    formData.append("description", values.description);
    //
    try {
      let res = await createModule(formData);
      if (res.data) {
        console.log("resdata", JSON.parse(res.data));
        toast.success("모듈생성에 성공하였습니다.");
        setOpen(false);
        form.reset();
        getModuleData();
      }
    } catch (e) {
      toast.error(e);
    }
  }
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          size="sm"
          onClick={() => setOpen(true)}
          className="flex flex-row item-center gap-1"
        >
          <CirclePlus className="size-4" /> 모듈생성
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>모듈 생성</DialogTitle>
          <DialogDescription>모듈을 생성하세요.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="w-full gap-3 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center space-x-2">
              <div className=" flex-1 flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name={`title`}
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabelWrap title="모듈명" required={true} />
                      <Input
                        placeholder="모듈명을 입력하세요."
                        value={value || ""}
                        onChange={onChange}
                        required
                        className="bg-neutral-100"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`description`}
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabelWrap title="세부내용" required={false} />
                      <Textarea
                        placeholder="세부내용을 입력하세요."
                        value={value || ""}
                        onChange={onChange}
                        className="bg-neutral-100 resize-none"
                        rows={8}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="w-full flex flex-row items-center justify-between ">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>

              <Button type="submit" size="sm" className="">
                모듈 생성
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
