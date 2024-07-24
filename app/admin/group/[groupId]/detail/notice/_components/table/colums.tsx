import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Badge } from "@/components/ui/badge";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "sendTo",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0"
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
        <div className=" text-left flex  p-0">
          {row.getValue("sendTo") === "all" ? (
            <Badge className="font-normal " variant="defaultOutline">
              전체
            </Badge>
          ) : row.getValue("sendTo") === "teacher" ? (
            <Badge className=" font-normal " variant="colorOutline">
              리더
            </Badge>
          ) : (
            <Badge className=" font-normal " variant="colorOutline">
              참가자
            </Badge>
          )}
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
            className="  p-0"
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
            className=" p-0"
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
          <p className=" text-xs">
            {dayjs(row.getValue("createdAt")).format("YYYY/MM/DD HH:mm(dddd)")}
          </p>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      console.log(row);
      return (
        <div className=" text-right">
          <Link
            href={`/admin/group/${row.original.groupId}/detail/notice/${row.original._id}`}
          >
            <Button variant="outline" size="xs">
              <MagnifyingGlassIcon className="size-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
