"use client";

import React from "react";
import {
  deleteLesson,
  getLessionLibraryDetail,
  updateLessonLibrary,
} from "./_component/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonLibrarybaseSchema } from "../_components/lessonLibrarySchema";
import { Form } from "@/components/ui/form";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { Loader2, MinusIcon, XIcon } from "lucide-react";
import {
  LessonDescription,
  LessonDirective,
  LessonEvaluation,
  LessonHour,
  LessonProperty,
  LessonTitle,
} from "../../_component/lesson/lessonForm";

import { Button } from "@/components/ui/button";

import { z } from "zod";
import LessonContentsEdit from "./_component/lessonContentsEdit";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ExclamationCircleIcon as FillExclamtion } from "@heroicons/react/24/solid";
import ActionModal from "@/components/commonUi/ActionModal";
import DeleteModal from "@/components/commonUi/DeleteModal";
import { useRouter } from "next/navigation";
import { UploadFileClient } from "@/lib/fileUploaderClient";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";
//
export default function Page({ params }: { params: { lessonId: string } }) {
  const [contentType, setContentType] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [editAvaliable, setEditAvaliable] = React.useState([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setdeleteLoading] = React.useState(false);
  const router = useRouter();
  const initailData = async () => {
    //
    let response = await getLessionLibraryDetail({ lessonId: params.lessonId });
    if (response.data) {
      let result = JSON.parse(response.data);
      let group = JSON.parse(response.group);
      setEditAvaliable(group);
      console.log("data", result);
      return result;
    }
  };
  const reload = async () => {
    setLoading(true);
    let data = await initailData();
    console.log("reloadData", data);
    form.reset(data);
    setLoading(false);
  };
  React.useEffect(() => {
    reload();
  }, []);

  const form = useForm<z.infer<typeof lessonLibrarybaseSchema>>({
    resolver: zodResolver(lessonLibrarybaseSchema),
    defaultValues: {
      _id: "",
      title: "",
      description: "",
      property: "",
      createdAt: "",
      lessonHour: 1,
      evaluation: "",
      lessonContents: [],
      lessonDirective: {},
      liveSurvey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof lessonLibrarybaseSchema>) {
    console.log("values", values);

    const formData = new FormData();
    formData.append("id", values._id);
    formData.append("title", values.title);
    formData.append("property", values.property);
    formData.append("evaluation", values.evaluation);
    formData.append("lessonHour", values.lessonHour.toString());
    formData.append("description", values.description);
    //
    let lessonDirectivce = {
      _id: "",
      isDone: false,
      LessonDirectiveURL: "",
      contentdescription: "",
      contentfileName: "",
      contentSize: 0,
    } as any;
    if (values.lessonDirective._id) {
      // 이미 학습지시문이 있을경우
      if (values.lessonDirective.file) {
        // 파일이 있을경우(수정)
        const upload = await UploadFileClient({
          folderName: "lessonDirective",
          file: values.lessonDirective.file,
        });
        console.log("upload", upload);
        if (upload.location) {
          lessonDirectivce._id = values.lessonDirective._id;
          lessonDirectivce.isDone = true;
          lessonDirectivce.LessonDirectiveURL = upload.location;
          lessonDirectivce.contentfileName = values.lessonDirective.file.name;
          lessonDirectivce.contentSize = values.lessonDirective.file.size;
          lessonDirectivce.contentdescription =
            values.lessonDirective.contentdescription || "";
        } else {
          toast.error("파일 업로드에 실폐하였습니다.");
          return;
        }
      } else if (!values.lessonDirective.file) {
        // 파일이 없을경우
        lessonDirectivce._id = values.lessonDirective._id;
        lessonDirectivce.isDone = true;
        lessonDirectivce.LessonDirectiveURL =
          values.lessonDirective.LessonDirectiveURL;
        lessonDirectivce.contentfileName =
          values.lessonDirective.contentfileName;
        lessonDirectivce.contentSize = values.lessonDirective.contentSize;
        lessonDirectivce.contentdescription =
          values.lessonDirective.contentdescription || "";
      }
    } else {
      // 학습지시문 없는경우
      if (values.lessonDirective.file) {
        // 파일이 있는경우
        const upload = await UploadFileClient({
          folderName: "lessonDirective",
          file: values.lessonDirective.file,
        });
        if (upload.location) {
          lessonDirectivce._id = "";
          lessonDirectivce.isDone = true;
          lessonDirectivce.LessonDirectiveURL = upload.location;
          lessonDirectivce.contentfileName = values.lessonDirective.file.name;
          lessonDirectivce.contentSize = values.lessonDirective.file.size;
          lessonDirectivce.contentdescription =
            values.lessonDirective.contentdescription || "";
        } else {
          toast.error("파일 업로드에 실폐하였습니다.");
          return;
        }
      }
      // else if (!values.lessonDirective.file) {
      //   // 파일이 없는경우
      //   lessonDirectivce._id = "";
      //   lessonDirectivce.isDone = true;
      //   lessonDirectivce.LessonDirectiveURL = "";
      //   lessonDirectivce.contentfileName = "";
      //   lessonDirectivce.contentSize = undefined;
      //   lessonDirectivce.contentdescription =
      //     values.lessonDirective.contentdescription || "";
      // }
    }
    formData.append("lessonDirectivce", JSON.stringify(lessonDirectivce));

    setUpdateLoading(true);
    try {
      let res = await updateLessonLibrary(formData);
      if (res.data) {
        toast.success("기본 정보 수정에 성공하였습니다.");
        reload();
      }
    } catch (e) {
      //
      toast.error(e);
    } finally {
      setUpdateLoading(false);
    }
  }

  //
  const clickDelete = async () => {
    //
    setdeleteLoading(true);
    console.log("lessonId", params.lessonId);
    try {
      let res = await deleteLesson(params.lessonId);
      if (res.data) {
        toast.success("레슨 삭제에 성공하였습니다.");
        setDeleteOpen(false);
        router.push("/admin/lessonlibrary");
      } else {
        //
        // toast.error("레슨 삭제에 성공하였습니다.")
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setdeleteLoading(false);
    }
  };
  return (
    <div className="w-full flex-1 flex ">
      <ScrollArea className=" w-full h-[calc(100vh-70px)] flex ">
        <div className=" w-full flex flex-col items-start">
          <div className="w-full bg-white border ">
            <Form {...form}>
              <form
                className="w-full grid grid-cols-12  "
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className=" border-b p-3 flex flex-row items-center justify-between w-full col-span-12">
                  <div>
                    <p className="">레슨 디테일</p>
                    {editAvaliable.length > 0 ? (
                      <div>
                        <p className="text-red-500">
                          {editAvaliable.length}개의 그룹에 배정되었습니다.
                        </p>
                        <p className="flex flex-row items-center gap-2 text-red-500">
                          <FillExclamtion className="size-5 text-red-500" />
                          그룹에 배정된 레슨은 수정이 불가 합니다.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className=" text-neutral-500 text-sm">
                          정보 수정 후 [기본정보 수정 버튼]을 클릭해야
                          수정됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Button
                      type="submit"
                      className=" "
                      disabled={editAvaliable.length > 0 ? true : false}
                    >
                      {updateLoading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        <p>기본 정보 수정</p>
                      )}
                    </Button>
                    <DeleteModal
                      title="레슨삭제"
                      desc={"레슨을 삭제합니다."}
                      btnText={"레슨삭제"}
                      onClick={clickDelete}
                      disabled={false}
                      deleteOpen={deleteOpen}
                      setDeleteOpen={setDeleteOpen}
                      deleteLoading={deleteLoading}
                    />
                  </div>
                </div>
                <div className=" col-span-12 grid grid-cols-12 gap-6 p-6 ">
                  <div className=" col-span-12">
                    <LessonTitle form={form} />
                  </div>
                  <div className=" col-span-4 gap-6 flex flex-col">
                    <div className=" col-span-4">
                      <LessonProperty form={form} />
                    </div>
                    <div className=" col-span-4">
                      <LessonEvaluation form={form} />
                    </div>
                    <div className=" col-span-4">
                      <LessonHour form={form} />
                    </div>
                  </div>
                  <div className=" col-span-8 grid grid-cols-12 gap-6">
                    <div className="col-span-6">
                      <LessonDescription form={form} />
                    </div>
                    <div className=" col-span-6">
                      <LessonDirective form={form} />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <LessonContentsEdit
            lessonId={params.lessonId}
            disabled={editAvaliable.length > 0 ? true : false}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
