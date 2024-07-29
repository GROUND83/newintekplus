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
  // {
  //   accessorKey: "contents",
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex flex-col items-start">
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           첨부파일
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     let contents: any = row.getValue("contents");
  //     return (
  //       <div className=" flex flex-row items-center gap-2 justify-start">
  //         <div className="flex flex-col items-start gap-1">
  //           <p>{contents?.length > 0 ? "있음" : "없음"}</p>
  //         </div>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: "created_at",
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
          <p>{dayjs(row.getValue("created_at")).format("YYYY/MM/DD(dd)")}</p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "courseProfile",
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex flex-col items-start justify-center text-left ">
  //         <Button
  //           variant="ghost"
  //           className="  p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           모듈/레슨/설문
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     console.log(row.original);
  //     // let liveSurvey = await
  //     return (
  //       <div className=" text-left">
  //         <p>{row.original.courseProfile.modules.length > 0 ? "ok" : "no"}</p>
  //       </div>
  //     );
  //   },
  // },
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
