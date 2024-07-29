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

import Search from "./Search";

function TableWrapUnlimitData({
  columns,
  getMoreData,
  subMenu,
  placeHolder,
  searchShow,
}: {
  columns: any;
  getMoreData: any;
  subMenu: boolean;
  placeHolder: string;
  searchShow: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const [heightSize, setHeightSize] = React.useState("100vh");

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
    } else if (!subMenu) {
      defaultHeight = "h-[calc(100vh-170px)]";
      if (searchShow) {
        defaultHeight = "h-[calc(100vh-170px)]";
      } else {
        //
      }
    }
    setHeightSize(defaultHeight);
  }, [searchShow, subMenu]);

  const search = searchParams.get("search") || "";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  //
  const fetchDataOptions = {
    groupId: params.groupId,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    //
    queryKey: ["data"],
    queryFn: async () => {
      let reponse = await getMoreData(params.groupId);
      if (reponse.rows) {
        let groups = JSON.parse(reponse.rows);
        console.log("groupsgroups", groups);
        return { rows: groups, pageCount: reponse.totalCount };
      }
    },
  });
  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: data?.rows ?? defaultData,
    columns: columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

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
  //

  //
  if (isLoading) {
    return (
      <div
        className={`w-full  ${heightSize}  flex flex-col items-center justify-center`}
      >
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full ">
      {searchShow && <Search placeHolder={placeHolder} />}

      <ScrollArea className={` bg-white  w-full ${heightSize} `}>
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
      </div>
    </div>
  );
}

const TableWrapUnlimit = ({
  columns,
  getMoreData,
  subMenu,
  placeHolder,
  searchShow,
}: {
  columns: any;
  getMoreData: any;
  subMenu: boolean;
  placeHolder: string;
  searchShow: boolean;
}) => {
  return (
    <React.Suspense>
      <TableWrapUnlimitData
        columns={columns}
        getMoreData={getMoreData}
        subMenu={subMenu}
        placeHolder={placeHolder}
        searchShow={searchShow}
      />
    </React.Suspense>
  );
};
export default TableWrapUnlimit;
