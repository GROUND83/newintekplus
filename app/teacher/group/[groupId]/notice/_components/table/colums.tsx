import {
  PaginationState,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  AllBadge,
  LeaderBadge,
  StudentBadge,
} from "@/components/commonUi/BadgeWrap";
import ViewWholeNotice from "@/components/commonUi/viewWholeNotice";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "sendTo",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
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
        <div className=" text-left flex ">
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
          <p className="text-xs">{row.getValue("title")}</p>
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
          <p className="text-xs">
            {dayjs(row.getValue("createdAt")).format("YYYY/MM/DD(dd)")}
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
          <ViewWholeNotice notice={row.original} />
        </div>
      );
    },
  },
];
