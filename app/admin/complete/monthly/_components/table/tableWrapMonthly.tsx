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
      if (date?.from && date?.to) {
        let reponse = await getMoreData(fetchDataOptions);
        if (reponse.rows) {
          let groups = JSON.parse(reponse.rows);
          console.log("groups", groups);
          setPageCount(reponse.pageCount);
          setTotal(reponse.totaCount);
          return { rows: groups, pageCount: reponse.totalCount };
        }
      } else {
        return null;
      }
    },
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      refetch();
    }
  }, [date]);
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

  const clickPrev = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage.current) {
      params.set("page", (pageNumber - 1).toString());
      router.replace(`${pathname}?page=${(pageNumber - 1).toString()}`);
      setPageNumber((prev) => prev - 1);
    }
    // currentPage.current = e.selected + 1;
  };
  const clickNext = () => {
    const params = new URLSearchParams(searchParams.toString());
    console.log("pathnameparams", params, pageNumber, pathname);
    if (currentPage.current) {
      params.set("page", (pageNumber + 1).toString());
      router.replace(`${pathname}?page=${(pageNumber + 1).toString()}`);
      setPageNumber((prev) => prev + 1);
    }
    // currentPage.current = e.selected + 1;
  };

  const selectPageSize = (value: number) => {
    setPageSize(value);
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage.current) {
      params.set("page", "1");
      router.replace(`${pathname}?page=1`);
      setPageNumber(1);
    }
    // currentPage.current = e.selected + 1;
  };

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
          <div className="flex flex-row items-center ml-3 flex-1 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {dayjs(date.from).format("YYYY-MM-DD")} -{" "}
                        {dayjs(date.to).format("YYYY-MM-DD")}
                      </>
                    ) : (
                      dayjs(date.from).format("YYYY-MM-DD")
                    )
                  ) : (
                    <span>교육범위를 선택하세요.</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  locale={ko}
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <div className="flex flex-row">
              <Button className="" size="sm">
                현황표 다운
              </Button>
            </div>
          </div>
          <div className="flex-1 ">
            <Search placeHolder={placeHolder} />
          </div>
        </div>
      )}
      {date?.from && date?.to ? (
        <ScrollArea className={` bg-white  w-full ${height} `}>
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
      ) : (
        <div
          className={`bg-white  w-full ${height} flex flex-col items-center justify-center`}
        >
          <p>교육 기간 범위를 선택하세요.</p>
        </div>
      )}

      {/* <div className="flex flex-row items-center justify-between space-x-2  h-[50px] bg-neutral-100 border-b px-3 border-t">
        <div className=" text-sm text-neutral-500   flex-1">
          <p className="text-xs">총 {data?.pageCount}개의 데이터가 있습니다.</p>
        </div>
        {data?.pageCount && data?.pageCount > 10 ? (
          <div className="space-x-2 flex flex-row items-center justify-center gap-2 flex-1">
            <Button
              type="button"
              variant={pageNumber <= 1 ? "outline" : "default"}
              size="sm"
              onClick={() => clickPrev()}
              disabled={pageNumber <= 1 ? true : false}
            >
              <ChevronLeft />
            </Button>

            <p className="border px-6 py-2 rounded-md text-sm text-neutral-500 bg-white">
              {pageNumber} / {pageCount}
            </p>

            <Button
              type="button"
              variant={pageNumber >= pageCount ? `outline` : "default"}
              size="sm"
              onClick={() => clickNext()}
              disabled={pageNumber >= pageCount ? true : false}
            >
              <ChevronRight />
            </Button>
          </div>
        ) : null}

        <div className="flex flex-row items-center justify-center flex-1 gap-2">
          <p>테이블 출력</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              selectPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="테이블 출력" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50, 100, 200, 300, 400].map((pageSizevalue) => (
                <SelectItem
                  key={pageSizevalue}
                  value={pageSizevalue.toString()}
                >
                  {pageSizevalue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}
    </div>
  );
}

const TableWrapMonthly = ({
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
export default TableWrapMonthly;
