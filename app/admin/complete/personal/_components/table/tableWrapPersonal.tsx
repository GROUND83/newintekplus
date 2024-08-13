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

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Search from "@/components/commonUi/Search";
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";

function TableWrapData({
  columns,
  getMoreData,
  subMenu = false,
  placeHolder,
  searchShow,
  height,
}: {
  columns: any;
  getMoreData: any;
  subMenu: boolean;
  placeHolder: string;
  searchShow: boolean;
  height: string | undefined;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  // const [date, setDate] = React.useState<DateRange | undefined>({
  //   from: subDays(new Date(), 30),
  //   to: new Date(),
  // });
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();

  const [pageCount, setPageCount] = React.useState(1);

  const [total, setTotal] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(100);
  const [pageNumber, setPageNumber] = React.useState(1);
  //
  const currentPage = React.useRef(1);

  const search = searchParams.get("search") || "";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  //
  const fetchDataOptions = {
    pageSize,
    pageIndex: pageNumber,
    groupId: params.groupId,
    parmas: params,
    search,
  };
  const { data, isLoading, isError, refetch } = useQuery({
    //
    queryKey: ["data", fetchDataOptions],
    queryFn: async () => {
      let reponse = await getMoreData(fetchDataOptions);
      if (reponse.rows) {
        let groups = JSON.parse(reponse.rows);
        // console.log("groups", groups);
        setPageCount(reponse.pageCount);
        setTotal(reponse.totaCount);
        return { rows: groups, pageCount: reponse.totalCount };
      }
    },
  });

  //
  const defaultData = React.useMemo(() => [], []);
  //
  const table = useReactTable({
    data: data?.rows ?? defaultData,
    columns: columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    debugTable: false,
  });

  if (isLoading) {
    return (
      <div
        className={`w-full  ${height}  flex flex-col items-start justify-start gap-2 p-6`}
      >
        {new Array(8).fill("").map((item, index) => {
          return (
            <Skeleton
              key={index}
              className="w-full h-[30px] rounded-sm bg-neutral-200"
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full ">
      {searchShow && (
        <div className="flex flex-row items-center w-full gap-1 ">
          <div className="flex-1 ">
            <Search placeHolder={placeHolder} />
          </div>
        </div>
      )}

      <ScrollArea className={` bg-white  w-full h-[calc(100vh-170px)]`}>
        <Table className="" wrapperClassName="overflow-clip">
          <TableHeader className="">
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
  );
}

const TableWrapPersonal = ({
  columns,
  getMoreData,
  subMenu,
  placeHolder,
  searchShow,
  height,
}: {
  columns: any;
  getMoreData: any;
  subMenu: boolean;
  placeHolder: string;
  searchShow: boolean;
  height: string | undefined;
}) => {
  return (
    <React.Suspense>
      <TableWrapData
        columns={columns}
        getMoreData={getMoreData}
        subMenu={subMenu}
        placeHolder={placeHolder}
        searchShow={searchShow}
        height={height}
      />
    </React.Suspense>
  );
};
export default TableWrapPersonal;
