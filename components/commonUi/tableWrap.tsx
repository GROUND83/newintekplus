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
import ReactPaginate from "react-paginate";
import { useDebouncedCallback } from "use-debounce";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoveLeft,
} from "lucide-react";
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
import { Input } from "../ui/input";
import Search from "./Search";

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
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const [heightSize, setHeightSize] = React.useState("100vh");
  const [pageCount, setPageCount] = React.useState(1);

  const [total, setTotal] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(100);
  const [pageNumber, setPageNumber] = React.useState(1);
  //
  const currentPage = React.useRef(1);
  //
  // const search = searchParams.get("search") || "";

  //
  React.useEffect(() => {
    let defaultHeight = "h-[calc(100vh-220px)]";
    if (subMenu) {
      defaultHeight = "h-[calc(100vh-220px)]";
      if (searchShow) {
        defaultHeight = "h-[calc(100vh-220px)]";
      } else {
        //
      }
    } else {
      defaultHeight = "h-[calc(100vh-170px)]";
      if (searchShow) {
        defaultHeight = "h-[calc(100vh-170px)]";
      } else {
        //
      }
    }
    setHeightSize(defaultHeight);
  }, [searchShow, subMenu]);

  const pageIndex = searchParams.get("page") || "";
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
        console.log("groups", groups);
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
    // debugTable: true,
  });

  React.useEffect(() => {
    console.log("pageIndex", pageIndex);
    if (pageIndex) {
      setPageNumber(Number(pageIndex));
    }
  }, [pageIndex]);
  //\
  const setSearchDAta = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage.current) {
      params.set("page", "1");
    }
    // currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`);
  };
  React.useEffect(() => {
    if (search) {
      setSearchDAta();
    }
  }, [search]);
  //
  const clickPrev = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage.current) {
      params.set("page", (pageNumber - 1).toString());
    }
    // currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`);
  };
  const clickNext = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage.current) {
      params.set("page", (pageNumber + 1).toString());
    }
    // currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectPageSize = (value: number) => {
    setPageSize(value);
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage.current) {
      params.set("page", "1");
    }
    // currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`);
  };

  //

  //
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
      {searchShow && <Search placeHolder={placeHolder} />}

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

      <div className="flex flex-row items-center justify-between space-x-2  h-[50px] bg-neutral-100 border-b px-3 border-t">
        <div className=" text-sm text-neutral-500   flex-1">
          <p className="text-xs">총 {data?.pageCount}개의 데이터가 있습니다.</p>
        </div>
        {data?.pageCount && data?.pageCount > 10 ? (
          <div className="space-x-2 flex flex-row items-center justify-center gap-2 flex-1">
            <Button
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
      </div>
    </div>
  );
}

const TableWrap = ({
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
export default TableWrap;
