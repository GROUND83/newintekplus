"use clinet";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "sendTo",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left  ">
          <Button
            variant="ghost"
            className="p-0 "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            대상
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          {row.getValue("sendTo") === "all" ? (
            <Badge variant="defaultOutline" className="font-normal">
              전체
            </Badge>
          ) : row.getValue("sendTo") === "teacher" ? (
            <Badge variant="secondaryOutline" className="font-normal">
              리더
            </Badge>
          ) : row.getValue("sendTo") === "student" ? (
            <Badge variant="secondaryOutline" className="font-normal">
              교육생
            </Badge>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            제목
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p>{row.getValue("title")}</p>
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
        <div className="   text-center">
          <p>
            {dayjs(row.getValue("createdAt")).format("YYYY/MM/DD HH:mm(dddd)")}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // console.log(row);
      return (
        <div className=" text-right">
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/wholenotice/${row.original._id}`}>
              <Search className="size-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
