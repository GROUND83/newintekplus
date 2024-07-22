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
import { TableDataType } from "./table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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
            <p className="bg-primary text-white px-3 py-1 rounded-md ">전체</p>
          ) : row.getValue("sendTo") === "teacher" ? (
            <p className="bg-yellow-500 text-black px-3 py-1 rounded-md ">
              리더
            </p>
          ) : (
            <p className="bg-green-500 text-black px-3 py-1 rounded-md  ">
              참여자
            </p>
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
          <Link
            href={`/student/group/${row.original.groupId}/notice/${row.original._id}`}
          >
            <Button variant="outline" size="icon">
              <MagnifyingGlassIcon className="size-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
