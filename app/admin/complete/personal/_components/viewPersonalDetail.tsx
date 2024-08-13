"use client";
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
import ChartJsImage from "chartjs-to-image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";

import { Bar } from "react-chartjs-2";
import { Notosnas, NotoSansBold } from "@/lib/fonts";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import React from "react";
import { getPersonalData } from "./table/actions";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { logobinary } from "@/lib/logoBunary";
import { toast } from "sonner";
export const options = {
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      min: 0,
    },
  },
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  //   responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

interface MajorProps {
  takeExam: number;
  excellentTest: number;
  mentorProgram: number;
  fieldTraining: number;
  copyrightRegistration: number;
  preliminaryCurriculum: number;
  regularCurriculum: number;
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
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
export default function ViewPersionDetail({ data }: { data: any }) {
  //
  const [open, setOpen] = React.useState(false);
  const [resultData, setResultData] = React.useState<any>();
  console.log("data", data);
  const getDetailData = async () => {
    let res = await getPersonalData(data._id);
    if (res.data) {
      let newData = JSON.parse(res.data);
      console.log("newData", newData);
      setResultData(newData);
    }
  };
  React.useEffect(() => {
    if (open) {
      getDetailData();
    }
  }, [data, open]);

  const html2pdf = async (e: any) => {
    //
    const doc = new jsPDF("p", "mm", "a4");
    doc.addFileToVFS("NotoSansKR-Medium.ttf", Notosnas);
    doc.addFileToVFS("NotoSansKR-Bold.ttf", NotoSansBold);
    doc.addFont("NotoSansKR-Medium.ttf", "notosans", "normal");
    doc.addFont("NotoSansKR-Bold.ttf", "notosans", "bold");
    doc.setFont("notosans", "bold");

    //
    const but = e.target;
    but.style.display = "none";
    let input = window.document.getElementsByClassName("div2PDF")[0] as any;
    let lesson = window.document.getElementsByClassName("lesson")[0] as any;
    //

    // let start = dayjs().format("YYYY.MM.DD");
    // let end = dayjs().format("YYYY.MM.DD");
    // let today = dayjs().format("YYYY.MM.DD");

    // 297mm
    let position = 0;
    //
    // console.log(logobinary);
    // doc.addImage(logobinary, "png", 75, 115, 60, 60);
    // doc.addImage(dataUrl, "png", 15, 15, 280, 150);
    doc.setFontSize(14);
    doc.text("교육현황표", 10, 20);
    doc.setLineWidth(1.0);
    doc.line(10, 25, 190, 25);
    doc.setFontSize(12);
    doc.text(`성   명 : ${data.username}`, 10, 35);
    doc.setFontSize(12);
    doc.text(`이메일 : ${data.email}`, 10, 40);
    doc.setFontSize(12);
    doc.text(`직위 : ${data.jobPosition}`, 10, 45);
    doc.setLineWidth(0.5);
    doc.line(10, 55, 190, 55);
    doc.text(`전체 교육`, 10, 65);

    let full = 190;
    doc.setDrawColor(0);
    doc.setFillColor(173, 181, 189);
    doc.rect(10, 70, 190, 10, "F");
    doc.setDrawColor(0);
    doc.setFillColor(0, 76, 230);
    doc.rect(10, 70, 100, 10, "F");

    doc.save();
    const blob = new Blob([doc.output("blob")], { type: "application/pdf" });

    return blob;
  };

  const handlePrint = async (e: Event) => {
    //

    // console.log(docRef.current);
    try {
      let data = await html2pdf(e);
      console.log(data);

      const file = blobToFile(data, "my-image.png");
      console.log(file);
      let formData = new FormData();
      formData.append("file", file);
      let filedata = formData.get("file") as File;

      let newformData = new FormData();
      newformData.append("file", filedata);
      newformData.append("folderName", "certification");
    } catch (e) {
      toast.error(e);
    } finally {
    }
  };

  return (
    <Dialog open={open}>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Search className="size-4" />
      </Button>

      <DialogContent className="w-[70vw]">
        <DialogHeader className="w-full border-b py-3">
          <DialogTitle className="flex flex-row items-center justify-between w-full gap-2 ">
            <p className="">개별 교육 현황표</p>
            {/* <Button type="button" onClick={(e) => handlePrint(e)}>
              PDF 다운
            </Button> */}
          </DialogTitle>
          <DialogDescription>
            {/* {dayjs(notice.updatedAt).format("YYYY-MM-DD")} */}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[800px] w-full border-b">
          <div className=" col-span-6 border p-3 ">
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="flex flex-col items-start w-full gap-3">
                <div className="flex flex-row items-center gap-2">
                  <p>이름</p>
                  <p className="">{data.username}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <p>이메일</p>
                  <p>{data.email}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <p>직위</p>
                  <p>{data.jobPosition}</p>
                </div>
              </div>
              {resultData && (
                <div className="w-full flex flex-col items-start">
                  <div className="w-full border-y py-2">
                    <div className="w-full max-h-[100px] div2PDF">
                      <Bar
                        options={options}
                        data={{
                          labels: [
                            `전체교육 진행률 ${Math.round(
                              (resultData.totalPass / resultData.totalLesson) *
                                100
                            )}%`,
                          ],
                          datasets: [
                            {
                              label: "퍼센트",
                              data: [
                                Math.round(
                                  (resultData.totalPass /
                                    resultData.totalLesson) *
                                    100
                                ),
                              ],
                              borderColor: "rgb(255, 99, 132)",
                              backgroundColor: "rgba(255, 99, 132, 0.5)",
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-3  ">
                    <p className=" font-bold">교육 과정</p>
                    <div className="w-full flex flex-col items-start mt-2 lesson">
                      {resultData.groups.length > 0 && (
                        <div className="flex flex-col items-start w-full">
                          {resultData.groups.map((item: any, index: any) => {
                            return (
                              <div
                                key={item._id}
                                className="w-full border px-3"
                              >
                                <div className="border-b w-full py-2">
                                  <p>{item.name}</p>
                                </div>
                                <div className="border-b w-full py-2">
                                  <div className="w-full max-h-[100px]">
                                    <Bar
                                      options={options}
                                      data={{
                                        labels: [
                                          `진행률 ${Math.round(
                                            (item.passCount /
                                              item.lessonResultCount) *
                                              100
                                          )}%`,
                                        ],
                                        datasets: [
                                          {
                                            label: "퍼센트",
                                            data: [
                                              Math.round(
                                                (item.passCount /
                                                  item.lessonResultCount) *
                                                  100
                                              ),
                                            ],
                                            borderColor: "rgb(0, 76, 230)",
                                            backgroundColor:
                                              "rgba(0, 76, 230, 0.5)",
                                          },
                                        ],
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="  justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
