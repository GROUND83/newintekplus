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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            상태
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left ">
          <Badge
            className="font-normal"
            variant={
              row.getValue("status") === "개설완료"
                ? "defaultOutline"
                : "secondaryOutline"
            }
          >
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            그룹명
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left ">
          <p className=" text-sm">{row.getValue("name")}</p>
          <p className="text-neutral-500  text-xs">
            {row.original.courseProfile?.title}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "teacher",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start">
          <Button
            variant="ghost"
            className=" p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            리더
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let teacher: any = row.getValue("teacher");
      return (
        <div className=" flex flex-row items-center gap-2 justify-start ">
          <p className="text-xs">{teacher?.username}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            className=" p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            교육시작
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let startDate = row.original.startDate;
      let endDate = row.original.endDate;
      return (
        <div className=" text-xs">
          {dayjs(startDate).format("YYYY/MM/DD(dd)")}
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            className=" p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            교육마감
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let startDate = row.original.startDate;
      let endDate = row.original.endDate;
      return (
        <div className=" text-xs">
          {dayjs(endDate).format("YYYY/MM/DD(dd)")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            className=" p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            생성일
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <p className="text-xs">
            {dayjs(row.getValue("createdAt")).format("YYYY/MM/DD HH:mm(dd)")}
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
          <Link href={`/admin/group/${row.original._id}`}>
            <Button variant="outline" size="xs">
              <MagnifyingGlassIcon className="size-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
