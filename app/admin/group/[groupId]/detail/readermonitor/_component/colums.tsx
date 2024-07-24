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
    accessorKey: "lessonName",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0"
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
        <div className=" text-left ">
          <p className=" text-sm">{row.getValue("lessonName")}</p>
        </div>
      );
    },
  },
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
    accessorKey: "feedBack",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          피드백
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let title = row.original.feedBack?.title;

      return (
        <div className=" text-xs">
          <p>{title}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "feedbackUpdatedAt",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            className=" p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            피드백업데이트
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <p className="text-xs">
            {dayjs(row.getValue("feedbackUpdatedAt")).format(
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
