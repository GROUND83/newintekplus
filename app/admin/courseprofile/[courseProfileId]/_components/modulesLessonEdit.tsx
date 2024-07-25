"use client";
import FormLabelWrap from "@/components/formLabel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ModuleAdd from "./moduleAdd";
import { moduleDetail } from "./actions";
import React from "react";
import ModuleEdit from "./ModuleEdit";
import LessonEdit from "./lessonEdit";
import LessonFromLibrary from "./lessonFormLibrary";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
//

export default function ModulesLessonEdit({
  courseProfileId,
  disabled,
}: {
  courseProfileId: string;
  disabled: boolean;
}) {
  const [moduleDatas, setModuleDatas] = React.useState<any>([]);

  const getModuleData = async () => {
    //
    let res = await moduleDetail(courseProfileId);
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("data", data);
      setModuleDatas(data.modules);
    }
  };
  React.useEffect(() => {
    getModuleData();
  }, []);
  return (
    <div className="w-full  p-6 bg-white border-t">
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-xl font-bold">모듈정보</p>
          <p>모듈/레슨을 세팅하세요.</p>
        </div>
        <ModuleAdd
          disabled={disabled}
          courseProfileId={courseProfileId}
          getModuleData={getModuleData}
        />
      </div>
      <div className="w-full grid grid-cols-12 gap-5 mt-3">
        <div className=" col-span-12">
          {moduleDatas.map((module: any, index: any) => {
            return (
              <div
                key={module._id}
                className="w-full flex flex-col items-start  border  rounded-md"
              >
                <div className="w-full flex flex-row items-center justify-between bg-neutral-100 p-3 border-b">
                  <div className="flex flex-row gap-3 items-center">
                    <p className=" font-bold text-lg">
                      {index + 1}. {module.title}
                    </p>
                    <Popover>
                      <PopoverTrigger className="border px-3 py-1 bg-white">
                        세부내용
                      </PopoverTrigger>
                      <PopoverContent>{module.description}</PopoverContent>
                    </Popover>
                  </div>
                  <ModuleEdit
                    moduleId={module._id}
                    getModuleData={getModuleData}
                    disabled={disabled}
                    courseProfileId={courseProfileId}
                  />
                </div>
                <div className="p-3 w-full ">
                  <div className="border w-full ">
                    <div className="min-h-[100px] w-full flex flex-col gap-1   ">
                      <div className=" border-b p-2">
                        <p>레슨</p>
                      </div>
                      {module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any, lessonIndex: any) => {
                          return (
                            <LessonEdit
                              disabled={disabled}
                              key={lessonIndex}
                              lesson={lesson}
                              lessonIndex={lessonIndex}
                              moduleId={module._id}
                              getModuleData={getModuleData}
                            />
                          );
                        })
                      ) : (
                        <div className="w-full flex flex-col items-center justify-center min-h-[100px] ">
                          <p>레슨을 추가하세요.</p>
                        </div>
                      )}
                    </div>
                    <div className="w-full flex flex-row items-center  justify-center gap-6 bg-neutral-100  py-4">
                      <LessonFromLibrary
                        getModuleData={getModuleData}
                        moduleId={module._id}
                        disabled={disabled}
                      />

                      {disabled ? (
                        <Button
                          size="sm"
                          variant="defaultoutline"
                          disabled={disabled}
                        >
                          <ExternalLink className="size-4" />
                          레슨 추가
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="defaultoutline"
                          asChild
                          disabled={disabled}
                        >
                          <Link
                            href="/admin/lessonlibrary/new"
                            className="flex flex-row items-center gap-1"
                          >
                            <ExternalLink className="size-4" />
                            레슨 추가
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
