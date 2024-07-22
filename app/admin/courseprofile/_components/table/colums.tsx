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
import { ArrowUpDown, Search } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "eduForm",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start justify-center text-left ">
          <Button
            variant="ghost"
            className="  p-0"
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
          <p>{row.getValue("eduForm")}</p>
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
            코스프로파일명
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
  //   accessorKey: "lessonHour",
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex flex-col items-start">
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           교육시간
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     // let onwer: any = row.getValue("lessonHour");
  //     return (
  //       <div className=" flex flex-row items-center gap-2 justify-start">
  //         {/* <Avatar>
  //           <AvatarImage src={onwer?.avatar} alt="@shadcn" sizes="sm" />
  //         </Avatar> */}
  //         <div className="flex flex-col items-start gap-1">
  //           <p>{row.getValue("lessonHour")}</p>
  //           {/* <p className="text-neutral-500 text-light">{onwer?.phone}</p> */}
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "evaluation",
  //   header: ({ column }) => {
  //     return (
  //       <div>
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           평가방법
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className=" ">
  //       <p>{row.getValue("evaluation")}</p>
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-center">
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           학습컨텐츠
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <div className="   text-center">
  //         <p>{dayjs(row.getValue("createdAt")).format("YYYY/MM/DD")}</p>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-center">
  //         <Button
  //           variant="ghost"
  //           className=" p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           설문
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <div className="   text-center">
  //         <p>{dayjs(row.getValue("createdAt")).format("YYYY/MM/DD")}</p>
  //       </div>
  //     );
  //   },
  // },
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
