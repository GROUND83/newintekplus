"use clinet";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Progress } from "@/components/ui/progress";
import ViewPersionDetail from "../viewPersonalDetail";
// import DeleteTableRow from "../../../_component/deleteTableRow";
// import UpdateTableRow from "../../../_component/upDataTableRow";

dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-center justify-center ">
          <Button
            variant="ghost"
            className="p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            순번
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      // console.log(row);
      return (
        <div className="flex flex-col items-center justify-center ">
          <p className="text-xs">{row.index + 1}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            이름
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p className="text-xs">{row.getValue("username")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            이메일
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p className="text-xs">{row.getValue("email")}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "jobPosition",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-center justify-center  ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            직위
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-center justify-center  ">
          <p className="text-xs">{row.getValue("jobPosition")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "jobGroup",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            직군
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p className="text-xs">{row.getValue("jobGroup")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "jobSubGroup",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            그룹
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p className="text-xs">{row.getValue("jobSubGroup")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            부서
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p className="text-xs">{row.getValue("department")}</p>
        </div>
      );
    },
  },
  {
    id: "actions1",
    cell: ({ row }) => {
      // console.log(row);
      return (
        <div className="">
          <ViewPersionDetail data={row.original} />
        </div>
      );
    },
  },

  // },
];
