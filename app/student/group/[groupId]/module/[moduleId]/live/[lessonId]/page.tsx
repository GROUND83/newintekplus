"use client";
import React from "react";

export default function Page({
  params,
}: {
  params: { groupId: string; lessonId: string };
}) {
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      {/* <div className="flex-1 flex flex-col  w-full gap-2">
        <div className="bg-white  w-full flex flex-col items-start p-6 h-[calc(100vh-120px)]">
          {lesson && (
            <div className="grid grid-cols-12 gap-3 w-full">
              <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                <p className="text-neutral-500">레슨명</p>
                <p className="text-md">{lesson.title}</p>
              </div>
              <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                <p className="text-neutral-500">학습목표</p>
                <p className="text-md  whitespace-pre-wrap ">
                  {lesson.description}
                </p>
              </div>
              {lesson.lessonDirective && (
                <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                  <p className="text-neutral-500">과제지시문</p>
                  <p className="text-md  whitespace-pre-wrap">
                    {lesson.lessonDirective.contentdescription}
                  </p>
                  <div className="mt-3">
                    <Button asChild>
                      <a
                        href={lesson.lessonDirective.LessonDirectiveURL}
                        download={lesson.lessonDirective.contentfileName}
                        target="_blank"
                      >
                        {lesson.lessonDirective.contentfileName}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {lesson?.lessonContents?.length > 0 && (
                <div className=" col-span-12 flex flex-col gap-2 pb-2">
                  <p className="text-neutral-500">레슨 컨텐츠</p>
                  <div className="grid w-full grid-cols-2 gap-3 ">
                    {lesson?.lessonContents.map((item: any, index: any) => {
                      return (
                        <div key={index} className="col-span-1 p-3 ">
                          <div className="flex flex-col items-start w-full p-3 bg-white border rounded-lg">
                            <p className="bg-primary text-white px-2 py-1">
                              {item.type}
                            </p>

                            <div className="flex flex-col items-start w-full mt-3 gap-3">
                              {item.lessonContendescription && (
                                <p className="w-full truncate whitespace-pre-wrap">
                                  {item.lessonContendescription}
                                </p>
                              )}
                              {item.link && (
                                <p className="w-full truncate whitespace-pre-wrap">
                                  {item.link}
                                </p>
                              )}
                              {item.lessonContentdownloadURL && (
                                <Button asChild size="sm">
                                  <a
                                    href={item.lessonContentdownloadURL}
                                    download={item.lessonContenFileName}
                                    target="_blank"
                                  >
                                    {item.lessonContenFileName}
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* <div className="w-full bg-white   h-[200px] flex flex-col items-center justify-center">
                    <div className="w-[200px] h-[200px] flex flex-col items-center justify-center">
                      <p>학습컨텐츠가 없습니다.</p>
                    </div>
                  </div> */}
      {/* </div>
              )}
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
