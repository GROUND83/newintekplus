"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createModule,
  deleteModuleFromCourseProfile,
  editModule,
  moduleDetailId,
} from "./actions";
import { toast } from "sonner";
import FormLabelWrap from "@/components/formLabel";
import { CircleMinus, Pencil } from "lucide-react";

export const FormSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export default function ModuleEdit({
  moduleId,
  getModuleData,
  disabled,
  courseProfileId,
}: {
  moduleId: string;
  getModuleData: () => void;
  disabled: boolean;
  courseProfileId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    const formData = new FormData();
    formData.append("moduleId", moduleId);
    formData.append("title", values.title);
    formData.append("description", values.description);
    //
    try {
      let res = await editModule(formData);
      if (res.data) {
        console.log("resdata", JSON.parse(res.data));
        toast.success("모듈수정에 성공하였습니다.");
        setOpen(false);
        form.reset();
        getModuleData();
      }
    } catch (e) {
      toast.error(e);
    }
  }
  const initData = async () => {
    //
    let res = await moduleDetailId(moduleId);
    if (res.data) {
      let resdata = JSON.parse(res.data);
      form.reset({
        ...resdata,
      });
    }
  };
  React.useEffect(() => {
    initData();
  }, []);

  const clickModuleDelte = async () => {
    //
    const formData = new FormData();
    formData.append("moduleId", moduleId);
    formData.append("courseProfileId", courseProfileId);
    try {
      let res = await deleteModuleFromCourseProfile(formData);
      if (res.data) {
        //
        toast.success("모듈을 삭제 하였습니다.");
        setDeleteOpen(false);
        getModuleData();
      } else {
        //
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="defaultoutline"
          size="xs"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className="flex flex-row items-center gap-1"
        >
          <Pencil className="size-3" />
          모듈수정
        </Button>
        <Button
          variant="destructiveoutline"
          size="xs"
          disabled={disabled}
          onClick={() => setDeleteOpen(true)}
          className="flex flex-row items-center gap-1"
        >
          <CircleMinus className="size-3" />
          모듈삭제
        </Button>
      </div>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>모듈 수정</DialogTitle>
            <DialogDescription>모듈을 수정하세요.</DialogDescription>
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
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="outline"
                >
                  취소
                </Button>
                <Button type="submit">수정</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>모듈 삭제</DialogTitle>
            <DialogDescription>
              모듈을 삭제하면 레슨 또한 모듈에서 모두 제거 됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-row items-center  justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="flex flex-row items-center gap-1"
            >
              취소
            </Button>
            <Button
              variant="destructiveoutline"
              onClick={() => clickModuleDelte()}
              className="flex flex-row items-center gap-1"
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
