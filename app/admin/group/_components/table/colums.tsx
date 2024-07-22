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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0"
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
        <div className=" text-left">
          <p>{row.getValue("status")}</p>
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
            className="  p-0"
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
        <div className=" text-left">
          <p>{row.getValue("name")}</p>
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
            className=" p-0"
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
        <div className=" flex flex-row items-center gap-2 justify-start">
          <div className="flex flex-col items-start gap-1">
            <p>{teacher?.username}</p>
          </div>
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
            className=" p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            교육기간
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let startDate = row.original.startDate;
      let endDate = row.original.endDate;
      return (
        <div className=" ">
          {dayjs(startDate).format("YYYY/MM/DD(dd)")} ~
          {dayjs(endDate).format("YYYY/MM/DD(dd)")}
        </div>
      );
    },
  },
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
      return (
        <div className=" text-right">
          <Link href={`/admin/group/${row.original._id}`}>
            <Button variant="outline" size="icon">
              <MagnifyingGlassIcon className="size-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
