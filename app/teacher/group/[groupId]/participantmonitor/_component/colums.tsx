"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import dayjs from "dayjs";
import "dayjs/locale/ko";

import PerformViewer from "./performviewer";
import PerformEvaluationTeacher from "./performEvaluationTecacher";
import PerformEvaluationTeacherEdit from "./performEvaluationTecacherEdit";
import ViewFeedBack from "@/components/commonUi/lesson/component/viewfeedBack";
import FeedbackSend from "@/components/commonUi/lesson/component/feedback";
import ViewFeedBackTeacher from "./viewFeedbackteacher";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "lessonTitle",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start">
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            레슨명
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" w-[300px]">
          <p className="text-xs">{row.getValue("lessonTitle")}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start">
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            교육생
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" ">
          <p className="text-xs">{row.getValue("userName")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "perform",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          과제
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let downUrl = row.original.perform?.downUrl;
      let fileName = row.original.perform?.fileName;

      return (
        <div className=" text-xs">
          {downUrl ? (
            <div>
              <a
                href={downUrl}
                download={fileName}
                target="_black"
                className=" underline "
              >
                {fileName}
              </a>
            </div>
          ) : (
            <div>
              <p>-</p>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isEvaluationDone",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            평가상태
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let point = row.original.point;
      return (
        <div className=" text-left ">
          {row.getValue("isEvaluationDone") ? (
            <div className="flex flex-row items-center gap-1">
              <Badge className="text-xs font-normal" variant="defaultOutline">
                <Check className="size-3" />
              </Badge>
              {point === 0 ? (
                <Badge className="text-xs font-normal" variant="destructive">
                  FAILED
                </Badge>
              ) : point === 1 ? (
                <Badge
                  className="text-xs font-normal"
                  variant="secondaryOutline"
                >
                  하
                </Badge>
              ) : point === 2 ? (
                <Badge className="text-xs font-normal" variant="colorOutline">
                  중
                </Badge>
              ) : point === 3 ? (
                <Badge className="text-xs font-normal" variant="defaultOutline">
                  상
                </Badge>
              ) : null}
              <PerformViewer data={row.original} />
            </div>
          ) : (
            <Badge className="text-xs font-normal" variant="secondaryOutline">
              평가대기
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "actions_evaluation",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            className=" p-0"
            // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            평가 / 피드백
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let downUrl = row.original.perform?.downUrl;
      return (
        <div className=" text-center">
          {!row.getValue("isEvaluationDone") ? (
            <PerformEvaluationTeacher data={row.original} />
          ) : (
            <PerformEvaluationTeacherEdit data={row.original} />
          )}
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-center">
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           피드백
  //           {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     console.log("reow", row.original);
  //     return (
  //       <div className=" text-right">
  //         <div className=" col-span-2 bg-white border p-2">
  //           {/* {row.original.feedbackInfo ? (
  //             <div>
  //               <ViewFeedBackTeacher
  //                 lessonResult={row.original}
  //                 getLessonData={() => {}}
  //               />
  //             </div>
  //           ) : (
  //             <FeedbackSend
  //               lessonResult={row.original}
  //               getLessonData={() => {}}
  //             />
  //           )} */}
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "newPerformInfo",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            className=" p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            과제 업데이트
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let updatedAt = row.original.newPerformInfo?.updatedAt;
      return (
        <div className="text-center">
          <p className="text-xs">
            {dayjs(updatedAt).format("YYYY/MM/DD HH:mm(dddd)")}
          </p>
        </div>
      );
    },
  },
];
