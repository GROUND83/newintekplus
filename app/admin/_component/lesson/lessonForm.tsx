"use cilent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExclamationCircleIcon as FillExclamtion } from "@heroicons/react/24/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { evaluationMethod, lessonTime, lessonType } from "@/lib/common";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { UploadFile } from "@/lib/fileUploader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
//
export const LessonTitle = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel className="flex flex-row items-center gap-2">
            레슨명
            <FillExclamtion className="size-5 text-primary" />
          </FormLabel>
          <FormControl>
            <Input
              placeholder="레슨명"
              value={value || ""}
              onChange={onChange}
              required
              className="bg-neutral-100"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const LessonProperty = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="property"
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-col col-span-4 gap-2">
          <FormLabel>학습 형태</FormLabel>
          <Select onValueChange={onChange} value={value || ""}>
            <FormControl>
              <SelectTrigger className="bg-neutral-100">
                <SelectValue placeholder="학습형태를 선택하세요." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {lessonType.map((lessontype, index) => {
                return (
                  <SelectItem value={lessontype.value} key={index}>
                    {lessontype.value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const LessonEvaluation = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="evaluation"
      render={({ field }) => (
        <FormItem className="flex flex-col col-span-4 gap-2">
          <FormLabel>평가방법</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger className="bg-neutral-100">
                <SelectValue placeholder="평가방법을 선택하세요." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {evaluationMethod.map((evalation, index) => {
                return (
                  <SelectItem value={evalation.value} key={index}>
                    {evalation.value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export const LessonHour = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="lessonHour"
      render={({ field }) => (
        <FormItem className="flex flex-col col-span-4 gap-2">
          <FormLabel>교육시간</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value.toString() || ""}
          >
            <FormControl>
              <SelectTrigger className="bg-neutral-100">
                <SelectValue placeholder="교육시간을 선택하세요." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {lessonTime.map((lessontime, index) => {
                return (
                  <SelectItem value={lessontime.value} key={index}>
                    {lessontime.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const LessonDescription = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel className="flex flex-row items-center gap-2">
            레슨개요
            <FillExclamtion className="size-5 text-primary" />
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="레슨개요"
              value={value || ""}
              onChange={onChange}
              required
              className=" resize-none bg-neutral-100"
              rows={11}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const LessonDirective = ({ form }: { form: any }) => {
  // console.log("form");
  const [show, setShow] = React.useState(false);
  // const [image, setImage] = React.useState<ImageListType>([]);
  // const onImageChange = async (imageList: ImageListType) => {
  //   //
  //   await setImage(imageList);
  //   if (imageList.length > 0 && (imageList[0].file as File)) {
  //     const formData = new FormData();
  //     formData.append("file", imageList[0].file as File);
  //     formData.append("folderName", "lessonDirective");
  //     //Here I am calling the server action function
  //     const data = await UploadFile(formData);
  //     console.log(data);
  //   }
  // };
  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name="lessonDirective.contentdescription"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel className="flex flex-row items-center gap-2">
              학습{" "}
              {form.getValues("property") === "집합교육"
                ? "교안 설명"
                : "지시문"}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={
                  form.getValues("property") !== "집합교육"
                    ? "과제지시문에 대한 설명을 입력하세요."
                    : `학습교안에 대한 설명을 입력하세요.`
                }
                value={value || ""}
                onChange={onChange}
                className="resize-none bg-neutral-100"
                rows={7}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lessonDirective.file"
        render={({ field: { ref, name, onBlur, onChange } }) => (
          <FormItem className="">
            <FormLabel className="flex flex-row items-center gap-2">
              학습{" "}
              {form.getValues("property") === "집합교육"
                ? "교안 파일"
                : "지시문 파일"}
            </FormLabel>
            {form.getValues("lessonDirective.LessonDirectiveURL") ? (
              <div className="flex flex-row items-center gap-3">
                {show ? (
                  <>
                    <FormControl>
                      <Input
                        type="file"
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        className="bg-neutral-100"
                        onChange={(e) => onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => {
                        form.setValue("file", undefined);
                        setShow(false);
                      }}
                    >
                      취소
                    </Button>
                  </>
                ) : (
                  <>
                    <a
                      href={form.getValues(
                        "lessonDirective.LessonDirectiveURL"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" border px-3 py-2 text-primary border-primary flex-1 flex flex-row items-center gap-3"
                    >
                      <Download className="size-5" />
                      <p className=" line-clamp-1">
                        {form.getValues("lessonDirective.contentfileName")}
                      </p>
                    </a>
                    <Button type="button" onClick={() => setShow(true)}>
                      수정
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-row items-center gap-3">
                <FormControl>
                  <Input
                    type="file"
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </FormControl>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
