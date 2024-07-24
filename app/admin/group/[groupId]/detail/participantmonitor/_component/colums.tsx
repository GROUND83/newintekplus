"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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
        <div className=" ">
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
                평가완료
              </Badge>
              {point === 0 ? (
                <Badge className="text-xs font-normal" variant="destructive">
                  failed
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
    accessorKey: "newPerformUpdatedAt",
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
      return (
        <div className="text-center">
          <p className="text-xs">
            {dayjs(row.getValue("newPerformUpdatedAt")).format(
              "YYYY/MM/DD HH:mm(dddd)"
            )}
          </p>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className=" text-right">
          <Button variant="outline" size="icon">
            모달
            <MagnifyingGlassIcon className="size-4" />
          </Button>
        </div>
      );
    },
  },
];
