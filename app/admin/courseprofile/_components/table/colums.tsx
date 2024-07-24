"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Badge } from "@/components/ui/badge";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "eduForm",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left  ">
          <Button
            variant="ghost"
            className="p-0 "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            교육형태
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          {row.getValue("eduForm") === "집합교육" ? (
            <Badge variant="defaultOutline" className="font-normal">
              집합교육
            </Badge>
          ) : (
            <Badge variant="secondaryOutline" className="font-normal">
              S-OJT
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
        <div className="flex flex-col items-start ">
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            코스프로파일명
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="">
          <p className="text-sm">{row.getValue("title")}</p>
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
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/courseprofile/${row.original._id}`}>
              <Search className="size-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
