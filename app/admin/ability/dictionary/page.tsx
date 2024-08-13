"use client";
import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_component/colums";
import { getMoreData } from "./_component/actions";

export default function Page() {
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={false}
          placeHolder="역량명을 검색하세요."
          searchShow={true}
          height="h-[calc(100vh-170px)]"
        />
      </div>
    </div>
  );
}
