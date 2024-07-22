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

export const columns: ColumnDef<any>[] = [
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
            과정명
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-left">
          <p>{row.getValue("name")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "owner",
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
      let onwer: any = row.getValue("owner");
      return (
        <div className=" flex flex-row items-center gap-2 justify-start">
          <Avatar>
            <AvatarImage src={onwer?.avatar} alt="@shadcn" sizes="sm" />
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <p>{onwer?.username}</p>
            <p className="text-neutral-500 text-light">{onwer?.phone}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "visible",
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
    cell: ({ row }) => (
      <div className=" ">
        {row.getValue("visible") ? (
          <Badge className="   font-light">공개</Badge>
        ) : (
          <Badge className="text-neutral-400   font-light">비공개</Badge>
        )}
      </div>
    ),
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
          <p>{dayjs(row.getValue("created_at")).format("YYYY/MM/DD")}</p>
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
          <Link href={`/admin/farm/${row.original.id}/base`}>
            자세히보기
            {/* <Button variant="outline" size="icon">
              <MagnifyingGlassIcon className="size-4" />
            </Button> */}
          </Link>
        </div>
      );
    },
  },
];
