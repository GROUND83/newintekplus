"use client";
import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_components/table/colums";
import { getMoreData } from "./_components/table/actions";

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full ">
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={false}
          placeHolder="교육형태, 코스프로파일 명을 검색하세요."
          searchShow={true}
        />
      </div>
    </div>
  );
}
