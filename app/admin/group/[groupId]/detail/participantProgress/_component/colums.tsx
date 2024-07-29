"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Progress } from "@/components/ui/progress";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "username",
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
          <p className="text-xs">{row.getValue("username")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "complete",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start">
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            레슨 진행률 (과제제출 또는 집합교육완료 )
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let complete = row.original.complete;
      let lessontotalSize = row.original.lessontotalSize;
      let process =
        complete === 0
          ? 0
          : Number(((complete / lessontotalSize) * 100).toFixed(1));
      console.log("process", process);
      return (
        <div className="flex flex-row items-center gap-2 ">
          <Progress value={process} indicatorColor="bg-primary" />
          <div className="w-[200px] flex flex-row items-center gap-2">
            <p className="text-xs">
              {complete} / {lessontotalSize}
            </p>
            <p className="text-xs">{process}%</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "passCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PASS/FAILED (총레슨수 대비 0점이상 )
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let passCount = row.original.passCount;
      let lessontotalSize = row.original.lessontotalSize;
      let process =
        passCount === 0
          ? 0
          : Number(((passCount / lessontotalSize) * 100).toFixed(1));
      console.log("process", process);

      return (
        <div className="flex flex-row items-center gap-2 ">
          <Progress value={process} indicatorColor="bg-primary" />
          <div className="w-[100px] flex flex-row items-center gap-2">
            <p className="text-xs">
              {passCount} / {lessontotalSize}
            </p>
            <p className="text-xs">{process}%</p>
          </div>
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
            GRADE (총레슨의 점수 대비 점수 )
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let totalPoint = row.original.totalPoint;
      let lessontotalSize = row.original.lessontotalSize * 3;
      let process =
        totalPoint === 0
          ? 0
          : Number(((totalPoint / lessontotalSize) * 100).toFixed(1));
      console.log("process", process);
      return (
        <div className="flex flex-row items-center gap-2 ">
          <Progress value={process} indicatorColor="bg-primary" />
          <div className="w-[100px] flex flex-row items-center gap-2">
            <p className="text-xs">
              {totalPoint} / {lessontotalSize}
            </p>
            <p className="text-xs">{process}%</p>
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "newPerformUpdatedAt",
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-center">
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           과제 업데이트
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <div className="text-center">
  //         <p className="text-xs">
  //           {dayjs(row.getValue("newPerformUpdatedAt")).format(
  //             "YYYY/MM/DD HH:mm(dddd)"
  //           )}
  //         </p>
  //       </div>
  //     );
  //   },
  // },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <div className=" text-right">
  //         <Button variant="outline" size="icon">
  //           모달
  //           <MagnifyingGlassIcon className="size-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
