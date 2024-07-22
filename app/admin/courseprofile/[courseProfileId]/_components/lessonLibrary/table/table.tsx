"use client";

import * as React from "react";

import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { getMoreData } from "./actions";
import { columns } from "./colums";
import { addLesson, getLessionLibrary } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, MoveLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type ownerType = {
  id: number;
  avatar: string;
  username: string;
  phone: string;
};
export type TableDataType = {
  id: number | null;
  name: string | null;
  address: string | null;
  visible: boolean | null;
  created_at: Date | null;
  initail: string | null;
  owner: ownerType | null;
  actions: string | null;
};
export const getColumns = ({
  onSelect,
}: {
  onSelect: (lessonId: string) => void;
}): ColumnDef<any>[] => [
  {
    accessorKey: "property",
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
          <p>{row.getValue("property")}</p>
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
            레슨명
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="default">
                선택
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>레슨 가져오기</AlertDialogTitle>
                <AlertDialogDescription>
                  선택 된 레슨을 모듈에 추가합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onSelect(row.original._id)}
                  >
                    선택
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export default function DataTable({
  setOpen,
  getModuleData,
  moduleId,
}: {
  setOpen: any;
  getModuleData: () => void;
  moduleId: string;
}) {
  //
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0, //initial page index
      pageSize: 10, //default page size
    });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  //
  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };
  const { data, isLoading } = useQuery({
    queryKey: ["data", fetchDataOptions],
    queryFn: async () => {
      let reponse = await getLessionLibrary(fetchDataOptions);
      console.log("response", reponse.pageCount);
      if (reponse.rows) {
        let lessonLibrary = JSON.parse(reponse.rows);
        console.log("lessonLibrary", lessonLibrary);
        return { rows: lessonLibrary, pageCount: reponse.pageCount };
      }
    },
  });

  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const handleSelect = React.useCallback(async (lessonId: string) => {
    console.log("lessonId", lessonId);
    console.log("moduleId", moduleId);
    // ...
    let formData = new FormData();
    formData.append("lessonId", lessonId);
    formData.append("moduleId", moduleId);
    let res = await addLesson(formData);
    console.log(res.data);
    getModuleData();
    setOpen(false);
  }, []);
  const columns = React.useMemo(
    () => getColumns({ onSelect: handleSelect }),
    [handleSelect]
  );

  const table = useReactTable({
    data: data?.rows ?? defaultData,
    columns: columns,
    pageCount: data?.pageCount ?? 7,
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    manualPagination: true,
  });

  return (
    <div className="w-full ">
      <div className="flex flex-row items-center justify-end space-x-2  h-[70px] bg-white border-b px-3">
        <div className="flex-1 text-sm text-neutral-500  ">
          총 {data?.pageCount}개의 데이터가 있습니다.
        </div>
        <div className="flex flex-row items-center">
          {/* <Label>테이블 ROW</Label> */}
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="테이블 출력" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data?.pageCount && data?.pageCount > 7 ? (
          <div className="space-x-2 flex flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
              {/* <MoveLeft /> */}
            </Button>

            <p className="border px-6 py-2 rounded-md text-sm text-neutral-500">
              {pagination.pageIndex + 1} /{" "}
              {Math.ceil(
                data?.pageCount! / table.getState().pagination.pageSize
              )}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={
                Math.round(
                  data?.pageCount! / table.getState().pagination.pageSize
                ) <= pagination.pageIndex
              }
            >
              <ChevronRight />
            </Button>
          </div>
        ) : null}
      </div>
      <div className="p-3">
        <ScrollArea className="rounded-md border bg-white  w-full h-[calc(90vh-200px)] ">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
