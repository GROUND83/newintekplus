"use client";
import { Button } from "@/components/ui/button";

import ViewResultSurvey from "@/components/commonUi/viewResultSurvey";

import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { resultSurveyUpdate } from "./actions";
import dayjs from "dayjs";

import jsPDF from "jspdf";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notosnas, NotoSansBold } from "@/lib/fonts";
import vertificationTemplate from "@/lib/mailtemplate/vertificationTemplate";

import { UploadFile } from "@/lib/fileUploader";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";
import { toast } from "sonner";
import { Loader, Loader2, RotateCw, Send } from "lucide-react";
import sendMail from "@/lib/sendMail/sendMail";
import { logobinary } from "@/lib/logoBunary";
import ActionModal from "@/components/commonUi/ActionModal";
import { UploadFileClient } from "@/lib/fileUploaderClient";
import SendVertification from "./sendVertification";
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
const blobToFile = (theBlob: Blob, fileName: string): File => {
  return new File(
    [theBlob as any], // cast as any
    fileName,
    {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    }
  );
};
const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "하나 이상 선택하세요.",
  }),
});
export default function NewSendVertification({
  group,
  getData,
}: {
  group: any;
  getData: any;
}) {
  const [loading, setLoading] = React.useState(false);
  //
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });
  const html2pdf = async ({ group, username, department }) => {
    let start = dayjs(group.startDate).format("YYYY.MM.DD");
    let end = dayjs(group.endDate).format("YYYY.MM.DD");
    let today = dayjs(group.endDate).format("YYYY.MM.DD");
    const doc = new jsPDF("p", "mm", "a4");

    doc.addFileToVFS("NotoSansKR-Medium.ttf", Notosnas);
    doc.addFileToVFS("NotoSansKR-Bold.ttf", NotoSansBold);
    doc.addFont("NotoSansKR-Medium.ttf", "notosans", "normal");
    doc.addFont("NotoSansKR-Bold.ttf", "notosans", "bold");
    doc.setFont("notosans", "bold");
    // 297mm
    let position = 0;
    //
    console.log(logobinary);
    doc.addImage(logobinary, "png", 75, 115, 60, 60);
    doc.setFontSize(40);
    doc.text("교육 수료증", 105, 50, { align: "center" });
    doc.setFontSize(16);
    doc.text(`성   명 : ${username}`, 105, 80, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text(`소   속 : ${department || "-"}`, 105, 100, {
      align: "center",
    });
    doc.setFontSize(16);
    doc.text(`과 정 명 : ${group.name}`, 105, 120, {
      align: "center",
    });
    doc.setFontSize(16);
    doc.text(`교육기간 : ${start} ~ ${end}`, 105, 140, {
      align: "center",
    });
    // doc.setFontSize(40);
    // doc.text(`교육시간 : ${lessonTime} 일`, 105, 20, {
    //   align: "center",
    // });
    doc.setFontSize(16);
    doc.text(`위 사람은`, 105, 160, {
      align: "center",
    });
    doc.setFontSize(16);

    doc.text(`${group.name} `, 105, 180, {
      align: "center",
    });
    doc.text(`과정에 성실히 수료하였기에 이를 수여함. `, 105, 200, {
      align: "center",
    });
    doc.setFontSize(20);
    doc.text(`${today}`, 105, 230, {
      align: "center",
    });
    doc.setFontSize(20);
    doc.text(`인텍플러스 교육위원회`, 105, 250, {
      align: "center",
    });

    doc.save();
    const blob = new Blob([doc.output("blob")], { type: "application/pdf" });

    return blob;
  };
  async function onSubmit(formdata: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      console.log("formdata", formdata, group);
      let resultSurveys = group.resultSurvey;
      let participants = group.participants;
      let selectparticipants = formdata.items;
      console.log("participants", participants);
      for await (const customer of selectparticipants) {
        //   console.log("customer", customer);
        let resultsurvey = resultSurveys.find(
          (item: { _id: string }) => item._id === customer
        );
        console.log("resultsurvey", resultsurvey);
        let username = resultsurvey.onwer.username;
        let department = resultsurvey.onwer.department;
        // console.log("username", resultsurvey.onwer, username);
        //
        let pdfData = await html2pdf({
          group: group,
          username,
          department,
        });
        //

        //
        const file = blobToFile(pdfData, "my-image.png");
        let formData = new FormData();
        formData.append("file", file);
        let filedata = formData.get("file") as File;

        let newformData = new FormData();
        newformData.append("file", filedata);
        newformData.append("folderName", "certification");
        const upload = await UploadFileClient({
          folderName: "feedBack",
          file: filedata,
        });
        let to = `${resultsurvey.onwer.email}`;
        const mailData: any = {
          to: to,
          subject: "살롱캔버스 수료증 이메일 입니다.",
          from: "noreply@saloncanvas.kr",
          html: vertificationTemplate({
            title: "수료증 발송",
            description: "첨부파일을 확인하세요.",
          }),
          attachments: [
            {
              filename: `${resultsurvey.onwer._id}.pdf`, // the file name
              path: upload.location, // link your file
              contentType: filedata.type, //type of file
            },
          ],
        };
        await sendMail(mailData);

        if (resultsurvey._id) {
          await resultSurveyUpdate(resultsurvey._id);
        }
      }

      //   console.log(file);

      toast.success("메일 발송에 성공하였습니다.");
      getData();
      setLoading(false);
    } catch (e) {
      //
    } finally {
      setLoading(false);
      setClean();
    }
  }

  //   React.useEffect(() => {
  //     if (data?.group.resultSurvey) {
  //       form.setValue("items", data?.group.resultSurvey);
  //     }
  //   }, [data]);

  const setWhole = () => {
    let newArray = group.resultSurvey.map((item: any) => item._id);
    form.setValue("items", newArray);
  };
  const setClean = () => {
    let newArray = group.resultSurvey.map((item: any) => item._id);
    form.setValue("items", []);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem className="w-full">
              <div className="mb-4">
                <FormLabel className="text-base">설문 결과</FormLabel>
                <FormDescription>
                  개별 선택 또는 전체 선택을 통해 수료증을 발급하세요.
                </FormDescription>
              </div>
              <div className="w-full flex flex-row items-center justify-between ">
                <div className="flex flex-row items-center gap-2">
                  <Button type="button" onClick={() => setWhole()}>
                    전체 선택
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setClean()}
                    variant="outline"
                  >
                    전체 해제
                  </Button>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}
                  {form.getValues("items").length} 발급
                </Button>
              </div>
              <ScrollArea className="w-full h-[calc(100vh-400px)] flex flex-col ">
                <div className="w-full flex flex-col gap-1 mt-2  items-center ">
                  {group?.resultSurvey.map((item: any, index: any) => (
                    <FormField
                      key={item._id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item._id}
                            className="w-full flex flex-row  gap-3 items-center justify-center border-b py-2"
                          >
                            <FormControl className="flex flex-row  items-center justify-center size-4 mt-2 ">
                              <Checkbox
                                // disabled={item.isSend}

                                checked={field.value?.includes(item._id)}
                                // checked={field.value?.isSend}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item._id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item._id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className=" w-full grid grid-cols-12 gap-2   ">
                              <div className="flex flex-row items-center  col-span-4">
                                <p>
                                  {index + 1}. {item.onwer?.username}
                                </p>
                              </div>

                              <div className="flex flex-row items-center   justify-start gap-2 col-span-4">
                                {item.isDone ? (
                                  <Badge
                                    className=" text-xs font-normal"
                                    variant="defaultOutline"
                                  >
                                    완료
                                  </Badge>
                                ) : (
                                  <Badge
                                    className=" text-xs font-normal"
                                    variant="secondaryOutline"
                                  >
                                    미완료
                                  </Badge>
                                )}
                                {item.isSend ? (
                                  <Badge
                                    className=" text-xs font-normal"
                                    variant="defaultOutline"
                                  >
                                    발급완료
                                  </Badge>
                                ) : (
                                  <Badge
                                    className=" text-xs font-normal"
                                    variant="secondaryOutline"
                                  >
                                    발급대기
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-row items-center gap-2 col-span-4 justify-end ">
                                {item.isDone ? (
                                  <ViewResultSurvey resultSurvey={item} />
                                ) : (
                                  <Button
                                    size="xs"
                                    disabled
                                    variant="outline"
                                    className="flex flex-row items-center gap-2"
                                  >
                                    <Loader2 className="size-3" />
                                    <p>설문 대기</p>
                                  </Button>
                                )}
                                <SendVertification
                                  group={group}
                                  participants={item.onwer}
                                  resultSurveyId={item._id || ""}
                                  isSend={item.isSend}
                                  getData={getData}
                                />
                              </div>
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="w-full">
          <div className=" border-t border-b py-1 w-full h-[50px] grid grid-cols-12 gap-3 items-center">
            <div className="col-span-9">
              <p>선택</p>
            </div>
            <div className=" col-span-3  items-end  flex flex-col">
              <Button size="sm" className="flex flex-row items-center gap-2  ">
                <p>전체발급</p>
              </Button>
            </div>
          </div>
          <ScrollArea className="w-full h-[calc(100vh-300px)] flex flex-col ">
            <div className="w-full flex flex-col gap-1 mt-2 ">
              {data?.group.resultSurvey.map((item: any, index: any) => {
                console.log("iten", item);
                return (
                  <div
                    key={item._id}
                    className="w-full grid grid-cols-12  gap-2 border px-2 py-1  justify-between"
                  >
                    <div className="flex flex-row items-center gap-2 col-span-4">
                      <Checkbox />

                      <p>
                        {index + 1}. {item.onwer?.username}
                      </p>
                    </div>
                    <div className="flex flex-row items-center   justify-start gap-2 col-span-4">
                      {item.isDone ? (
                        <Badge
                          className=" text-xs font-normal"
                          variant="defaultOutline"
                        >
                          완료
                        </Badge>
                      ) : (
                        <Badge
                          className=" text-xs font-normal"
                          variant="secondaryOutline"
                        >
                          미완료
                        </Badge>
                      )}
                      {item.isSend ? (
                        <Badge
                          className=" text-xs font-normal"
                          variant="defaultOutline"
                        >
                          발급완료
                        </Badge>
                      ) : (
                        <Badge
                          className=" text-xs font-normal"
                          variant="secondaryOutline"
                        >
                          발급대기
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-row items-center gap-2 col-span-4 justify-end">
                      {item.isDone ? (
                        <ViewResultSurvey resultSurvey={item} />
                      ) : (
                        <Button
                          size="xs"
                          disabled
                          variant="outline"
                          className="flex flex-row items-center gap-2"
                        >
                          <Loader2 className="size-3" />
                          <p>설문 대기</p>
                        </Button>
                      )}
                      <SendVertification
                        group={data.group}
                        participants={item.onwer}
                        resultSurveyId={item._id || ""}
                        isSend={item.isSend}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div> */}
      </form>
    </Form>
  );
}
