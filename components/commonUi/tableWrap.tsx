"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Loader2, MoveLeft } from "lucide-react";
import {
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";

interface fetchDataOptionsType {
  pageIndex: number;
  pageSize: number;
  groupId: string | undefined;
}
export default function TableWrap({
  columns,
  getMoreData,
}: {
  columns: any;
  getMoreData: any;
}) {
  const params = useParams<{ groupId: string }>();
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
    groupId: params.groupId,
  };
  const { data, isLoading, isError } = useQuery({
    //
    queryKey: ["data", fetchDataOptions],
    queryFn: async () => {
      let reponse = await getMoreData(fetchDataOptions);
      if (reponse.rows) {
        let groups = JSON.parse(reponse.rows);
        console.log("groups", groups);
        return { rows: groups, pageCount: reponse.pageCount };
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
  const table = useReactTable({
    data: data?.rows ?? defaultData,
    columns: columns,
    pageCount: data?.pageCount ?? 10,
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    debugTable: true,
    rowCount: data?.pageCount ?? 10,
  });
  if (isLoading) {
    return (
      <div className="w-full  h-[calc(100vh-70px)]  flex flex-col items-center justify-center">
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="flex flex-row items-center justify-end space-x-2  h-[50px] bg-neutral-100 border-b px-3">
        <div className="flex-1 text-sm text-neutral-500  ">
          <p className="text-xs">총 {data?.pageCount}개의 데이터가 있습니다.</p>
        </div>
        <div className="flex flex-row items-center">
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
        {data?.pageCount && data?.pageCount > 10 ? (
          <div className="space-x-2 flex flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>

            <p className="border px-6 py-2 rounded-md text-sm text-neutral-500 bg-white">
              {Number(table.getState().pagination.pageIndex) + 1} /{" "}
              {Math.ceil(
                table.getPageCount() / table.getState().pagination.pageSize
              )}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={
                Math.round(
                  table.getPageCount() / table.getState().pagination.pageSize
                ) <=
                table.getState().pagination.pageIndex + 1
              }
            >
              <ChevronRight />
            </Button>
          </div>
        ) : null}
      </div>
      <div className=" ">
        <ScrollArea className=" bg-white  w-full max-h-[calc(100vh-120px)]">
          <Table className="" wrapperClassName="overflow-clip">
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="">
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
