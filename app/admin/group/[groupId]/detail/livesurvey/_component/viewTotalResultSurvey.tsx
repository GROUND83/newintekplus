"use client";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getTotalResultSurvey } from "./actions";
import pixelWidth from "string-pixel-width";
export default function ViewTotalResultSurvey({
  groupId,
}: {
  groupId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [updataLoading, setUpdateLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataExcel, setDataExcel] = React.useState([]);

  const getResult = async () => {
    let res = await getTotalResultSurvey(groupId);
    console.log(res);
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("data", data);
      let newArray = [];
      for (const index in data) {
        let newdata = {
          순서: Number(index) + 1,
          설문명: data[index].title,
          점수: data[index].totalPoint,
          만점: data[index].total,
          응답자: data[index].resultsurveyslength,
          총설문자: data[index].participantsLength,
        };
        newArray.push(newdata);
      }
      setDataExcel(newArray);
      setData(data);
    }
  };
  React.useEffect(() => {
    getResult();
  }, [groupId]);

  const _autoFitColumns = (json: any, worksheet: any) => {
    const jsonKeys = Object.keys(json[0]);

    const objectMaxLength = [];
    jsonKeys.forEach((key: any) => {
      objectMaxLength.push(
        pixelWidth(key, {
          size: 5,
        })
      );
    });

    json.forEach((data: any, i: any) => {
      const value = json[i];
      jsonKeys.forEach((key: any, j: any) => {
        const l = value[jsonKeys[j]]
          ? pixelWidth(value[jsonKeys[j]], {
              size: 5,
            })
          : 0;
        objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
      });
    });

    return objectMaxLength.map((w) => {
      return { width: w };
    });
  };
  const exportToExcel = () => {
    let fileName = `${data[0].name}_설문결과`;
    let worksheetname = "Sheet1";
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(dataExcel);
    const wscols = _autoFitColumns(dataExcel, worksheet);
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    console.log(`Exported data to ${fileName}.xlsx`);
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: "xlsx",
    //   type: "array",
    // });
    // const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    // saveAs(blob, `${fileName}.xlsx`);
  };
  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="xs" className="flex flex-row items-center gap-2">
            <Search className="size-3" />
            설문 결과
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>설문 결과</DialogTitle>
            <DialogDescription>설문 결과를 확인합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col  gap-2 ">
            <ScrollArea className="h-[500px] flex flex-col w-full">
              {data.length > 0 &&
                data.map((item, index) => {
                  return (
                    <div
                      key={item._id}
                      className="px-6 border p-3 flex flex-col items-start gap-2 w-full"
                    >
                      <p className="font-bold">
                        {index + 1}. {item.title}
                      </p>
                      <div className="flex flex-row items-center gap-1 w-full">
                        <p>점수/만점</p>
                        <p>
                          [{item.totalPoint}/{item.total}]
                        </p>
                      </div>
                      <div className="flex flex-row items-center gap-2 w-full">
                        <Progress
                          indicatorColor="bg-primary"
                          value={Number(item.totalPoint / item.total) * 100}
                        />
                        <p>
                          {(Number(item.totalPoint / item.total) * 100).toFixed(
                            2
                          )}
                          %
                        </p>
                      </div>

                      <div className="flex flex-row items-center gap-1 w-full">
                        <p>응답자/총설문자</p>
                        <p>
                          [{item.resultsurveyslength}/{item.participantsLength}]
                        </p>
                      </div>
                      <div className="flex flex-row items-center gap-2 w-full">
                        <Progress
                          indicatorColor="bg-violet-500"
                          value={
                            Number(
                              item.resultsurveyslength / item.participantsLength
                            ) * 100
                          }
                        />
                        <p>
                          {(
                            Number(
                              item.resultsurveyslength / item.participantsLength
                            ) * 100
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                    </div>
                  );
                })}
            </ScrollArea>
          </div>
          <div className="flex flex-row items-center justify-end gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="flex flex-row items-center gap-2"
              onClick={() => setOpen(false)}
            >
              닫기
            </Button>
            <Button
              type="button"
              size="sm"
              variant="default"
              className="flex flex-row items-center gap-2"
              onClick={() => exportToExcel()}
            >
              EXCEL 다운
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// {
//     "_id": "65d31b07834b7aa7975ae55f",
//     "title": "본 과정은 전반적으로 관라자로서 의식을 고양하는데 도움이 되었다",
//     "resultsurveyslength": 1,
//     "totalPoint": 5,
//     "participantsLength": 3,
//     "total": 15
// }
// https://emdiya.medium.com/how-to-export-data-into-excel-in-next-js-14-820edf8eae6a
